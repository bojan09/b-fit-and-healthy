"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/features/auth/schemas";
import { sanitizeNextPath } from "@/features/auth/redirects";
import type { AuthActionState } from "@/features/auth/types";
import { getAuthContent } from "@/features/auth/content";

export async function completeOnboardingAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const errors = getAuthContent(formData.get("locale") === "mk" ? "mk" : "en").onboardingErrors;
  const parsed = onboardingSchema.safeParse({ ...Object.fromEntries(formData), priorities: formData.getAll("priorities") });
  if (!parsed.success) return { status: "error", message: errors.invalid, fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const profile = await supabase.from("profiles").upsert({ user_id: user.id, display_name: parsed.data.displayName, locale: parsed.data.locale, onboarding_complete: false });
  if (profile.error) return { status: "error", message: errors.profile };
  const settings = await supabase.from("user_settings").upsert({ user_id: user.id, units: parsed.data.units, timezone: parsed.data.timezone });
  if (settings.error) return { status: "error", message: errors.settings };

  const { data: existing } = await supabase.from("goals").select("kind").eq("user_id", user.id).eq("status", "active");
  const kinds = new Set((existing ?? []).map((goal) => goal.kind));
  const missing = parsed.data.priorities.filter((kind) => !kinds.has(kind)).map((kind) => ({ user_id: user.id, kind }));
  if (missing.length) {
    const result = await supabase.from("goals").insert(missing);
    if (result.error) return { status: "error", message: errors.goals };
  }

  const completed = await supabase.from("profiles").update({ onboarding_complete: true }).eq("user_id", user.id);
  if (completed.error) return { status: "error", message: errors.complete };
  redirect(sanitizeNextPath(parsed.data.next));
}
