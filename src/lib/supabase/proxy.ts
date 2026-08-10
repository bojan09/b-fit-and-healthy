import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv } from "@/lib/env/public";
import type { Database } from "@/types/database";
import { getAccountDestination, sanitizeNextPath } from "@/features/auth/redirects";

const protectedPrefixes = [
  "/today", "/nutrition", "/meals", "/meal-planner", "/recipes",
  "/grocery-list", "/train", "/training", "/workouts", "/session", "/exercises", "/workout-history", "/personal-records",
  "/progress", "/habits", "/goals", "/assistant", "/me", "/settings", "/notifications", "/onboarding", "/reset-password"
];
const ordinaryAuthRoutes = ["/sign-in", "/sign-up", "/magic-link", "/forgot-password"];

function isProtected(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  try {
    const env = getPublicEnv();
    const supabase = createServerClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          }
        }
      }
    );

    const { data, error } = await supabase.auth.getClaims();
    const pathname = request.nextUrl.pathname;
    if ((!data?.claims || error) && isProtected(pathname)) {
      const signIn = request.nextUrl.clone();
      signIn.pathname = "/sign-in";
      signIn.searchParams.set("next", sanitizeNextPath(`${pathname}${request.nextUrl.search}`));
      return NextResponse.redirect(signIn);
    }
    if (data?.claims && ordinaryAuthRoutes.includes(pathname)) {
      const { data: profile } = await supabase.from("profiles").select("onboarding_complete").eq("user_id", String(data.claims.sub)).maybeSingle();
      return NextResponse.redirect(new URL(getAccountDestination(Boolean(profile?.onboarding_complete), request.nextUrl.searchParams.get("next")), request.url));
    }
  } catch {
    // Public foundation pages remain reviewable while configuration is repaired.
    // Protected route components still authorize before reading user data.
  }

  if (isProtected(request.nextUrl.pathname)) {
    response.headers.set("Cache-Control", "private, no-store");
  }
  return response;
}
