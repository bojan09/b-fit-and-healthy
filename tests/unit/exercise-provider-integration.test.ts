import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveExerciseDiscovery } from "@/features/fitness/exercise-discovery";
import type { ExerciseSearchCriteria } from "@/features/fitness/exercise-search";
import {
  searchExerciseApiExercises,
} from "@/features/fitness/providers/exercise-api";
import {
  normalizeWgerExercise,
} from "@/features/fitness/providers/wger";
import {
  normalizeWrkoutExercise,
} from "@/features/fitness/providers/wrkout";

const providerRecords = [
  {
    id: "strength_press",
    name: "Machine chest press",
    primary_muscles: ["chest"],
    equipment: ["flat_bench"],
    pattern: "horizontal_push",
  },
  {
    id: "bodyweight_push_up",
    name: "Push-up",
    primary_muscles: ["chest"],
    equipment: ["none_bodyweight"],
    pattern: "horizontal_push",
  },
  {
    id: "band_pull_apart",
    name: "Pull-apart",
    primary_muscles: ["rear_delts"],
    equipment: ["resistance_bands"],
    pattern: "horizontal_pull",
  },
  {
    id: "bench_fly",
    name: "Chest fly",
    primary_muscles: ["chest"],
    equipment: ["flat_bench"],
    pattern: "horizontal_push",
  },
  {
    id: "cable_row",
    name: "Seated row",
    primary_muscles: ["mid_back"],
    equipment: ["cable_stack"],
    pattern: "horizontal_pull",
  },
  {
    id: "abdominal_crunch",
    name: "Crunch",
    primary_muscles: ["abs"],
    equipment: ["none_bodyweight"],
    pattern: "spinal_flexion",
  },
];

const cases: Array<{
  label: string;
  criteria: ExerciseSearchCriteria;
  expectedId: string;
}> = [
  {
    label: "strength type",
    criteria: {
      query: "strength",
      muscle: "",
      equipment: "",
      type: "strength",
    },
    expectedId: "exercise-api:strength_press",
  },
  {
    label: "bodyweight equipment",
    criteria: {
      query: "Bodyweight",
      muscle: "",
      equipment: "Bodyweight",
      type: "",
    },
    expectedId: "exercise-api:bodyweight_push_up",
  },
  {
    label: "band equipment",
    criteria: {
      query: "Band",
      muscle: "",
      equipment: "Band",
      type: "",
    },
    expectedId: "exercise-api:band_pull_apart",
  },
  {
    label: "bench equipment",
    criteria: {
      query: "Bench",
      muscle: "",
      equipment: "Bench",
      type: "",
    },
    expectedId: "exercise-api:bench_fly",
  },
  {
    label: "cable equipment",
    criteria: {
      query: "Cable",
      muscle: "",
      equipment: "Cable",
      type: "",
    },
    expectedId: "exercise-api:cable_row",
  },
  {
    label: "abdominal muscle",
    criteria: {
      query: "abdominals",
      muscle: "abdominals",
      equipment: "",
      type: "",
    },
    expectedId: "exercise-api:abdominal_crunch",
  },
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("exercise provider adapter to resolver", () => {
  it.each(cases)(
    "keeps a provider-native $label record discoverable",
    async ({ criteria, expectedId }) => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: providerRecords }),
      } as Response));

      const external = await searchExerciseApiExercises(criteria);
      const results = resolveExerciseDiscovery({
        local: [],
        external,
        criteria,
        context: {},
      });

      expect(results.map((item) => item.id)).toContain(expectedId);
    },
  );

  it("matches wger's bodyweight equipment label", () => {
    const item = normalizeWgerExercise({
      id: 77,
      license: {
        short_name: "CC-BY 4",
        url: "https://creativecommons.org/licenses/by/4.0/",
      },
      license_author: "wger contributor",
      muscles: [{ name_en: "Chest" }],
      equipment: [{ name: "none (bodyweight exercise)" }],
      translations: [{
        language: 2,
        name: "Floor press-up",
        description: "Press away from the floor.",
      }],
    });
    expect(item).not.toBeNull();

    const results = resolveExerciseDiscovery({
      local: [],
      external: [item!],
      criteria: {
        query: "Bodyweight",
        muscle: "",
        equipment: "Bodyweight",
        type: "",
      },
      context: {},
    });

    expect(results.map((exercise) => exercise.id)).toContain("wger:77");
  });

  it("matches a wrkout abdominals record for the core type", () => {
    const item = normalizeWrkoutExercise({
      name: "Controlled trunk raise",
      primaryMuscles: ["abdominals"],
      equipment: null,
      instructions: ["Raise with control."],
    }, "Controlled_Trunk_Raise");

    const results = resolveExerciseDiscovery({
      local: [],
      external: [item],
      criteria: {
        query: "core",
        muscle: "",
        equipment: "",
        type: "core",
      },
      context: {},
    });

    expect(results.map((exercise) => exercise.id)).toContain(
      "wrkout:Controlled_Trunk_Raise",
    );
  });
});
