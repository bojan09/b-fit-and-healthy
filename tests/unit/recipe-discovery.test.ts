import { describe, expect, it } from "vitest";
import { discoverRecipes, groupRecipesByMeal } from "@/features/nutrition/recipe-discovery";
import { recipeCatalogue } from "@/features/nutrition/recipe-catalogue";

describe("recipe discovery", () => {
  it("ships a useful local catalogue across every meal", () => {
    expect(recipeCatalogue).toHaveLength(24);
    const groups = groupRecipesByMeal(recipeCatalogue);
    expect(groups.breakfast.length).toBeGreaterThanOrEqual(5);
    expect(groups.lunch.length).toBeGreaterThanOrEqual(5);
    expect(groups.dinner.length).toBeGreaterThanOrEqual(6);
    expect(groups.snack.length).toBeGreaterThanOrEqual(4);
  });

  it("searches titles, summaries, tags and ingredients", () => {
    expect(discoverRecipes(recipeCatalogue, { query: "lentil" }).length).toBeGreaterThan(0);
    expect(discoverRecipes(recipeCatalogue, { query: "high protein" }).length).toBeGreaterThan(0);
    expect(discoverRecipes(recipeCatalogue, { query: "yoghurt" }).length).toBeGreaterThan(0);
  });

  it("combines meal, time and dietary filters", () => {
    const results = discoverRecipes(recipeCatalogue, {
      meal: "dinner",
      maxMinutes: 30,
      dietary: "plant-forward",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((recipe) =>
      recipe.meal === "dinner"
      && recipe.totalMinutes <= 30
      && recipe.dietary.includes("plant-forward"),
    )).toBe(true);
  });
});
