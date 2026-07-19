import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function loadNutritionDay(userId: string, date: string) {
  const supabase = await createClient();
  const [entries, targets, custom, favourites] = await Promise.all([
    supabase.from("meal_entries").select("*").eq("user_id", userId).eq("logged_on", date).order("created_at"),
    supabase.from("daily_targets").select("energy_kcal,protein_g,carbohydrate_g,fat_g").eq("user_id", userId).order("effective_from", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("foods").select("*").eq("owner_id", userId).order("created_at", { ascending: false }).limit(8),
    supabase.from("food_favourites").select("food_id").eq("user_id", userId),
  ]);
  const favouriteIds = new Set((favourites.data ?? []).map((row) => row.food_id));
  return { entries: entries.data ?? [], target: targets.data, customFoods: (custom.data ?? []).map((food) => ({ ...food, isFavourite: favouriteIds.has(food.id) })), unavailable: Boolean(entries.error) };
}

export async function loadMealPlan(userId: string, from: string, to: string) {
  const supabase = await createClient(); const result = await supabase.from("meal_plan_items").select("*").eq("user_id", userId).gte("planned_on", from).lte("planned_on", to).order("planned_on").order("meal_slot"); return result.data ?? [];
}

export async function loadGroceryItems(userId: string) {
  const supabase = await createClient(); const result = await supabase.from("grocery_items").select("*").eq("user_id", userId).order("is_checked").order("category").order("created_at"); return result.data ?? [];
}

export async function loadSavedRecipeIds(userId: string) {
  const supabase = await createClient(); const result = await supabase.from("saved_recipes").select("recipe_id").eq("user_id", userId); return new Set((result.data ?? []).map((row) => row.recipe_id));
}
