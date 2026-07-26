import { describe, expect, it } from "vitest";
import { normalizeOpenFoodFactsProduct } from "@/features/nutrition/providers/open-food-facts";

describe("food provider adapters", () => {
  it("normalizes Open Food Facts values without filling missing nutrients", () => {
    const result = normalizeOpenFoodFactsProduct({
      code: "123",
      product_name: "Plain yoghurt",
      brands: "Example",
      nutriments: {
        "energy-kcal_100g": 64,
        proteins_100g: 5.2,
      },
    });

    expect(result).toMatchObject({
      provider: "open-food-facts",
      barcode: "123",
      energyKcal: 64,
      proteinG: 5.2,
      carbohydrateG: null,
      quality: "community",
    });
  });
});
