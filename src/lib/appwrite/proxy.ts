import { NextResponse, type NextRequest } from "next/server";
import { appwriteRequest } from "@/lib/appwrite/rest";
import { getAccountDestination, sanitizeNextPath } from "@/features/auth/redirects";

const protectedPrefixes = [
  "/today", "/nutrition", "/meals", "/meal-planner", "/recipes", "/grocery-list", "/train", "/training", "/workouts", "/session", "/exercises", "/workout-history", "/personal-records",
  "/progress", "/habits", "/goals", "/assistant", "/me", "/settings", "/notifications", "/onboarding", "/reset-password",
];
const ordinaryAuthRoutes = ["/sign-in", "/sign-up", "/magic-link", "/forgot-password"];
const publicPrefixes = ["/features", "/anatomy", "/blog", "/about", "/contact", "/privacy", "/terms"];

function isProtected(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isPublicPage(pathname: string) {
  return pathname === "/" || publicPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function localizedRewrite(request: NextRequest) {
  const locale = request.cookies.get("bfit-locale")?.value === "mk" ? "mk" : "en";
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export async function updateAppwriteSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (isPublicPage(pathname)) return localizedRewrite(request);
  if (!isProtected(pathname) && !ordinaryAuthRoutes.includes(pathname)) return NextResponse.next({ request });

  let account: { $id: string; prefs?: Record<string, unknown> } | null = null;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const secret = projectId ? request.cookies.get(`a_session_${projectId}`)?.value : undefined;
  if (secret && endpoint && projectId) {
    try {
      account = await appwriteRequest<{ $id: string; prefs?: Record<string, unknown> }>({ endpoint, projectId }, "/account", { method: "GET", session: secret });
    } catch {
      account = null;
    }
  }

  if (!account && isProtected(pathname)) {
    const signIn = request.nextUrl.clone();
    signIn.pathname = "/sign-in";
    signIn.searchParams.set("next", sanitizeNextPath(`${pathname}${request.nextUrl.search}`));
    return NextResponse.redirect(signIn);
  }
  if (account && ordinaryAuthRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(
      getAccountDestination(Boolean(account.prefs?.onboarding_complete), request.nextUrl.searchParams.get("next")),
      request.url,
    ));
  }

  const response = NextResponse.next({ request });
  if (isProtected(pathname)) response.headers.set("Cache-Control", "private, no-store");
  return response;
}
