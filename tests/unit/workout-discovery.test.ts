import { describe, expect, it } from "vitest";
import { discoverWorkoutIdeas, workoutIdeas } from "@/features/fitness/workout-ideas";

describe("workout ideas", () => {
  it("ships a broad local starter collection", () => {
    expect(workoutIdeas.length).toBeGreaterThanOrEqual(12);
    expect(new Set(workoutIdeas.map((idea) => idea.goal))).toEqual(
      new Set(["strength", "mobility", "conditioning"]),
    );
  });

  it("filters by duration, equipment and goal", () => {
    const results = discoverWorkoutIdeas({
      goal: "strength",
      maxMinutes: 30,
      equipment: "Bodyweight",
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((idea) =>
      idea.goal === "strength"
      && idea.durationMinutes <= 30
      && idea.equipment.includes("Bodyweight"),
    )).toBe(true);
  });
});
