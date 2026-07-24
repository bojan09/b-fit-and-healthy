import type { Locale } from "@/lib/i18n/config";

export type MealDraft = {
  kind: "meal";
  title: string;
  plannedOn: string;
  mealSlot: "breakfast" | "lunch" | "dinner" | "snack";
  label: string;
  servings: number;
};

export type WorkoutDraft = {
  kind: "workout";
  title: string;
  name: string;
  description: string;
  durationMinutes: number;
  exerciseSlugs: string[];
};

export type HabitDraft = {
  kind: "habit";
  title: string;
  habitTitle: string;
};

export type RecipeDraft = {
  kind: "recipe";
  title: string;
  slug: string;
  summary: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  ingredients: Array<{ name: string; quantity: number; unit: string }>;
  steps: string[];
};

export type SummaryDraft = {
  kind: "summary";
  title: string;
  body: string;
};

export type AssistantDraft = MealDraft | WorkoutDraft | HabitDraft | RecipeDraft | SummaryDraft;

export type AssistantContext = {
  locale: Locale;
  profile: { displayName: string; units: string; timezone: string };
  goals: string[];
  preferences: string[];
  today: {
    energyKcal: number;
    proteinG: number;
    waterMl: number;
    habitsCompleted: number;
    habitsTotal: number;
    movementMinutes: number;
  };
  trends: {
    days: number;
    mealsLogged: number;
    workoutsCompleted: number;
    habitCompletionRate: number | null;
    weightChangeKg: number | null;
  };
};

export type AssistantStreamEvent =
  | { type: "meta"; conversationId: string; expiresAt: string }
  | { type: "token"; value: string }
  | { type: "draft"; value: AssistantDraft; messageId?: string }
  | { type: "done"; messageId: string }
  | { type: "error"; code: string; message: string; retryAfter?: number };

export type AssistantConversationSummary = {
  id: string;
  title: string;
  locale: Locale;
  expiresAt: string;
  lastMessageAt: string;
};

export type AssistantUiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  draft: AssistantDraft | null;
  status: "complete" | "aborted" | "failed";
  appliedAt: string | null;
};

export type AssistantConversationDetail = AssistantConversationSummary & {
  messages: AssistantUiMessage[];
};
