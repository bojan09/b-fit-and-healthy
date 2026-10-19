import { NextResponse } from "next/server";
import { appwriteRequest } from "@/lib/appwrite/rest";
import { appwriteAdminRequest, getAppwriteConfig, setAppwriteSession } from "@/lib/appwrite/server";
import { getAccountDestination, sanitizeNextPath } from "@/features/auth/redirects";

type SessionResponse = { secret: string; expire: string };
type AccountResponse = { prefs?: Record<string, unknown> };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = sanitizeNextPath(url.searchParams.get("next"));
  const userId = url.searchParams.get("userId");
  const secret = url.searchParams.get("secret");
  const mode = url.searchParams.get("mode");
  const state = url.searchParams.get("state");
  const config = getAppwriteConfig();
  const response = NextResponse.redirect(new URL("/sign-in?error=invalid-callback", url.origin));
  const expectedState = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith("appwrite_oauth_state="))?.slice("appwrite_oauth_state=".length);

  if (!userId || !secret) return response;

  if (mode === "recovery") {
    const recovery = NextResponse.redirect(new URL(`/reset-password?next=${encodeURIComponent(next)}`, url.origin));
    const secure = url.protocol === "https:";
    recovery.cookies.set("appwrite_recovery_user", userId, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 600 });
    recovery.cookies.set("appwrite_recovery_secret", secret, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 600 });
    return recovery;
  }

  if (mode === "verification") {
    try {
      await appwriteRequest(config, "/account/verifications/email", { method: "PUT", body: { userId, secret } });
      return NextResponse.redirect(new URL("/sign-in?verified=1", url.origin));
    } catch {
      return response;
    }
  }

  if (mode === "magic") {
    try {
      const session = await appwriteRequest<SessionResponse>(config, "/account/sessions/token", {
        method: "POST",
        body: { userId, secret },
      });
      await setAppwriteSession(session);
      const account = await appwriteRequest<AccountResponse>(config, "/account", { method: "GET", session: session.secret });
      return NextResponse.redirect(new URL(getAccountDestination(Boolean(account.prefs?.onboarding_complete), next), url.origin));
    } catch {
      return response;
    }
  }

  if (!expectedState || !state || decodeURIComponent(expectedState) !== state) return response;

  try {
    const session = await appwriteAdminRequest<SessionResponse>("/account/sessions/token", {
      method: "POST",
      body: { userId, secret },
    });
    await setAppwriteSession(session);
    const account = await appwriteRequest<AccountResponse>(config, "/account", { method: "GET", session: session.secret });
    const success = NextResponse.redirect(new URL(getAccountDestination(Boolean(account.prefs?.onboarding_complete), next), url.origin));
    success.cookies.delete("appwrite_oauth_state");
    return success;
  } catch {
    return response;
  }
}
