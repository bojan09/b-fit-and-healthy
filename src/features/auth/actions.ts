"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { emailRequestSchema, resetPasswordSchema, signInSchema, signUpSchema } from "@/features/auth/schemas";
import { getAccountDestination, sanitizeNextPath } from "@/features/auth/redirects";
import type { AuthActionState } from "@/features/auth/types";
import { getLocale } from "@/lib/i18n/server";

const messages = {
  en: { fields: "Check the highlighted fields.", signIn: "We could not sign you in. Check your details and try again.", signUp: "We could not create your account. Please try again.", confirm: "Check your email to confirm your account.", email: "Enter a valid email address.", magic: "If an account exists, a secure sign-in link is on its way.", recovery: "If an account exists, password recovery instructions are on their way.", expired: "Your recovery session expired. Request a new reset link." },
  mk: { fields: "Проверете ги означените полиња.", signIn: "Не можевме да ве најавиме. Проверете ги податоците и обидете се пак.", signUp: "Не можевме да ја создадеме сметката. Обидете се повторно.", confirm: "Проверете ја е-поштата за да ја потврдите сметката.", email: "Внесете валидна е-адреса.", magic: "Ако постои сметка, безбедна врска за најава е на пат.", recovery: "Ако постои сметка, упатствата за нова лозинка се на пат.", expired: "Сесијата за обнова истече. Побарајте нова врска." },
} as const;
const text = async () => messages[await getLocale()];

function errorState(message: string, error?: { flatten(): { fieldErrors: Record<string, string[]> } }): AuthActionState {
  return { status: "error", message, fieldErrors: error?.flatten().fieldErrors };
}

async function callbackUrl(next: string, recovery = false) {
  const values = await headers();
  const origin = values.get("origin") ?? `${values.get("x-forwarded-proto") ?? "https"}://${values.get("x-forwarded-host") ?? values.get("host")}`;
  const url = new URL("/auth/callback", origin);
  url.searchParams.set("next", sanitizeNextPath(next));
  if (recovery) url.searchParams.set("recovery", "1");
  return url.toString();
}

export async function signInAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState((await text()).fields, parsed.error);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) return errorState((await text()).signIn);
  const { data: profile } = await supabase.from("profiles").select("onboarding_complete").maybeSingle();
  redirect(getAccountDestination(Boolean(profile?.onboarding_complete), parsed.data.next));
}

export async function signUpAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState((await text()).fields, parsed.error);
  const supabase = await createClient();
  const next = sanitizeNextPath(parsed.data.next);
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: await callbackUrl(next), data: { display_name: parsed.data.displayName, locale: parsed.data.locale } },
  });
  if (error) return errorState((await text()).signUp);
  if (data.session) redirect(getAccountDestination(false, next));
  return { status: "success", message: (await text()).confirm };
}

export async function magicLinkAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = emailRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState((await text()).email, parsed.error);
  const supabase = await createClient();
  await supabase.auth.signInWithOtp({ email: parsed.data.email, options: { emailRedirectTo: await callbackUrl(parsed.data.next ?? "/today") } });
  return { status: "success", message: (await text()).magic };
}

export async function forgotPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = emailRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState((await text()).email, parsed.error);
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: await callbackUrl(parsed.data.next ?? "/today", true) });
  return { status: "success", message: (await text()).recovery };
}

export async function googleOAuthAction(formData: FormData) {
  const next = sanitizeNextPath(String(formData.get("next") ?? "/today"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: await callbackUrl(next) } });
  if (error || !data.url) redirect("/sign-in?error=oauth");
  redirect(data.url);
}

export async function resetPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return errorState((await text()).fields, parsed.error);
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return errorState((await text()).expired);
  redirect(sanitizeNextPath(parsed.data.next));
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
