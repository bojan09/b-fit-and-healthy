import { describe, expect, it } from "vitest";
import {
  normalizeExerciseApiExercise,
} from "@/features/fitness/providers/exercise-api";
import { normalizeWgerExercise } from "@/features/fitness/providers/wger";
import {
  normalizeWrkoutExercise,
} from "@/features/fitness/providers/wrkout";

describe("exercise provider adapters", () => {
  it("normalizes an English wger exercise", () => {
    const result = normalizeWgerExercise({
      id: 12,
      license: {
        full_name: "Creative Commons Attribution Share Alike 4",
        short_name: "CC-BY-SA 4",
        url: "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
      },
      license_author: "wger contributor",
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
      license: {
        id: "CC-BY-SA-4.0",
        attribution: "wger contributor",
      },
    });
  });

  it("rejects wger exercises without a commercial license", () => {
    expect(normalizeWgerExercise({
      id: 13,
      license: {
        full_name: "Creative Commons Attribution NonCommercial 4",
        short_name: "CC-BY-NC 4",
        url: "https://creativecommons.org/licenses/by-nc/4.0/",
      },
      translations: [{ language: 2, name: "Restricted curl" }],
    })).toBeNull();
  });

  it("normalizes ExerciseAPI records with required attribution", () => {
    const result = normalizeExerciseApiExercise({
      id: "barbell_bench_press",
      name: "Barbell bench press",
      primary_muscles: ["pectoralis major"],
      secondary_muscles: ["triceps"],
      equipment: ["barbell", "bench"],
      pattern: "horizontal push",
      instructions: ["Set the shoulders.", "Press with control."],
    });

    expect(result).toMatchObject({
      provider: "exercise-api",
      title: "Barbell bench press",
      license: {
        id: "CC-BY-4.0",
        commercialUse: true,
      },
    });
    expect(result.attribution).toMatch(/ExerciseAPI/);
  });

  it("normalizes wrkout public-domain exercises", () => {
    const result = normalizeWrkoutExercise({
      name: "Barbell Curl",
      force: "pull",
      level: "beginner",
      mechanic: "isolation",
      equipment: "barbell",
      primaryMuscles: ["biceps"],
      secondaryMuscles: ["forearms"],
      instructions: ["Stand tall.", "Curl the bar."],
      category: "strength",
      images: [],
    }, "Barbell_Curl");

    expect(result).toMatchObject({
      provider: "wrkout",
      externalId: "Barbell_Curl",
      license: { id: "Unlicense", commercialUse: true },
    });
  });
});
