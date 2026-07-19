"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addWaterSchema, deleteWaterSchema, goalSchema, goalStatusSchema, habitCheckinSchema, habitSchema, recordIdSchema, weightSchema } from "@/features/tracking/schemas";
import { fluidOuncesToMl, lbToKg } from "@/features/tracking/domain";
import type { AuthActionState } from "@/features/auth/types";

const invalid = (message = "Check the highlighted fields."): AuthActionState => ({ status: "error", message });
async function authorized() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/sign-in"); return { supabase, user }; }
function refreshTracking() { revalidatePath("/today"); revalidatePath("/habits"); revalidatePath("/goals"); revalidatePath("/progress"); revalidatePath("/notifications"); }

export async function addWaterAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = addWaterSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return invalid("Enter a valid water amount.");
  const { supabase, user } = await authorized(); const amountMl = parsed.data.units === "imperial" ? fluidOuncesToMl(parsed.data.amount) : parsed.data.amount;
  const result = await supabase.from("water_logs").insert({ user_id: user.id, amount_ml: Math.round(amountMl), ...(parsed.data.loggedAt ? { logged_at: parsed.data.loggedAt } : {}) });
  if (result.error) return invalid("Water could not be saved. Try again."); refreshTracking(); return { status: "success", message: "Water added." };
}

export async function deleteWaterAction(formData: FormData) { const parsed = deleteWaterSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); await supabase.from("water_logs").delete().eq("id", parsed.data.id).eq("user_id", user.id); refreshTracking(); }

export async function saveWeightAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = weightSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return invalid("Enter a valid weight and date.");
  const { supabase, user } = await authorized(); const weightKg = parsed.data.units === "imperial" ? lbToKg(parsed.data.weight) : parsed.data.weight;
  if (weightKg < 20 || weightKg > 500) return invalid("Enter a weight between 20 and 500 kg (44 and 1,102 lb).");
  const result = await supabase.from("body_measurements").upsert({ user_id: user.id, recorded_on: parsed.data.recordedOn, weight_kg: Number(weightKg.toFixed(2)), note: parsed.data.note || null }, { onConflict: "user_id,recorded_on" });
  if (result.error) return invalid("The measurement could not be saved. Try again."); refreshTracking(); return { status: "success", message: "Measurement saved." };
}

export async function createHabitAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> { const parsed = habitSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return invalid("Enter a habit name."); const { supabase, user } = await authorized(); const result = await supabase.from("habits").insert({ user_id: user.id, title: parsed.data.title }); if (result.error) return invalid("The habit could not be saved."); refreshTracking(); return { status: "success", message: "Habit added." }; }

export async function setHabitCheckinAction(formData: FormData) { const parsed = habitCheckinSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); if (parsed.data.status === "clear") await supabase.from("habit_checkins").delete().eq("habit_id", parsed.data.habitId).eq("checkin_on", parsed.data.date).eq("user_id", user.id); else await supabase.from("habit_checkins").upsert({ user_id: user.id, habit_id: parsed.data.habitId, checkin_on: parsed.data.date, status: parsed.data.status }, { onConflict: "habit_id,checkin_on" }); refreshTracking(); }

export async function archiveHabitAction(formData: FormData) { const parsed = recordIdSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); await supabase.from("habits").update({ is_archived: true }).eq("id", parsed.data.id).eq("user_id", user.id); refreshTracking(); }

export async function createGoalAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> { const parsed = goalSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return invalid("Enter a valid goal."); const { supabase, user } = await authorized(); const result = await supabase.from("goals").insert({ user_id: user.id, kind: parsed.data.kind, target: parsed.data.target === "" || parsed.data.target === undefined ? null : parsed.data.target, unit: parsed.data.unit || null, ends_on: parsed.data.endsOn || null }); if (result.error) return invalid("The goal could not be saved."); refreshTracking(); return { status: "success", message: "Goal added." }; }

export async function setGoalStatusAction(formData: FormData) { const parsed = goalStatusSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); await supabase.from("goals").update({ status: parsed.data.status }).eq("id", parsed.data.id).eq("user_id", user.id); refreshTracking(); }

export async function markNotificationReadAction(formData: FormData) { const parsed = recordIdSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", parsed.data.id).eq("user_id", user.id); refreshTracking(); }
export async function markAllNotificationsReadAction() { const { supabase, user } = await authorized(); await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", user.id).is("read_at", null); refreshTracking(); }
