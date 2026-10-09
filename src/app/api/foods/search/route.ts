import { NextResponse } from "next/server";
import { localFoods } from "@/features/nutrition/catalogue";
import { searchUsdaFoods } from "@/features/nutrition/usda";
import { enforceRateLimit, rateLimitedResponse, rateLimits } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

const MAX_QUERY_LENGTH = 80;
const PROVIDER_TIMEOUT_MS = 2_500;

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Sign in to search foods.", results: [] }, { status: 401 });

  const limit = await enforceRateLimit(supabase, "discovery", user.id, rateLimits.discovery);
  if (!limit.allowed) return rateLimitedResponse(limit.retryAfter, { results: [] });

  const query = (new URL(request.url).searchParams.get("q")?.trim() ?? "").slice(0, MAX_QUERY_LENGTH);
  if (query.length < 2) {
    return NextResponse.json({ message: "Enter at least two characters.", results: [] }, { status: 400 });
  }

  const local = localFoods.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()));
  try {
    const external = await searchUsdaFoods(query, AbortSignal.timeout(PROVIDER_TIMEOUT_MS));
    const results = external.results.map((food) => ({
      id: food.id,
      source: food.provider,
      name: food.title,
      brand: food.brand,
      servingGrams: food.servingAmount,
      energyKcal: food.energyKcal ?? 0,
      proteinG: food.proteinG ?? 0,
      carbohydrateG: food.carbohydrateG ?? 0,
      fatG: food.fatG ?? 0,
      fibreG: food.fibreG ?? 0,
    }));
    return NextResponse.json({
      results: [...local, ...results],
      externalAvailable: external.available,
      attribution: "Food data supplied by USDA FoodData Central.",
    });
  } catch {
    return NextResponse.json({
      results: local,
      externalAvailable: false,
      attribution: "Local catalogue results. USDA FoodData Central is temporarily unavailable.",
    });
  }
}
