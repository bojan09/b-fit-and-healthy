import "server-only";

import type { Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { summarizeAssistantContext } from "@/features/assistant/context-domain";
import { localDateInTimezone } from "@/features/tracking/domain";

export async function buildAssistantContext(userId: string, locale: Locale, now = new Date()) {
  const supabase = await createClient();
  const [profile, settings] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("user_id", userId).single(),
    supabase.from("user_settings").select("units,timezone").eq("user_id", userId).single(),
  ]);
  if (profile.error || settings.error || !profile.data || !settings.data) throw new Error("ASSISTANT_CONTEXT_UNAVAILABLE");
  const timezone = settings.data.timezone;
  const today = localDateInTimezone(timezone, now);
  const sinceDate = new Date(now.getTime() - 29 * 86_400_000).toISOString().slice(0, 10);
  const sinceTime = `${sinceDate}T00:00:00.000Z`;
  const [
    targets, goals, meals, water, habits, checkins,
    sessions, measurements,
  ] = await Promise.all([
    supabase.from("daily_targets").select("energy_kcal,protein_g,water_ml,movement_minutes")
      .eq("user_id", userId).order("effective_from", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("goals").select("kind,target,unit").eq("user_id", userId).eq("status", "active").limit(10),
    supabase.from("meal_entries").select("logged_on,energy_kcal,protein_g").eq("user_id", userId).gte("logged_on", sinceDate),
    supabase.from("water_logs").select("amount_ml,logged_at").eq("user_id", userId).gte("logged_at", sinceTime),
    supabase.from("habits").select("id").eq("user_id", userId).eq("is_archived", false),
    supabase.from("habit_checkins").select("habit_id,checkin_on,status").eq("user_id", userId).gte("checkin_on", sinceDate),
    supabase.from("workout_sessions").select("id,finished_at,duration_seconds").eq("user_id", userId)
      .eq("status", "complete").gte("finished_at", sinceTime),
    supabase.from("body_measurements").select("recorded_on,weight_kg").eq("user_id", userId)
      .gte("recorded_on", sinceDate).order("recorded_on"),
  ]);
  const errors = [targets, goals, meals, water, habits, checkins, sessions, measurements]
    .map((result) => result.error).filter(Boolean);
  if (errors.length) throw new Error("ASSISTANT_CONTEXT_UNAVAILABLE");

  const todaysMeals = (meals.data ?? []).filter((entry) => entry.logged_on === today);
  const todaysWater = (water.data ?? []).filter((entry) => localDateInTimezone(timezone, new Date(entry.logged_at)) === today);
  const todaysCheckins = (checkins.data ?? []).filter((entry) => entry.checkin_on === today && entry.status === "complete");
  const activeHabitCount = habits.data?.length ?? 0;

  return summarizeAssistantContext({
    profile: { displayName: profile.data.display_name, units: settings.data.units, timezone: settings.data.timezone },
    goals: (goals.data ?? []).map((goal) => ({ kind: goal.kind, target: goal.target === null ? null : Number(goal.target), unit: goal.unit })),
    target: {
      energyKcal: targets.data?.energy_kcal ?? null,
      proteinG: targets.data?.protein_g === null || targets.data?.protein_g === undefined ? null : Number(targets.data.protein_g),
      waterMl: targets.data?.water_ml ?? null,
      movementMinutes: targets.data?.movement_minutes ?? null,
    },
    today: {
      meals: todaysMeals.map((meal) => ({ energyKcal: Number(meal.energy_kcal), proteinG: Number(meal.protein_g) })),
      water: todaysWater.map((entry) => entry.amount_ml),
      habits: activeHabitCount,
      completedHabits: todaysCheckins.length,
      movementMinutes: (sessions.data ?? []).filter((session) => session.finished_at && localDateInTimezone(timezone, new Date(session.finished_at)) === today)
        .reduce((sum, session) => sum + Math.round((session.duration_seconds ?? 0) / 60), 0),
    },
    history: {
      mealDays: [...new Set((meals.data ?? []).map((entry) => entry.logged_on))],
      completedWorkouts: sessions.data?.length ?? 0,
      habitCheckins: (checkins.data ?? []).filter((entry) => entry.status === "complete").length,
      habitOpportunities: activeHabitCount * 30,
      weights: (measurements.data ?? []).map((entry) => ({ date: entry.recorded_on, kg: Number(entry.weight_kg) })),
    },
  }, locale);
}

export { summarizeAssistantContext } from "@/features/assistant/context-domain";
export type { RawAssistantContext } from "@/features/assistant/context-domain";
