import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function loadAccountSettings(userId: string) {
  const supabase = await createClient();
  const [profile, settings, target] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("user_settings")
      .select("units,timezone")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("daily_targets")
      .select("energy_kcal,water_ml,protein_g")
      .eq("user_id", userId)
      .order("effective_from", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (profile.error || settings.error || !profile.data || !settings.data) {
    throw new Error("ACCOUNT_SETTINGS_UNAVAILABLE");
  }

  return { profile: profile.data, settings: settings.data, target: target.data ?? null };
}
