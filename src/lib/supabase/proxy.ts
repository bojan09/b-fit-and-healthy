import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv } from "@/lib/env/public";
import type { Database } from "@/types/database";

const protectedPrefixes = [
  "/today", "/nutrition", "/meals", "/meal-planner", "/recipes",
  "/grocery-list", "/train", "/workouts", "/session", "/exercises",
  "/progress", "/habits", "/assistant", "/me", "/settings", "/notifications"
];

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
      signIn.searchParams.set("next", pathname);
      return NextResponse.redirect(signIn);
    }
  } catch {
    // Public foundation pages remain reviewable while configuration is repaired.
    // Protected route components still authorize before reading user data.
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
