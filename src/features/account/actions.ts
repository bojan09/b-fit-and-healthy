"use server";

import { revalidatePath } from "next/cache";
import type { AuthActionState } from "@/features/auth/types";
import { accountSettingsSchema, dailyTargetsSchema } from "@/features/account/schemas";
import { appwriteSessionRequest, createClient, getCurrentAppwriteUser } from "@/lib/appwrite/server";

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

  const appwrite = await createClient();
  const user = await getCurrentAppwriteUser();

  if (!user) {
    return { status: "error", message: "Sign in to update your account." };
  }

  try {
    await appwriteSessionRequest("/account/name", { method: "PATCH", body: { name: parsed.data.displayName } });
  } catch {
    return { status: "error", message: "Your account settings could not be updated." };
  }

  const [profile, settings] = await Promise.all([
    appwrite
      .table("profiles")
      .update({ display_name: parsed.data.displayName })
      .eq("user_id", user.id),
    appwrite
      .table("user_settings")
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

  const appwrite = await createClient();
  const user = await getCurrentAppwriteUser();
  if (!user) return { status: "error", message: "Sign in to update your targets." };

  // Targets are versioned by day; saving again today replaces today's row.
  const { error } = await appwrite.table("daily_targets").upsert(
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
