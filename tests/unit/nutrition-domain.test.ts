import { describe, expect, it } from "vitest";
import { aggregateGroceryItems, buildNutritionTotals, weekDates } from "@/features/nutrition/domain";

describe("nutrition domain", () => {
  it("totals nutrient snapshots without mutating entries", () => {
    const entries = [
      { energyKcal: 210, proteinG: 8, carbohydrateG: 32, fatG: 5, fibreG: 4 },
      { energyKcal: 390, proteinG: 24, carbohydrateG: 41, fatG: 14, fibreG: 7 },
    ];
    expect(buildNutritionTotals(entries)).toEqual({ energyKcal: 600, proteinG: 32, carbohydrateG: 73, fatG: 19, fibreG: 11 });
    expect(entries[0].energyKcal).toBe(210);
  });

  it("builds a Monday-first local week", () => {
    expect(weekDates("2026-07-19")).toEqual(["2026-07-13", "2026-07-14", "2026-07-15", "2026-07-16", "2026-07-17", "2026-07-18", "2026-07-19"]);
  });

  it("aggregates only identical ingredient and unit pairs", () => {
    expect(aggregateGroceryItems([
      { name: "Oats", quantity: 50, unit: "g" },
      { name: "oats", quantity: 30, unit: "g" },
      { name: "Oats", quantity: 1, unit: "cup" },
    ])).toEqual([
      { name: "Oats", quantity: 80, unit: "g" },
      { name: "Oats", quantity: 1, unit: "cup" },
    ]);
  });
});
