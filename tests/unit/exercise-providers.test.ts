import { describe, expect, it } from "vitest";
import { normalizeWgerExercise } from "@/features/fitness/providers/wger";

describe("exercise provider adapters", () => {
  it("normalizes an English wger exercise", () => {
    const result = normalizeWgerExercise({
      id: 12,
      category: { name: "Arms" },
      muscles: [{ name_en: "Biceps" }],
      equipment: [{ name: "Dumbbell" }],
      translations: [
        {
          language: 2,
          name: "Dumbbell curl",
          description: "<p>Curl with control.</p>",
        },
      ],
    });

    expect(result).toMatchObject({
      provider: "wger",
      title: "Dumbbell curl",
      primaryMuscles: ["Biceps"],
      equipment: ["Dumbbell"],
      instructions: ["Curl with control."],
    });
  });
});
