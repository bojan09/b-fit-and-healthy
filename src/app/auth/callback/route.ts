import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAccountDestination, sanitizeNextPath } from "@/features/auth/redirects";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = sanitizeNextPath(url.searchParams.get("next"));
  if (!code) return NextResponse.redirect(new URL("/sign-in?error=missing-code", url.origin));

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/sign-in?error=invalid-callback", url.origin));
  if (url.searchParams.get("recovery") === "1") return NextResponse.redirect(new URL(`/reset-password?next=${encodeURIComponent(next)}`, url.origin));

  const { data: profile } = await supabase.from("profiles").select("onboarding_complete").maybeSingle();
  return NextResponse.redirect(new URL(getAccountDestination(Boolean(profile?.onboarding_complete), next), url.origin));
}
