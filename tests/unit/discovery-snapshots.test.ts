import { describe, expect, it } from "vitest";
import { toSnapshotInsert } from "@/features/discovery/snapshot";
import type { DiscoveryRecipe } from "@/features/discovery/types";

describe("discovery snapshots", () => {
  it("preserves reviewed provider values and schema version", () => {
    const recipe: DiscoveryRecipe = {
      id: "themealdb:1",
      kind: "recipe",
      provider: "themealdb",
      externalId: "1",
      title: "Vegetable stew",
      normalizedTitle: "vegetable stew",
      sourceUrl: null,
      attribution: "TheMealDB",
      retrievedAt: "2026-07-25T00:00:00.000Z",
      quality: "community",
      completeness: ["ingredients"],
      alternates: [],
      category: "Dinner",
      cuisine: null,
      ingredients: [{ name: "Beans", measure: "200 g" }],
      instructions: ["Cook gently."],
      servings: 2,
      totalMinutes: null,
      imageUrl: null,
      nutrition: null,
    };

    expect(toSnapshotInsert("user-1", recipe)).toMatchObject({
      user_id: "user-1",
      content_type: "recipe",
      provider: "themealdb",
      external_id: "1",
      schema_version: 1,
      payload: recipe,
    });
  });
});
