export type HabitStatus = "complete" | "skipped";
export type GoalStatus = "active" | "paused" | "complete";

export type DailySummaryInput = {
  waterMl: number;
  waterTargetMl: number | null;
  habits: Array<{ id: string; title: string; status: HabitStatus | null }>;
  goals: Array<{ id: string; kind: string; status: GoalStatus }>;
  latestWeightKg: number | null;
};

export type NextAction =
  | { kind: "water"; href: "#water" }
  | { kind: "habit"; href: "/habits"; label: string }
  | { kind: "goal"; href: "/goals" }
  | { kind: "weight"; href: "/progress#weight" }
  | { kind: "complete"; href: "/progress" };
