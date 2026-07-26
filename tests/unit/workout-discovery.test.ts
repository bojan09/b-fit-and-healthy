import { describe, expect, it } from "vitest";
import { exercises } from "@/features/fitness/catalogue";
import {
  discoverWorkoutIdeas,
  getWorkoutIdea,
  workoutIdeas,
} from "@/features/fitness/workout-ideas";
import { localDiscoveryWorkouts } from "@/features/discovery/local";

const catalogueSlugs = new Set(exercises.map((exercise) => exercise.slug));

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

  it("gives every full-body preset ten unique valid exercises", () => {
    const fullBody = workoutIdeas.filter((idea) => idea.isFullBody);

    expect(fullBody.map((idea) => idea.slug)).toEqual([
      "bodyweight-foundations",
      "dumbbell-full-body",
      "warm-up-flow",
      "steady-circuit",
    ]);

    for (const idea of fullBody) {
      const slugs = idea.exercises.map((row) => row.exerciseSlug);
      expect(slugs).toHaveLength(10);
      expect(new Set(slugs)).toHaveLength(10);
      expect(slugs.every((slug) => catalogueSlugs.has(slug))).toBe(true);
    }
  });

  it("uses duration prescriptions for warm-up movements", () => {
    const warmup = getWorkoutIdea("warm-up-flow");

    expect(warmup).toBeDefined();
    expect(warmup?.exercises.every((row) =>
      row.durationSeconds !== null
      && row.repMin === null
      && row.repMax === null
    )).toBe(true);
  });

  it("uses valid sets, rest, reps, or duration", () => {
    for (const idea of workoutIdeas) {
      for (const row of idea.exercises) {
        expect(row.sets).toBeGreaterThan(0);
        expect(row.restSeconds).toBeGreaterThanOrEqual(0);
        expect(
          row.durationSeconds !== null
          || (row.repMin !== null && row.repMax !== null),
        ).toBe(true);
      }
    }
  });

  it("preserves every prescription in local workout discovery", () => {
    const source = getWorkoutIdea("dumbbell-full-body");
    const normalized = localDiscoveryWorkouts.find(
      (item) => item.externalId === source?.slug,
    );

    expect(source).toBeDefined();
    expect(normalized?.exercises).toHaveLength(10);
    expect(normalized?.exercises[0]).toMatchObject({
      exerciseId: `local:${source?.exercises[0].exerciseSlug}`,
      sets: source?.exercises[0].sets,
      repMin: source?.exercises[0].repMin,
    });
  });
});
