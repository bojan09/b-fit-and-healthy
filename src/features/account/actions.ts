"use server";

import { revalidatePath } from "next/cache";
import type { AuthActionState } from "@/features/auth/types";
import { accountSettingsSchema, dailyTargetsSchema } from "@/features/account/schemas";
import { createClient } from "@/lib/supabase/server";

export async function updateAccountSettingsAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = accountSettingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check your display name, units, and timezone.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Sign in to update your account." };
  }

  const [profile, settings] = await Promise.all([
    supabase
      .from("profiles")
      .update({ display_name: parsed.data.displayName })
      .eq("user_id", user.id),
    supabase
      .from("user_settings")
      .update({
        units: parsed.data.units,
        timezone: parsed.data.timezone,
      })
      .eq("user_id", user.id),
  ]);

  if (profile.error || settings.error) {
    return {
      status: "error",
      message: "Your account settings could not be updated.",
    };
  }

  for (const path of ["/settings", "/today", "/progress"]) {
    revalidatePath(path);
  }

  return { status: "success", message: "Account settings updated." };
}

export async function updateDailyTargetsAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = dailyTargetsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Enter whole numbers, or leave a target empty." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Sign in to update your targets." };

  // Targets are versioned by day; saving again today replaces today's row.
  const { error } = await supabase.from("daily_targets").upsert(
    {
      user_id: user.id,
      effective_from: new Date().toISOString().slice(0, 10),
      energy_kcal: parsed.data.energyKcal,
      water_ml: parsed.data.waterMl,
      protein_g: parsed.data.proteinG,
    },
    { onConflict: "user_id,effective_from" },
  );
  if (error) return { status: "error", message: "Your targets could not be saved." };

  for (const path of ["/settings", "/today", "/nutrition"]) revalidatePath(path);
  return { status: "success", message: "Daily targets saved." };
}
