import { describe, expect, it } from "vitest";
import { draftDestination, recipeRows, workoutTemplateRow } from "@/features/assistant/draft-application";

describe("assistant draft application mapping", () => {
  it("maps mutable draft kinds to existing product destinations", () => {
    expect(draftDestination("meal")).toBe("/meal-planner");
    expect(draftDestination("workout")).toBe("/workouts");
    expect(draftDestination("habit")).toBe("/habits");
    expect(draftDestination("recipe")).toBe("/recipes");
    expect(draftDestination("summary")).toBe("/progress");
  });

  it("maps workout drafts without accepting owner data from the client", () => {
    expect(workoutTemplateRow({
      kind: "workout", title: "Upper", name: "Upper express", description: "Short session",
      durationMinutes: 25, exerciseSlugs: ["push-up"],
    }, "owner-id")).toEqual({
      user_id: "owner-id", name: "Upper express", description: "Short session", expected_duration_minutes: 25,
    });
  });

  it("creates private bilingual recipe rows with deterministic related rows", () => {
    const result = recipeRows({
      kind: "recipe", title: "Lentil bowl", slug: "lentil-bowl", summary: "Balanced bowl",
      servings: 2, prepMinutes: 10, cookMinutes: 20,
      ingredients: [{ name: "Lentils", quantity: 200, unit: "g" }],
      steps: ["Cook lentils."],
    }, "owner-id", "abc12345");
    expect(result.recipe).toMatchObject({ owner_id: "owner-id", slug: "lentil-bowl-abc12345", is_public: false });
    expect(result.ingredients[0]).toMatchObject({ position: 1, name_en: "Lentils", name_mk: "Lentils" });
    expect(result.steps[0]).toMatchObject({ position: 1, instruction_en: "Cook lentils." });
  });
});

