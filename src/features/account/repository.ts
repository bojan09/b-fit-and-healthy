import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function loadAccountSettings(userId: string) {
  const supabase = await createClient();
  const [profile, settings] = await Promise.all([
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
  ]);

  if (profile.error || settings.error || !profile.data || !settings.data) {
    throw new Error("ACCOUNT_SETTINGS_UNAVAILABLE");
  }

  return { profile: profile.data, settings: settings.data };
}
