import type { Recipe, RecipeDietary, RecipeMeal } from "./recipe-types";

export type RecipeFilters = {
  query?: string;
  meal?: RecipeMeal | "all";
  dietary?: RecipeDietary | "all";
  maxMinutes?: number;
};

export function discoverRecipes(recipes: readonly Recipe[], filters: RecipeFilters = {}) {
  const query = filters.query?.trim().toLocaleLowerCase() ?? "";
  return recipes.filter((recipe) => {
    if (filters.meal && filters.meal !== "all" && recipe.meal !== filters.meal) return false;
    if (filters.dietary && filters.dietary !== "all" && !recipe.dietary.includes(filters.dietary)) return false;
    if (filters.maxMinutes && recipe.totalMinutes > filters.maxMinutes) return false;
    if (!query) return true;
    const haystack = [
      recipe.title.en,
      recipe.summary.en,
      ...recipe.tags,
      ...recipe.dietary,
      ...recipe.ingredients.map((ingredient) => ingredient.name.en),
    ].join(" ").toLocaleLowerCase();
    return haystack.includes(query);
  });
}

export function groupRecipesByMeal(recipes: readonly Recipe[]) {
  return {
    breakfast: recipes.filter((recipe) => recipe.meal === "breakfast"),
    lunch: recipes.filter((recipe) => recipe.meal === "lunch"),
    dinner: recipes.filter((recipe) => recipe.meal === "dinner"),
    snack: recipes.filter((recipe) => recipe.meal === "snack"),
  };
}
