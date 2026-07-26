import { describe, expect, it } from "vitest";
import {
  searchCommercialExerciseProviders,
} from "@/features/fitness/providers/exercise-mesh";

describe("commercial exercise provider mesh", () => {
  it("retains successful sources when one provider fails", async () => {
    const outcome = await searchCommercialExerciseProviders("push up", {
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
});
