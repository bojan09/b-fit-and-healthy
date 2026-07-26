import { NextResponse } from "next/server";
import { localFoods } from "@/features/nutrition/catalogue";
import { searchUsdaFoods } from "@/features/nutrition/usda";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Sign in to search foods." }, { status: 401 });
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) return NextResponse.json({ message: "Enter at least two characters.", results: [] }, { status: 400 });
  const local = localFoods.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()));
  try {
    const external = await searchUsdaFoods(query);
    return NextResponse.json({ results: [...local, ...external.results.map((food) => ({ id: food.id, source: food.provider, name: food.title, brand: food.brand, servingGrams: food.servingAmount, energyKcal: food.energyKcal ?? 0, proteinG: food.proteinG ?? 0, carbohydrateG: food.carbohydrateG ?? 0, fatG: food.fatG ?? 0, fibreG: food.fibreG ?? 0 }))], externalAvailable: external.available, attribution: "Food data supplied by USDA FoodData Central." });
  } catch {
    return NextResponse.json({ results: local, externalAvailable: false, attribution: "Local catalogue results. USDA FoodData Central is temporarily unavailable." });
  }
}
