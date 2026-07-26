import { describe, expect, it } from "vitest";
import { resolveExerciseDiscovery } from "@/features/fitness/exercise-discovery";
import type { DiscoveryExercise } from "@/features/discovery/types";

const exercise = (
  overrides: Partial<DiscoveryExercise>
    & Pick<DiscoveryExercise, "id" | "provider" | "title">,
): DiscoveryExercise => {
  const { id, provider, title, ...rest } = overrides;

  return {
    id,
    kind: "exercise",
    provider,
    externalId: overrides.externalId ?? id,
    title,
    normalizedTitle: title.toLocaleLowerCase(),
    sourceUrl: null,
    attribution: "Test source",
    retrievedAt: "2026-07-26T00:00:00.000Z",
    quality: provider === "local" ? "curated" : "verified",
    completeness: [],
    alternates: [],
    license: {
      id: provider === "local" ? "LOCAL-CURATED" : "Unlicense",
      name: "Test license",
      url: null,
      attribution: "Test source",
      commercialUse: true,
    },
    primaryMuscles: ["Biceps"],
    secondaryMuscles: [],
    equipment: ["Dumbbell"],
    difficulty: null,
    movementPattern: "strength",
    instructions: [],
    safety: null,
    media: [],
    ...rest,
  };
};

const connectedBicepsExercises = Array.from({ length: 70 }, (_, index) =>
  exercise({
    id: `exercise-api:biceps-curl-${index}`,
    provider: "exercise-api",
    title: `Biceps dumbbell curl ${index}`,
  }),
);

describe("exercise discovery route domain", () => {
  it("filters connected exercises, prefers local duplicates, and caps ranked results", () => {
    const localDuplicate = exercise({
      id: "local:biceps-curl-0",
      provider: "local",
      title: "Biceps dumbbell curl 0",
    });
    const mismatches = [
      exercise({
        id: "wger:triceps-extension",
        provider: "wger",
        title: "Triceps extension",
        primaryMuscles: ["Triceps"],
      }),
      exercise({
        id: "wger:barbell-curl",
        provider: "wger",
        title: "Biceps barbell curl",
        equipment: ["Barbell"],
      }),
      exercise({
        id: "wger:biceps-mobility",
        provider: "wger",
        title: "Biceps mobility drill",
        movementPattern: "mobility",
      }),
    ];
    const external = [...connectedBicepsExercises, ...mismatches];

    const muscleOnly = resolveExerciseDiscovery({
      local: [localDuplicate],
      external,
      criteria: { query: "", muscle: "biceps", equipment: "", type: "" },
      context: {},
    });
    const nonMatching = resolveExerciseDiscovery({
      local: [],
      external: mismatches,
      criteria: {
        query: "",
        muscle: "biceps",
        equipment: "dumbbells",
        type: "strength",
      },
      context: {},
    });
    const structured = resolveExerciseDiscovery({
      local: [localDuplicate],
      external,
      criteria: {
        query: "",
        muscle: "biceps",
        equipment: "dumbbells",
        type: "strength",
      },
      context: {},
    });

    expect(muscleOnly.map((item) => item.id)).toContain(
      "exercise-api:biceps-curl-1",
    );
    expect(muscleOnly.map((item) => item.id)).not.toContain(
      "wger:triceps-extension",
    );
    expect(nonMatching).toEqual([]);
    expect(structured).toHaveLength(60);
    expect(structured[0]?.id).toBe("local:biceps-curl-0");
    expect(structured.map((item) => item.id)).not.toEqual(
      expect.arrayContaining([
        "exercise-api:biceps-curl-0",
        "wger:triceps-extension",
        "wger:barbell-curl",
        "wger:biceps-mobility",
      ]),
    );
  });
});
