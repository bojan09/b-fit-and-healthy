import { describe, expect, it } from "vitest";
import { normalizeMealDbRecipe } from "@/features/nutrition/providers/themealdb";

describe("TheMealDB adapter", () => {
  it("normalizes inspiration without inventing nutrition", () => {
    const recipe = normalizeMealDbRecipe({
      idMeal: "52772",
      strMeal: "Teriyaki chicken",
      strCategory: "Chicken",
      strArea: "Japanese",
      strInstructions: "Cook the chicken. Serve with vegetables.",
      strIngredient1: "Chicken",
      strMeasure1: "300 g",
      strSource: "https://example.com/recipe",
    });

    expect(recipe).toMatchObject({
      provider: "themealdb",
      title: "Teriyaki chicken",
      nutrition: null,
    });
    expect(recipe.ingredients).toEqual([{ name: "Chicken", measure: "300 g" }]);
  });
});
