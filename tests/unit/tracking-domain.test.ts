import { describe, expect, it } from "vitest";
import {
  buildDailySummary,
  fluidOuncesToMl,
  kgToLb,
  lbToKg,
  localDateInTimezone,
  mlToFluidOunces,
  ratio,
} from "@/features/tracking/domain";

describe("tracking domain", () => {
  it("derives the user's calendar date across timezone boundaries", () => {
    const instant = new Date("2026-07-19T23:30:00.000Z");
    expect(localDateInTimezone("Europe/Skopje", instant)).toBe("2026-07-20");
    expect(localDateInTimezone("America/Los_Angeles", instant)).toBe("2026-07-19");
  });

  it("converts canonical units with useful precision", () => {
    expect(kgToLb(70)).toBeCloseTo(154.3, 1);
    expect(lbToKg(154.3)).toBeCloseTo(70, 1);
    expect(mlToFluidOunces(500)).toBeCloseTo(16.9, 1);
    expect(fluidOuncesToMl(16.9)).toBeCloseTo(500, -1);
  });

  it("clamps progress and handles missing targets", () => {
    expect(ratio(12, 10)).toBe(1);
    expect(ratio(-2, 10)).toBe(0);
    expect(ratio(2, null)).toBeNull();
  });

  it("prioritizes real next actions without inventing activity", () => {
    const summary = buildDailySummary({
      waterMl: 400,
      waterTargetMl: 2000,
      habits: [{ id: "walk", title: "Walk", status: null }],
      goals: [{ id: "strength", kind: "strength", status: "active" }],
      latestWeightKg: null,
    });
    expect(summary.completedHabits).toBe(0);
    expect(summary.nextAction).toEqual({ kind: "water", href: "#water" });

    expect(buildDailySummary({ ...summary.input, waterMl: 2000 }).nextAction).toEqual({
      kind: "habit",
      href: "/habits",
      label: "Walk",
    });
  });
});
