import { safeProviderUrl } from "@/features/discovery/safe-url";
import {
  normalizeDiscoveryTitle,
  type DiscoveryRecipe,
} from "@/features/discovery/types";

type MealDbRecord = Record<string, string | null | undefined>;

export function normalizeMealDbRecipe(meal: MealDbRecord): DiscoveryRecipe {
  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    return {
      name: meal[`strIngredient${number}`]?.trim() ?? "",
      measure: meal[`strMeasure${number}`]?.trim() ?? "",
    };
  }).filter((ingredient) => ingredient.name);

  const externalId = meal.idMeal ?? "";
  const title = meal.strMeal?.trim() || "Untitled recipe";
  return {
    id: `themealdb:${externalId}`,
    kind: "recipe",
    provider: "themealdb",
    externalId,
    title,
    normalizedTitle: normalizeDiscoveryTitle(title),
    sourceUrl: safeProviderUrl(meal.strSource?.trim(), "themealdb"),
    attribution: "TheMealDB",
    retrievedAt: new Date().toISOString(),
    quality: "community",
    completeness: ["ingredients", "instructions"],
    alternates: [],
    category: meal.strCategory?.trim() || null,
    cuisine: meal.strArea?.trim() || null,
    instructions: (meal.strInstructions ?? "")
      .split(/\r?\n|(?<=[.!?])\s+(?=[A-Z])/)
      .map((step) => step.trim())
      .filter(Boolean),
    ingredients,
    servings: null,
    totalMinutes: null,
    imageUrl: safeProviderUrl(meal.strMealThumb?.trim(), "themealdb"),
    nutrition: null,
  };
}

export async function searchMealDb(query: string, signal?: AbortSignal): Promise<DiscoveryRecipe[]> {
  const { getServerEnv } = await import("@/lib/env/server");
  const configuredKey = getServerEnv().THEMEALDB_API_KEY;
  const apiKey = configuredKey ?? (process.env.NODE_ENV === "production" ? null : "1");
  if (!apiKey) return [];
  const response = await fetch(`https://www.themealdb.com/api/json/v1/${apiKey}/search.php?s=${encodeURIComponent(query)}`, {
    signal,
    next: { revalidate: 86_400 },
  });
  if (!response.ok) return [];
  const payload = await response.json() as { meals?: MealDbRecord[] | null };
  return (payload.meals ?? []).map(normalizeMealDbRecipe);
}
