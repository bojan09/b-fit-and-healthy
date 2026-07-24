import { describe, expect, it } from "vitest";
import {
  assistantDraftSchema,
  assistantRequestSchema,
  habitDraftSchema,
  mealDraftSchema,
  recipeDraftSchema,
  workoutDraftSchema,
} from "@/features/assistant/schemas";

describe("assistant request schema", () => {
  it("accepts a bounded message and optional conversation", () => {
    expect(assistantRequestSchema.parse({ message: "Plan dinner" }).message).toBe("Plan dinner");
    expect(assistantRequestSchema.parse({
      message: "Adapt my workout",
      conversationId: "5ca8019f-a1db-4fd6-aa3b-b1b3190cc51a",
    }).conversationId).toBeTruthy();
  });

  it("rejects empty, oversized, and invalid conversation input", () => {
    expect(() => assistantRequestSchema.parse({ message: "" })).toThrow();
    expect(() => assistantRequestSchema.parse({ message: "x".repeat(2001) })).toThrow();
    expect(() => assistantRequestSchema.parse({ message: "Hello", conversationId: "not-a-uuid" })).toThrow();
  });
});

describe("assistant drafts", () => {
  it("validates the four mutable drafts and a summary", () => {
    expect(mealDraftSchema.parse({
      kind: "meal", title: "Dinner", plannedOn: "2026-07-24", mealSlot: "dinner",
      label: "Lentil bowl", servings: 2,
    }).kind).toBe("meal");
    expect(workoutDraftSchema.parse({
      kind: "workout", title: "Upper body", name: "Upper body express",
      description: "A short controlled session.", durationMinutes: 25,
      exerciseSlugs: ["push-up", "one-arm-row"],
    }).durationMinutes).toBe(25);
    expect(habitDraftSchema.parse({ kind: "habit", title: "Daily walk", habitTitle: "Walk for 10 minutes" }).kind).toBe("habit");
    expect(recipeDraftSchema.parse({
      kind: "recipe", title: "Lentil salad", slug: "lentil-salad",
      summary: "A simple balanced meal.", servings: 2, prepMinutes: 10, cookMinutes: 15,
      ingredients: [{ name: "Lentils", quantity: 200, unit: "g" }],
      steps: ["Combine and serve."],
    }).ingredients).toHaveLength(1);
    expect(assistantDraftSchema.parse({
      kind: "summary", title: "Your week", body: "You completed three planned sessions.",
    }).kind).toBe("summary");
  });

  it("rejects unsafe bounds and unknown draft kinds", () => {
    expect(() => mealDraftSchema.parse({
      kind: "meal", title: "Meal", plannedOn: "tomorrow", mealSlot: "brunch", label: "Food", servings: 0,
    })).toThrow();
    expect(() => workoutDraftSchema.parse({
      kind: "workout", title: "Workout", name: "Workout", description: "", durationMinutes: 500,
      exerciseSlugs: ["not valid"],
    })).toThrow();
    expect(() => assistantDraftSchema.parse({ kind: "diagnosis", title: "Result" })).toThrow();
  });
});

