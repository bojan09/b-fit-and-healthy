"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { aggregateGroceryItems, scalePerHundred } from "@/features/nutrition/domain";
import { customFoodSchema, groceryItemSchema, idSchema, mealEntrySchema, planItemSchema } from "@/features/nutrition/schemas";
import type { AuthActionState } from "@/features/auth/types";
import { discoveryFoodLogSchema } from "@/features/discovery/schemas";

const invalid = (message: string): AuthActionState => ({ status: "error", message });
async function authorized() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/sign-in"); return { supabase, user }; }
function refresh() { for (const path of ["/nutrition", "/recipes", "/meal-planner", "/grocery-list", "/today"]) revalidatePath(path); }

export async function addMealEntryAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = mealEntrySchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return invalid("Check the food, amount, date and meal.");
  const { supabase, user } = await authorized(); const food = parsed.data; const grams = food.amountGrams;
  const result = await supabase.from("meal_entries").insert({ user_id: user.id, logged_on: food.loggedOn, meal_slot: food.mealSlot, food_id: food.foodId || null, food_name: food.foodName, amount_grams: grams, energy_kcal: scalePerHundred(food.energyKcal, grams), protein_g: scalePerHundred(food.proteinG, grams), carbohydrate_g: scalePerHundred(food.carbohydrateG, grams), fat_g: scalePerHundred(food.fatG, grams), fibre_g: scalePerHundred(food.fibreG, grams) });
  if (result.error) return invalid("The food could not be logged. Apply the nutrition database migration if this is the first run."); refresh(); return { status: "success", message: "Food logged." };
}

export async function logDiscoveryFoodAction(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = discoveryFoodLogSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid("Review the serving, date, and meal.");
  const { item, loggedOn, mealSlot, amountGrams } = parsed.data;
  const required = [
    item.energyKcal,
    item.proteinG,
    item.carbohydrateG,
    item.fatG,
    item.fibreG,
  ];
  if (required.some((value) => value === null)) {
    return invalid("Nutrition is incomplete, so this food cannot be logged yet.");
  }
  const { supabase, user } = await authorized();
  try {
    const { saveDiscoverySnapshot } = await import(
      "@/features/discovery/repository"
    );
    const snapshotId = await saveDiscoverySnapshot(user.id, item);
    const factor = item.nutrientBasis === "per-serving"
      ? amountGrams / item.servingAmount
      : amountGrams / 100;
    const result = await supabase.from("meal_entries").insert({
      user_id: user.id,
      logged_on: loggedOn,
      meal_slot: mealSlot,
      food_id: null,
      external_snapshot_id: snapshotId,
      food_name: item.title,
      amount_grams: amountGrams,
      energy_kcal: item.energyKcal! * factor,
      protein_g: item.proteinG! * factor,
      carbohydrate_g: item.carbohydrateG! * factor,
      fat_g: item.fatG! * factor,
      fibre_g: item.fibreG! * factor,
    });
    if (result.error) return invalid("The reviewed food could not be logged.");
    refresh();
    return { status: "success", message: `${item.title} added to your day.` };
  } catch {
    return invalid("The reviewed food could not be saved.");
  }
}

export async function deleteMealEntryAction(formData: FormData) { const parsed = idSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); await supabase.from("meal_entries").delete().eq("id", parsed.data.id).eq("user_id", user.id); refresh(); }

export async function createCustomFoodAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> { const parsed = customFoodSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return invalid("Enter valid values per 100 g."); const { supabase, user } = await authorized(); const result = await supabase.from("foods").insert({ owner_id: user.id, source: "custom", name: parsed.data.name, serving_grams: parsed.data.servingGrams, energy_kcal: parsed.data.energyKcal, protein_g: parsed.data.proteinG, carbohydrate_g: parsed.data.carbohydrateG, fat_g: parsed.data.fatG, fibre_g: parsed.data.fibreG }); if (result.error) return invalid("The custom food could not be saved."); refresh(); return { status: "success", message: "Custom food saved." }; }

export async function toggleFoodFavouriteAction(formData: FormData) { const parsed = idSchema.extend({ saved: z.enum(["true", "false"]) }).safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); if (parsed.data.saved === "true") await supabase.from("food_favourites").delete().eq("user_id", user.id).eq("food_id", parsed.data.id); else await supabase.from("food_favourites").insert({ user_id: user.id, food_id: parsed.data.id }); refresh(); }

export async function addPlanItemAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> { const parsed = planItemSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return invalid("Choose a valid day, meal and item."); const { supabase, user } = await authorized(); const result = await supabase.from("meal_plan_items").insert({ user_id: user.id, planned_on: parsed.data.plannedOn, meal_slot: parsed.data.mealSlot, recipe_id: parsed.data.recipeId || null, label: parsed.data.label, servings: parsed.data.servings }); if (result.error) return invalid("The plan item could not be saved."); refresh(); return { status: "success", message: "Meal planned." }; }

export async function deletePlanItemAction(formData: FormData) { const parsed = idSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); await supabase.from("meal_plan_items").delete().eq("id", parsed.data.id).eq("user_id", user.id); refresh(); }

export async function toggleSavedRecipeAction(formData: FormData) { const parsed = zRecipe.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); if (parsed.data.saved === "true") await supabase.from("saved_recipes").delete().eq("user_id", user.id).eq("recipe_id", parsed.data.recipeId); else await supabase.from("saved_recipes").insert({ user_id: user.id, recipe_id: parsed.data.recipeId }); refresh(); }

import { z } from "zod";
const zRecipe = z.object({ recipeId: z.uuid(), saved: z.enum(["true", "false"]) });

export async function addGroceryItemAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> { const parsed = groceryItemSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return invalid("Enter a grocery item name and valid quantity."); const { supabase, user } = await authorized(); const result = await supabase.from("grocery_items").insert({ user_id: user.id, name: parsed.data.name, quantity: parsed.data.quantity === "" || parsed.data.quantity === undefined ? null : parsed.data.quantity, unit: parsed.data.unit || null, category: parsed.data.category }); if (result.error) return invalid("The item could not be added."); refresh(); return { status: "success", message: "Grocery item added." }; }

export async function toggleGroceryItemAction(formData: FormData) { const parsed = idSchema.extend({ checked: z.enum(["true", "false"]) }).safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); await supabase.from("grocery_items").update({ is_checked: parsed.data.checked !== "true" }).eq("id", parsed.data.id).eq("user_id", user.id); refresh(); }
export async function deleteGroceryItemAction(formData: FormData) { const parsed = idSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; const { supabase, user } = await authorized(); await supabase.from("grocery_items").delete().eq("id", parsed.data.id).eq("user_id", user.id); refresh(); }

export async function generateGroceryListAction(): Promise<void> { const { supabase, user } = await authorized(); const today = new Date().toISOString().slice(0, 10); const end = new Date(`${today}T12:00:00Z`); end.setUTCDate(end.getUTCDate() + 13); const plans = await supabase.from("meal_plan_items").select("recipe_id,servings").eq("user_id", user.id).gte("planned_on", today).lte("planned_on", end.toISOString().slice(0, 10)).not("recipe_id", "is", null); const servings = new Map<string, number>(); for (const item of plans.data ?? []) if (item.recipe_id) servings.set(item.recipe_id, (servings.get(item.recipe_id) ?? 0) + Number(item.servings)); const ids = [...servings.keys()]; await supabase.from("grocery_items").delete().eq("user_id", user.id).eq("source", "meal_plan"); if (!ids.length) { refresh(); return; } const ingredients = await supabase.from("recipe_ingredients").select("recipe_id,name_en,quantity,unit").in("recipe_id", ids); const rows = aggregateGroceryItems((ingredients.data ?? []).map((item) => ({ name: item.name_en, quantity: Number(item.quantity) * (servings.get(item.recipe_id) ?? 1), unit: item.unit }))).map((item) => ({ user_id: user.id, ...item, category: "From meal plan", source: "meal_plan" as const })); if (rows.length) await supabase.from("grocery_items").insert(rows); refresh(); }
