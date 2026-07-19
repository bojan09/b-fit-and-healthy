import "server-only";
import { getServerEnv } from "@/lib/env/server";

const endpoint = "https://api.nal.usda.gov/fdc/v1/foods/search";
const nutrientMap = { "208": "energyKcal", "1008": "energyKcal", "203": "proteinG", "1003": "proteinG", "205": "carbohydrateG", "1005": "carbohydrateG", "204": "fatG", "1004": "fatG", "291": "fibreG", "1079": "fibreG" } as const;

type UsdaNutrient = { nutrientId?: number; nutrientNumber?: string; nutrientName?: string; value?: number; unitName?: string };
type UsdaFood = { fdcId: number; description: string; brandOwner?: string; brandName?: string; servingSize?: number; servingSizeUnit?: string; foodNutrients?: UsdaNutrient[] };

export type FoodSearchResult = { id: string; source: "usda"; name: string; brand: string | null; servingGrams: number; energyKcal: number; proteinG: number; carbohydrateG: number; fatG: number; fibreG: number };

function nutrientValues(nutrients: UsdaNutrient[] = []) {
  const result = { energyKcal: 0, proteinG: 0, carbohydrateG: 0, fatG: 0, fibreG: 0 };
  for (const nutrient of nutrients) {
    const key = nutrientMap[String(nutrient.nutrientNumber ?? nutrient.nutrientId) as keyof typeof nutrientMap];
    if (key && Number.isFinite(nutrient.value) && result[key] === 0) result[key] = Number(nutrient.value);
  }
  return result;
}

export async function searchUsdaFoods(query: string): Promise<{ available: boolean; results: FoodSearchResult[] }> {
  const apiKey = getServerEnv().USDA_FDC_API_KEY;
  if (!apiKey) return { available: false, results: [] };
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "X-Api-Key": apiKey }, body: JSON.stringify({ query, pageSize: 12, dataType: ["Foundation", "SR Legacy", "Survey (FNDDS)"] }), cache: "no-store" });
  if (!response.ok) return { available: false, results: [] };
  const data = await response.json() as { foods?: UsdaFood[] };
  return { available: true, results: (data.foods ?? []).map((food) => ({ id: `usda-${food.fdcId}`, source: "usda", name: food.description, brand: food.brandOwner ?? food.brandName ?? null, servingGrams: food.servingSizeUnit?.toLowerCase() === "g" && food.servingSize ? food.servingSize : 100, ...nutrientValues(food.foodNutrients) })) };
}
