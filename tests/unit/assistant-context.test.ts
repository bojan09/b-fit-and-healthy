import { describe, expect, it } from "vitest";
import { summarizeAssistantContext, type RawAssistantContext } from "@/features/assistant/context-domain";

const raw: RawAssistantContext = {
  profile: { displayName: "Ana", units: "metric", timezone: "Europe/Skopje" },
  goals: [{ kind: "strength", target: 3, unit: "sessions" }],
  target: { energyKcal: 2100, proteinG: 115, waterMl: 2500, movementMinutes: 45 },
  today: {
    meals: [{ energyKcal: 420, proteinG: 20 }, { energyKcal: 620, proteinG: 42 }],
    water: [500, 1000],
    habits: 3,
    completedHabits: 2,
    movementMinutes: 34,
  },
  history: {
    mealDays: ["2026-07-01", "2026-07-02"],
    completedWorkouts: 6,
    habitCheckins: 18,
    habitOpportunities: 30,
    weights: [{ date: "2026-06-24", kg: 70 }, { date: "2026-07-23", kg: 69.4 }],
  },
};

describe("assistant context minimization", () => {
  it("returns only bounded summaries rather than raw records", () => {
    const context = summarizeAssistantContext(raw, "en");
    expect(context.profile).toEqual({ displayName: "Ana", units: "metric", timezone: "Europe/Skopje" });
    expect(context.today).toMatchObject({ energyKcal: 1040, proteinG: 62, waterMl: 1500 });
    expect(context.trends).toMatchObject({ days: 30, mealsLogged: 2, workoutsCompleted: 6, habitCompletionRate: 60, weightChangeKg: -0.6 });
    expect(JSON.stringify(context)).not.toContain("2026-07-01");
  });

  it("builds a short prompt summary without raw identifiers", () => {
    const context = summarizeAssistantContext(raw, "en");
    const serialized = JSON.stringify(context);
    expect(serialized.length).toBeLessThan(1200);
    expect(serialized).not.toContain("user_id");
  });
});
