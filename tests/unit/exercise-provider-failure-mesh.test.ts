import { afterEach, describe, expect, it, vi } from "vitest";
import {
  searchCommercialExerciseProviders,
} from "@/features/fitness/providers/exercise-mesh";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("commercial exercise provider failure reporting", () => {
  it("reports 429, 500, and network failures from the default adapters", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation((input: string | URL) => {
      const url = String(input);
      if (url.includes("wger.de")) {
        return Promise.resolve({
          ok: false,
          status: 429,
        } as Response);
      }
      if (url.includes("exercise-api.com")) {
        return Promise.resolve({
          ok: false,
          status: 500,
        } as Response);
      }
      if (url.includes("api.github.com")) {
        return Promise.reject(new TypeError("network failed"));
      }
      throw new Error(`Unexpected provider URL: ${url}`);
    }));

    const outcome = await searchCommercialExerciseProviders({
      query: "curl",
      muscle: "",
      equipment: "",
      type: "",
    });

    expect(outcome.results).toEqual([]);
    expect(outcome.failures).toEqual([
      { provider: "wger", reason: "unavailable" },
      { provider: "exercise-api", reason: "unavailable" },
      { provider: "wrkout", reason: "unavailable" },
    ]);
  });

  it("preserves legitimate 200 responses with no provider records", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation((input: string | URL) => {
      const url = String(input);
      const body = url.includes("wger.de")
        ? { results: [] }
        : url.includes("exercise-api.com")
          ? { data: [] }
          : { tree: [] };
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => body,
      } as Response);
    }));

    const outcome = await searchCommercialExerciseProviders({
      query: "curl",
      muscle: "",
      equipment: "",
      type: "",
    });

    expect(outcome.results).toEqual([]);
    expect(outcome.failures).toEqual([]);
  });
});
