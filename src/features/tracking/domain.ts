import type { DailySummaryInput, NextAction } from "@/features/tracking/types";

const KG_TO_LB = 2.2046226218;
const ML_TO_FL_OZ = 0.0338140227;

export function localDateInTimezone(timezone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export const kgToLb = (kg: number) => kg * KG_TO_LB;
export const lbToKg = (lb: number) => lb / KG_TO_LB;
export const mlToFluidOunces = (ml: number) => ml * ML_TO_FL_OZ;
export const fluidOuncesToMl = (ounces: number) => ounces / ML_TO_FL_OZ;

export function ratio(value: number, target: number | null) {
  if (!target || target <= 0) return null;
  return Math.min(1, Math.max(0, value / target));
}

export function buildDailySummary(input: DailySummaryInput) {
  const completedHabits = input.habits.filter((habit) => habit.status === "complete").length;
  const pendingHabit = input.habits.find((habit) => habit.status === null);
  let nextAction: NextAction;

  if (input.waterTargetMl && input.waterMl < input.waterTargetMl) nextAction = { kind: "water", href: "#water" };
  else if (pendingHabit) nextAction = { kind: "habit", href: "/habits", label: pendingHabit.title };
  else if (input.goals.some((goal) => goal.status === "active")) nextAction = { kind: "goal", href: "/goals" };
  else if (input.latestWeightKg === null) nextAction = { kind: "weight", href: "/progress#weight" };
  else nextAction = { kind: "complete", href: "/progress" };

  return {
    input,
    completedHabits,
    totalHabits: input.habits.length,
    activeGoals: input.goals.filter((goal) => goal.status === "active").length,
    waterRatio: ratio(input.waterMl, input.waterTargetMl),
    habitRatio: ratio(completedHabits, input.habits.length || null),
    nextAction,
  };
}
