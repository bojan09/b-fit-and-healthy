"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPublicEnv } from "@/lib/env/public";
import { appwriteRequest } from "@/lib/appwrite/rest";
import { clearAppwriteSession, getAppwriteConfig, getAppwriteSessionCookieName, getCurrentAppwriteUser, setAppwriteSession } from "@/lib/appwrite/server";
import { emailRequestSchema, resetPasswordSchema, signInSchema, signUpSchema } from "@/features/auth/schemas";
import { getAccountDestination, sanitizeNextPath } from "@/features/auth/redirects";
import type { AuthActionState } from "@/features/auth/types";
import { getLocale } from "@/lib/i18n/server";

const messages = {
  en: { fields: "Check the highlighted fields.", signIn: "We could not sign you in. Check your details and try again.", signUp: "We could not create your account. Please try again.", confirm: "Check your email to confirm your account.", email: "Enter a valid email address.", magic: "If an account exists, a secure sign-in link is on its way.", recovery: "If an account exists, password recovery instructions are on their way.", expired: "Your recovery session expired. Request a new reset link." },
  mk: { fields: "Проверете ги означените полиња.", signIn: "Не можевме да ве најавиме. Проверете ги податоците и обидете се пак.", signUp: "Не можевме да ја создадеме сметката. Обидете се повторно.", confirm: "Проверете ја е-поштата за да ја потврдите сметката.", email: "Внесете валидна е-адреса.", magic: "Ако постои сметка, безбедна врска за најава е на пат.", recovery: "Ако постои сметка, упатствата за обнова се на пат.", expired: "Сесијата за обнова истече. Побарајте нова врска." },
} as const;

type SessionResponse = { secret: string; expire: string; userId: string };
const text = async () => messages[await getLocale()];

function errorState(message: string, error?: { flatten(): { fieldErrors: Record<string, string[]> } }): AuthActionState {
  return { status: "error", message, fieldErrors: error?.flatten().fieldErrors };
}

async function callbackUrl(next: string, mode?: "magic" | "recovery" | "verification") {
  const url = new URL("/auth/callback", getPublicEnv().NEXT_PUBLIC_SITE_URL);
  url.searchParams.set("next", sanitizeNextPath(next));
  if (mode) url.searchParams.set("mode", mode);
  return url.toString();
}

async function createEmailSession(email: string, password: string) {
  const session = await appwriteRequest<SessionResponse>(getAppwriteConfig(), "/account/sessions/email", {
    method: "POST",
    body: { email, password },
  });
  await setAppwriteSession(session);
  return session;
}

export async function signInAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState((await text()).fields, parsed.error);
  let onboardingComplete = false;
  try {
    const session = await createEmailSession(parsed.data.email, parsed.data.password);
    const user = await appwriteRequest<{ prefs?: Record<string, unknown> }>(getAppwriteConfig(), "/account", { method: "GET", session: session.secret });
    onboardingComplete = Boolean(user.prefs?.onboarding_complete);
  } catch {
    return errorState((await text()).signIn);
  }
  redirect(getAccountDestination(onboardingComplete, parsed.data.next));
}

export async function signUpAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState((await text()).fields, parsed.error);
  try {
    await appwriteRequest(getAppwriteConfig(), "/account", {
      method: "POST",
      body: { userId: randomUUID(), email: parsed.data.email, password: parsed.data.password, name: parsed.data.displayName },
    });
    const session = await appwriteRequest<SessionResponse>(getAppwriteConfig(), "/account/sessions/email", {
      method: "POST",
      body: { email: parsed.data.email, password: parsed.data.password },
    });
    try {
      await appwriteRequest(getAppwriteConfig(), "/account/verifications/email", {
        method: "POST",
        session: session.secret,
        body: { url: await callbackUrl(sanitizeNextPath(parsed.data.next), "verification") },
      });
    } finally {
      await appwriteRequest(getAppwriteConfig(), "/account/sessions/current", { method: "DELETE", session: session.secret }).catch(() => undefined);
    }
    return { status: "success", message: (await text()).confirm };
  } catch {
    return errorState((await text()).signUp);
  }
}

export async function magicLinkAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = emailRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState((await text()).email, parsed.error);
  try {
    await appwriteRequest(getAppwriteConfig(), "/account/tokens/magic-url", {
      method: "POST",
      body: {
        userId: randomUUID(),
        email: parsed.data.email,
        url: await callbackUrl(sanitizeNextPath(parsed.data.next), "magic"),
      },
    });
  } catch {
    // Keep the response indistinguishable for existing and unknown addresses.
  }
  return { status: "success", message: (await text()).magic };
}

export async function forgotPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = emailRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState((await text()).email, parsed.error);
  try {
    await appwriteRequest(getAppwriteConfig(), "/account/recovery", {
      method: "POST",
      body: { email: parsed.data.email, url: await callbackUrl(parsed.data.next ?? "/today", "recovery") },
    });
  } catch {
    // Keep the response indistinguishable for existing and unknown addresses.
  }
  return { status: "success", message: (await text()).recovery };
}

export async function googleOAuthAction(formData: FormData) {
  const next = sanitizeNextPath(String(formData.get("next") ?? "/today"));
  const config = getPublicEnv();
  const state = randomBytes(24).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set("appwrite_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/auth/callback",
    maxAge: 600,
  });

  const success = new URL(await callbackUrl(next));
  success.searchParams.set("state", state);
  const failure = new URL("/sign-in?error=oauth", success).toString();
  const url = new URL(`${config.NEXT_PUBLIC_APPWRITE_ENDPOINT.replace(/\/$/, "")}/account/tokens/oauth2/google`);
  url.searchParams.set("project", config.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
  url.searchParams.set("success", success.toString());
  url.searchParams.set("failure", failure);
  url.searchParams.set("state", state);
  redirect(url.toString());
}

export async function resetPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState((await text()).fields, parsed.error);
  const store = await cookies();
  const userId = store.get("appwrite_recovery_user")?.value;
  const secret = store.get("appwrite_recovery_secret")?.value;
  if (!userId || !secret) return errorState((await text()).expired);
  try {
    await appwriteRequest(getAppwriteConfig(), "/account/recovery", {
      method: "PUT",
      body: { userId, secret, password: parsed.data.password, passwordAgain: parsed.data.confirmPassword },
    });
    store.delete("appwrite_recovery_user");
    store.delete("appwrite_recovery_secret");
  } catch {
    return errorState((await text()).expired);
  }
  redirect("/sign-in?password-updated=1");
}

export async function signOutAction() {
  try {
    const user = await getCurrentAppwriteUser();
    if (user) {
      const session = (await cookies()).get(getAppwriteSessionCookieName())?.value;
      if (session) await appwriteRequest(getAppwriteConfig(), "/account/sessions/current", { method: "DELETE", session });
    }
  } finally {
    await clearAppwriteSession();
  }
  redirect("/sign-in");
}
