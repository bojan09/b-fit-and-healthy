import { describe, expect, it } from "vitest";
import {
  getAnatomyRegions,
  getMuscle,
  resolveRelatedMuscles,
  searchMuscles,
} from "@/features/anatomy/data";

describe("anatomy encyclopedia domain", () => {
  it("searches English, Macedonian, scientific names, and body regions", () => {
    expect(searchMuscles("pector", "all").map((item) => item.id)).toContain("pectorals");
    expect(searchMuscles("Pectoralis", "all").map((item) => item.id)).toContain("pectorals");
    expect(searchMuscles("гради", "all").map((item) => item.id)).toContain("pectorals");
    expect(searchMuscles("", "legs").every((item) => item.regionKey === "legs")).toBe(true);
  });

  it("returns deterministic regions and safely resolves related muscles", () => {
    expect(getAnatomyRegions()).toEqual([...getAnatomyRegions()].sort());
    const pectorals = getMuscle("pectorals");
    expect(pectorals).toBeDefined();
    const related = resolveRelatedMuscles(pectorals!);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((item) => item.id !== pectorals!.id)).toBe(true);
  });
});
