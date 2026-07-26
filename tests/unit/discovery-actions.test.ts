import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  DiscoveryExercise,
  DiscoveryFood,
  DiscoveryItem,
  DiscoveryRecipe,
  DiscoveryWorkout,
} from "@/features/discovery/types";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getUser: vi.fn(),
  revalidatePath: vi.fn(),
  saveDiscoverySnapshot: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));
vi.mock("@/features/discovery/repository", () => ({
  saveDiscoverySnapshot: mocks.saveDiscoverySnapshot,
}));

import {
  importDiscoveryItemAction,
} from "@/features/discovery/actions";

const base = {
  normalizedTitle: "test item",
  sourceUrl: null,
  attribution: "Test provider",
  retrievedAt: "2026-07-26T00:00:00.000Z",
  quality: "verified" as const,
  completeness: [],
  alternates: [],
};

function exercise(
  provider: DiscoveryExercise["provider"],
  license: DiscoveryExercise["license"] = {
    id: "CC-BY-4.0",
    name: "CC BY 4.0",
    url: "https://creativecommons.org/licenses/by/4.0/",
    attribution: "Test author",
    commercialUse: true,
  },
): DiscoveryExercise {
  return {
    ...base,
    id: `${provider}:exercise`,
    kind: "exercise",
    provider,
    externalId: "exercise",
    title: "Test exercise",
    license,
    primaryMuscles: ["biceps"],
    secondaryMuscles: [],
    equipment: ["dumbbell"],
    difficulty: null,
    movementPattern: "curl",
    instructions: ["Move with control."],
    safety: null,
    media: [],
  };
}

const allowedExercises: DiscoveryExercise[] = [
  exercise("local", {
    id: "LOCAL-CURATED",
    name: "Local curated",
    url: null,
    attribution: "B Fit & Healthy",
    commercialUse: true,
  }),
  exercise("wger", {
    id: "CC-BY-SA-4.0",
    name: "CC BY-SA 4.0",
    url: "https://creativecommons.org/licenses/by-sa/4.0/",
    attribution: "wger contributor",
    commercialUse: true,
  }),
  exercise("exercise-api"),
  exercise("wrkout", {
    id: "Unlicense",
    name: "Unlicense",
    url: "https://unlicense.org/",
    attribution: "wrkout/exercises.json",
    commercialUse: true,
  }),
];

const nonExerciseItems: DiscoveryItem[] = [
  {
    ...base,
    id: "usda:food",
    kind: "food",
    provider: "usda",
    externalId: "food",
    title: "Test food",
    brand: null,
    servingAmount: 100,
    servingUnit: "g",
    energyKcal: 100,
    proteinG: 5,
    carbohydrateG: 10,
    fatG: 2,
    fibreG: 1,
    barcode: null,
    nutrientBasis: "per-100-g",
  } satisfies DiscoveryFood,
  {
    ...base,
    id: "themealdb:recipe",
    kind: "recipe",
    provider: "themealdb",
    externalId: "recipe",
    title: "Test recipe",
    category: null,
    cuisine: null,
    ingredients: [{ name: "Beans", measure: "100 g" }],
    instructions: ["Cook."],
    servings: 1,
    totalMinutes: null,
    imageUrl: null,
    nutrition: null,
  } satisfies DiscoveryRecipe,
  {
    ...base,
    id: "musclewiki:workout",
    kind: "workout",
    provider: "musclewiki",
    externalId: "workout",
    title: "Test workout",
    goal: "strength",
    durationMinutes: 20,
    difficulty: null,
    equipment: [],
    exercises: [],
  } satisfies DiscoveryWorkout,
];

async function submit(item: DiscoveryItem) {
  const formData = new FormData();
  formData.set("item", JSON.stringify(item));
  return importDiscoveryItemAction({ status: "idle" }, formData);
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
  mocks.createClient.mockResolvedValue({
    auth: { getUser: mocks.getUser },
  });
  mocks.saveDiscoverySnapshot.mockResolvedValue(undefined);
});

describe("importDiscoveryItemAction exercise provenance policy", () => {
  it.each([
    ["musclewiki", exercise("musclewiki")],
    ["unrelated provider", exercise("usda")],
  ])("rejects a schema-valid %s exercise before authentication", async (
    _label,
    item,
  ) => {
    const result = await submit(item);

    expect(result.status).toBe("error");
    expect(mocks.createClient).not.toHaveBeenCalled();
    expect(mocks.saveDiscoverySnapshot).not.toHaveBeenCalled();
  });

  it.each(allowedExercises)(
    "keeps the $provider exercise provider importable",
    async (item) => {
      await expect(submit(item)).resolves.toEqual({
        status: "success",
        message: "Test exercise saved.",
      });
    },
  );

  it.each(nonExerciseItems)(
    "does not weaken $kind imports",
    async (item) => {
      const result = await submit(item);

      expect(result.status).toBe("success");
      expect(mocks.saveDiscoverySnapshot).toHaveBeenCalledWith(
        "user-1",
        item,
      );
    },
  );
});
