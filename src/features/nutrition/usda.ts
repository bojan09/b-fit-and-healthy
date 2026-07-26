import "server-only";
import { getServerEnv } from "@/lib/env/server";
import {
  normalizeDiscoveryTitle,
  type DiscoveryFood,
} from "@/features/discovery/types";

const endpoint = "https://api.nal.usda.gov/fdc/v1/foods/search";
const nutrientMap = { "208": "energyKcal", "1008": "energyKcal", "203": "proteinG", "1003": "proteinG", "205": "carbohydrateG", "1005": "carbohydrateG", "204": "fatG", "1004": "fatG", "291": "fibreG", "1079": "fibreG" } as const;

type UsdaNutrient = { nutrientId?: number; nutrientNumber?: string; nutrientName?: string; value?: number; unitName?: string };
type UsdaFood = { fdcId: number; description: string; brandOwner?: string; brandName?: string; servingSize?: number; servingSizeUnit?: string; foodNutrients?: UsdaNutrient[] };

function nutrientValues(nutrients: UsdaNutrient[] = []) {
  const result = { energyKcal: null, proteinG: null, carbohydrateG: null, fatG: null, fibreG: null } as Record<"energyKcal" | "proteinG" | "carbohydrateG" | "fatG" | "fibreG", number | null>;
  for (const nutrient of nutrients) {
    const key = nutrientMap[String(nutrient.nutrientNumber ?? nutrient.nutrientId) as keyof typeof nutrientMap];
    if (key && Number.isFinite(nutrient.value) && result[key] === null) result[key] = Number(nutrient.value);
  }
  return result;
}

export async function searchUsdaFoods(query: string, signal?: AbortSignal): Promise<{ available: boolean; results: DiscoveryFood[] }> {
  const apiKey = getServerEnv().USDA_FDC_API_KEY;
  if (!apiKey) return { available: false, results: [] };
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "X-Api-Key": apiKey }, body: JSON.stringify({ query, pageSize: 12, dataType: ["Foundation", "SR Legacy", "Survey (FNDDS)"] }), cache: "no-store", signal });
  if (!response.ok) return { available: false, results: [] };
  const data = await response.json() as { foods?: UsdaFood[] };
  return {
    available: true,
    results: (data.foods ?? []).map((food) => {
      const nutrients = nutrientValues(food.foodNutrients);
      const title = food.description.trim();
      return {
        id: `usda:${food.fdcId}`,
        kind: "food",
        provider: "usda",
        externalId: String(food.fdcId),
        title,
        normalizedTitle: normalizeDiscoveryTitle(title),
        sourceUrl: `https://fdc.nal.usda.gov/fdc-app.html#/food-details/${food.fdcId}`,
        attribution: "USDA FoodData Central",
        retrievedAt: new Date().toISOString(),
        quality: "verified",
        completeness: Object.entries(nutrients).filter(([, value]) => value !== null).map(([key]) => key),
        alternates: [],
        brand: food.brandOwner ?? food.brandName ?? null,
        servingAmount: food.servingSizeUnit?.toLowerCase() === "g" && food.servingSize ? food.servingSize : 100,
        servingUnit: "g",
        barcode: null,
        nutrientBasis: "per-100-g",
        ...nutrients,
      } satisfies DiscoveryFood;
    }),
  };
}
