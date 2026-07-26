import { describe, expect, it, vi } from "vitest";

const providerSearches = vi.hoisted(() => ({
  searchWgerExercises: vi.fn(async () => []),
  searchExerciseApiExercises: vi.fn(async () => []),
  searchWrkoutExercises: vi.fn(async () => []),
}));

vi.mock("@/features/fitness/providers/wger", () => ({
  searchWgerExercises: providerSearches.searchWgerExercises,
}));
vi.mock("@/features/fitness/providers/exercise-api", () => ({
  searchExerciseApiExercises: providerSearches.searchExerciseApiExercises,
}));
vi.mock("@/features/fitness/providers/wrkout", () => ({
  searchWrkoutExercises: providerSearches.searchWrkoutExercises,
}));

import {
  searchCommercialExerciseProviders,
} from "@/features/fitness/providers/exercise-mesh";

describe("commercial exercise provider mesh", () => {
  it("retains successful sources when one provider fails", async () => {
    const outcome = await searchCommercialExerciseProviders({
      query: "push up",
      muscle: "",
      equipment: "",
      type: "",
    }, {
      timeoutMs: 50,
      providers: [
        { id: "wger", run: async () => Promise.reject(new Error("offline")) },
        { id: "exercise-api", run: async () => ["exercise-api"] },
        { id: "wrkout", run: async () => ["wrkout"] },
      ],
    });

    expect(outcome.results).toEqual(["exercise-api", "wrkout"]);
    expect(outcome.failures).toEqual([
      { provider: "wger", reason: "unavailable" },
    ]);
  });

  it("passes a filter-derived biceps term to every provider", async () => {
    const criteria = {
      query: "biceps",
      muscle: "biceps",
      equipment: "",
      type: "",
    } as const;
    await searchCommercialExerciseProviders(criteria);

    expect(providerSearches.searchWgerExercises).toHaveBeenCalledWith(
      criteria,
      expect.any(AbortSignal),
    );
    expect(providerSearches.searchExerciseApiExercises).toHaveBeenCalledWith(
      criteria,
      expect.any(AbortSignal),
    );
    expect(providerSearches.searchWrkoutExercises).toHaveBeenCalledWith(
      criteria,
      expect.any(AbortSignal),
    );
  });
});
