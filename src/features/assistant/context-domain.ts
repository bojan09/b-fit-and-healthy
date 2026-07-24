import type { Locale } from "@/lib/i18n/config";
import type { AssistantContext } from "@/features/assistant/types";

export type RawAssistantContext = {
  profile: { displayName: string; units: string; timezone: string };
  goals: Array<{ kind: string; target: number | null; unit: string | null }>;
  target: { energyKcal: number | null; proteinG: number | null; waterMl: number | null; movementMinutes: number | null };
  today: {
    meals: Array<{ energyKcal: number; proteinG: number }>;
    water: number[];
    habits: number;
    completedHabits: number;
    movementMinutes: number;
  };
  history: {
    mealDays: string[];
    completedWorkouts: number;
    habitCheckins: number;
    habitOpportunities: number;
    weights: Array<{ date: string; kg: number }>;
  };
};

const round = (value: number, decimals = 0) => Number(value.toFixed(decimals));

export function summarizeAssistantContext(raw: RawAssistantContext, locale: Locale): AssistantContext {
  const firstWeight = raw.history.weights.at(0)?.kg;
  const lastWeight = raw.history.weights.at(-1)?.kg;
  return {
    locale,
    profile: raw.profile,
    goals: raw.goals.slice(0, 10).map((goal) =>
      [goal.kind, goal.target, goal.unit].filter((value) => value !== null && value !== "").join(" ")
    ),
    preferences: [
      `units:${raw.profile.units}`,
      `energy-target:${raw.target.energyKcal ?? "unset"}`,
      `protein-target:${raw.target.proteinG ?? "unset"}`,
      `water-target:${raw.target.waterMl ?? "unset"}`,
      `movement-target:${raw.target.movementMinutes ?? "unset"}`,
    ],
    today: {
      energyKcal: round(raw.today.meals.reduce((sum, meal) => sum + meal.energyKcal, 0)),
      proteinG: round(raw.today.meals.reduce((sum, meal) => sum + meal.proteinG, 0), 1),
      waterMl: round(raw.today.water.reduce((sum, amount) => sum + amount, 0)),
      habitsCompleted: raw.today.completedHabits,
      habitsTotal: raw.today.habits,
      movementMinutes: raw.today.movementMinutes,
    },
    trends: {
      days: 30,
      mealsLogged: raw.history.mealDays.length,
      workoutsCompleted: raw.history.completedWorkouts,
      habitCompletionRate: raw.history.habitOpportunities
        ? round(raw.history.habitCheckins / raw.history.habitOpportunities * 100)
        : null,
      weightChangeKg: firstWeight !== undefined && lastWeight !== undefined
        ? round(lastWeight - firstWeight, 1)
        : null,
    },
  };
}

