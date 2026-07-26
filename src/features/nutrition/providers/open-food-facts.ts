import {
  normalizeDiscoveryTitle,
  type DiscoveryFood,
} from "@/features/discovery/types";

const base = "https://world.openfoodfacts.org";
const userAgent =
  "B-Fit-and-Healthy/0.1.0 (https://b-fit-and-healthy.vercel.app)";

type OffProduct = {
  code?: string;
  product_name?: string;
  brands?: string;
  serving_quantity?: number;
  serving_quantity_unit?: string;
  nutriments?: Record<string, number | undefined>;
  image_front_url?: string;
};

function numberOrNull(value: number | undefined) {
  return Number.isFinite(value) ? Number(value) : null;
}

export function normalizeOpenFoodFactsProduct(
  product: OffProduct,
): DiscoveryFood | null {
  const title = product.product_name?.trim();
  const externalId = product.code?.trim();
  if (!title || !externalId) return null;
  const nutriments = product.nutriments ?? {};
  const values = {
    energyKcal: numberOrNull(nutriments["energy-kcal_100g"]),
    proteinG: numberOrNull(nutriments.proteins_100g),
    carbohydrateG: numberOrNull(nutriments.carbohydrates_100g),
    fatG: numberOrNull(nutriments.fat_100g),
    fibreG: numberOrNull(nutriments.fiber_100g),
  };

  return {
    id: `open-food-facts:${externalId}`,
    kind: "food",
    provider: "open-food-facts",
    externalId,
    title,
    normalizedTitle: normalizeDiscoveryTitle(title),
    sourceUrl: `${base}/product/${externalId}`,
    attribution: "Open Food Facts community data",
    retrievedAt: new Date().toISOString(),
    quality: "community",
    completeness: Object.entries(values)
      .filter(([, value]) => value !== null)
      .map(([key]) => key),
    alternates: [],
    brand: product.brands?.trim() || null,
    servingAmount: product.serving_quantity || 100,
    servingUnit: product.serving_quantity_unit || "g",
    barcode: externalId,
    nutrientBasis: "per-100-g",
    ...values,
  };
}

export async function lookupOpenFoodFactsBarcode(
  barcode: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${base}/api/v3/product/${encodeURIComponent(barcode)}.json?fields=code,product_name,brands,serving_quantity,serving_quantity_unit,nutriments,image_front_url`,
    { headers: { "User-Agent": userAgent }, signal, next: { revalidate: 86_400 } },
  );
  if (!response.ok) return [];
  const payload = (await response.json()) as { product?: OffProduct };
  const normalized = payload.product
    ? normalizeOpenFoodFactsProduct(payload.product)
    : null;
  return normalized ? [normalized] : [];
}

export async function searchOpenFoodFactsBrands(
  query: string,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${base}/api/v2/search?categories_tags_en=${encodeURIComponent(query)}&page_size=10&fields=code,product_name,brands,serving_quantity,serving_quantity_unit,nutriments,image_front_url`,
    { headers: { "User-Agent": userAgent }, signal, cache: "no-store" },
  );
  if (!response.ok) return [];
  const payload = (await response.json()) as { products?: OffProduct[] };
  return (payload.products ?? [])
    .map(normalizeOpenFoodFactsProduct)
    .filter((item): item is DiscoveryFood => item !== null);
}
