import { describe, expect, it } from "vitest";
import { mergeAndRank } from "@/features/discovery/merge";
import type {
  DiscoveryExercise,
  DiscoveryFood,
} from "@/features/discovery/types";

const food = (
  overrides: Partial<DiscoveryFood> & Pick<DiscoveryFood, "id" | "provider" | "title">,
): DiscoveryFood => {
  const { id, provider, title, ...rest } = overrides;
  return {
  id,
  kind: "food",
  provider,
  externalId: overrides.externalId ?? id,
  title,
  normalizedTitle: title.toLocaleLowerCase(),
  sourceUrl: null,
  attribution: "Test source",
  retrievedAt: "2026-07-25T00:00:00.000Z",
  quality: provider === "local" ? "curated" : "verified",
  completeness: [],
  alternates: [],
  brand: null,
  servingAmount: 100,
  servingUnit: "g",
  energyKcal: 379,
  proteinG: null,
  carbohydrateG: null,
  fatG: null,
  fibreG: null,
  barcode: null,
  nutrientBasis: "per-100-g",
  ...rest,
  };
};

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
  retrievedAt: "2026-07-25T00:00:00.000Z",
  quality: provider === "local" ? "curated" : "community",
  completeness: [],
  alternates: [],
  license: provider === "local"
    ? {
        id: "LOCAL-CURATED",
        name: "Local",
        url: null,
        attribution: "Test source",
        commercialUse: true,
      }
    : {
        id: "Unlicense",
        name: "Unlicense",
        url: null,
        attribution: "Test source",
        commercialUse: true,
      },
  primaryMuscles: ["chest"],
  secondaryMuscles: [],
  equipment: [],
  difficulty: null,
  movementPattern: "horizontal push",
  instructions: [],
  safety: null,
  media: [],
  ...rest,
  };
};

describe("mergeAndRank", () => {
  it("deduplicates matching food and prefers the curated result", () => {
    const results = mergeAndRank(
      [
        food({ id: "local:oats", provider: "local", title: "Rolled oats" }),
        food({
          id: "usda:1",
          provider: "usda",
          title: "Rolled oats",
          proteinG: 13.2,
        }),
      ],
      { query: "rolled oats" },
    );

    expect(results).toHaveLength(1);
    expect(results[0].provider).toBe("local");
    expect(results[0].alternates).toContain("usda:1");
  });

  it("ranks exact matches before partial matches deterministically", () => {
    const results = mergeAndRank(
      [
        food({ id: "local:oatmeal", provider: "local", title: "Oatmeal bowl" }),
        food({ id: "local:oats", provider: "local", title: "Oats" }),
      ],
      { query: "oats" },
    );

    expect(results.map((result) => result.id)).toEqual([
      "local:oats",
      "local:oatmeal",
    ]);
  });

  it("prefers a complete local exercise and preserves provider alternatives", () => {
    const results = mergeAndRank([
      exercise({
        id: "local:push-up",
        provider: "local",
        title: "Push-up",
        equipment: ["Bodyweight"],
      }),
      exercise({
        id: "exercise-api:push_up",
        provider: "exercise-api",
        title: "Push up",
      }),
      exercise({
        id: "wrkout:Push-Up",
        provider: "wrkout",
        title: "Push-Up",
      }),
    ], { query: "push up" });

    expect(results).toHaveLength(1);
    expect(results[0].provider).toBe("local");
    expect(results[0].alternates).toEqual(expect.arrayContaining([
      "exercise-api:push_up",
      "wrkout:Push-Up",
    ]));
  });
});
