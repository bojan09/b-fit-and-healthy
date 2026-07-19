export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
type Table<Row, Insert, Update> = { Row: Row; Insert: Insert; Update: Update; Relationships: [] };
type Timestamps = { created_at: string; updated_at: string };

export type Database = { public: { Tables: {
  profiles: Table<
    { user_id: string; display_name: string; avatar_path: string | null; locale: "en" | "mk"; onboarding_complete: boolean } & Timestamps,
    { user_id: string; display_name?: string; avatar_path?: string | null; locale?: "en" | "mk"; onboarding_complete?: boolean },
    { display_name?: string; avatar_path?: string | null; locale?: "en" | "mk"; onboarding_complete?: boolean }
  >;
  user_settings: Table<
    { user_id: string; units: "metric" | "imperial"; theme: "light" | "dark" | "system"; timezone: string; reminders_enabled: boolean; weekly_summary_enabled: boolean } & Timestamps,
    { user_id: string; units?: "metric" | "imperial"; theme?: "light" | "dark" | "system"; timezone?: string },
    { units?: "metric" | "imperial"; theme?: "light" | "dark" | "system"; timezone?: string }
  >;
  goals: Table<
    { id: string; user_id: string; kind: string; target: number | null; unit: string | null; starts_on: string; ends_on: string | null; status: "active" | "paused" | "complete" } & Timestamps,
    { id?: string; user_id: string; kind: string; target?: number | null; unit?: string | null; starts_on?: string; ends_on?: string | null; status?: "active" | "paused" | "complete" },
    { kind?: string; target?: number | null; unit?: string | null; starts_on?: string; ends_on?: string | null; status?: "active" | "paused" | "complete" }
  >;
  daily_targets: Table<
    { id: string; user_id: string; effective_from: string; energy_kcal: number | null; protein_g: number | null; carbohydrate_g: number | null; fat_g: number | null; water_ml: number | null; movement_minutes: number | null } & Timestamps,
    { id?: string; user_id: string; effective_from?: string; energy_kcal?: number | null; protein_g?: number | null; carbohydrate_g?: number | null; fat_g?: number | null; water_ml?: number | null; movement_minutes?: number | null },
    Partial<{ effective_from: string; energy_kcal: number | null; protein_g: number | null; carbohydrate_g: number | null; fat_g: number | null; water_ml: number | null; movement_minutes: number | null }>
  >;
  water_logs: Table<
    { id: string; user_id: string; amount_ml: number; logged_at: string; created_at: string },
    { id?: string; user_id: string; amount_ml: number; logged_at?: string },
    { amount_ml?: number; logged_at?: string }
  >;
  body_measurements: Table<
    { id: string; user_id: string; recorded_on: string; weight_kg: number; note: string | null } & Timestamps,
    { id?: string; user_id: string; recorded_on?: string; weight_kg: number; note?: string | null },
    { recorded_on?: string; weight_kg?: number; note?: string | null }
  >;
  habits: Table<
    { id: string; user_id: string; title: string; position: number; is_archived: boolean } & Timestamps,
    { id?: string; user_id: string; title: string; position?: number; is_archived?: boolean },
    { title?: string; position?: number; is_archived?: boolean }
  >;
  habit_checkins: Table<
    { id: string; user_id: string; habit_id: string; checkin_on: string; status: "complete" | "skipped" } & Timestamps,
    { id?: string; user_id: string; habit_id: string; checkin_on?: string; status: "complete" | "skipped" },
    { status?: "complete" | "skipped" }
  >;
  notifications: Table<
    { id: string; user_id: string; kind: string; title: string; body: string; href: string | null; read_at: string | null; created_at: string },
    { id?: string; user_id: string; kind?: string; title: string; body: string; href?: string | null; read_at?: string | null },
    { read_at?: string | null }
  >;
  foods: Table<
    { id: string; owner_id: string | null; source: "local" | "usda" | "custom"; external_id: string | null; name: string; brand: string | null; serving_grams: number; energy_kcal: number; protein_g: number; carbohydrate_g: number; fat_g: number; fibre_g: number; is_public: boolean } & Timestamps,
    { id?: string; owner_id?: string | null; source?: "local" | "usda" | "custom"; external_id?: string | null; name: string; brand?: string | null; serving_grams?: number; energy_kcal?: number; protein_g?: number; carbohydrate_g?: number; fat_g?: number; fibre_g?: number; is_public?: boolean },
    Partial<{ name: string; brand: string | null; serving_grams: number; energy_kcal: number; protein_g: number; carbohydrate_g: number; fat_g: number; fibre_g: number }>
  >;
  food_favourites: Table<
    { user_id: string; food_id: string; created_at: string }, { user_id: string; food_id: string }, Record<string, never>
  >;
  meal_entries: Table<
    { id: string; user_id: string; logged_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; food_id: string | null; food_name: string; amount_grams: number; energy_kcal: number; protein_g: number; carbohydrate_g: number; fat_g: number; fibre_g: number } & Timestamps,
    { id?: string; user_id: string; logged_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; food_id?: string | null; food_name: string; amount_grams: number; energy_kcal: number; protein_g?: number; carbohydrate_g?: number; fat_g?: number; fibre_g?: number },
    Partial<{ logged_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; food_name: string; amount_grams: number; energy_kcal: number; protein_g: number; carbohydrate_g: number; fat_g: number; fibre_g: number }>
  >;
  recipes: Table<
    { id: string; owner_id: string | null; slug: string; title_en: string; title_mk: string; summary_en: string; summary_mk: string; prep_minutes: number; cook_minutes: number; servings: number; energy_kcal: number; protein_g: number; carbohydrate_g: number; fat_g: number; fibre_g: number; tags: string[]; is_public: boolean } & Timestamps,
    { id?: string; owner_id?: string | null; slug: string; title_en: string; title_mk: string; summary_en: string; summary_mk: string; prep_minutes?: number; cook_minutes?: number; servings?: number; energy_kcal?: number; protein_g?: number; carbohydrate_g?: number; fat_g?: number; fibre_g?: number; tags?: string[]; is_public?: boolean },
    Partial<{ title_en: string; title_mk: string; summary_en: string; summary_mk: string; tags: string[] }>
  >;
  recipe_ingredients: Table<
    { id: string; recipe_id: string; position: number; name_en: string; name_mk: string; quantity: number; unit: string },
    { id?: string; recipe_id: string; position?: number; name_en: string; name_mk: string; quantity: number; unit: string },
    Partial<{ position: number; name_en: string; name_mk: string; quantity: number; unit: string }>
  >;
  recipe_steps: Table<
    { id: string; recipe_id: string; position: number; instruction_en: string; instruction_mk: string },
    { id?: string; recipe_id: string; position: number; instruction_en: string; instruction_mk: string },
    Partial<{ position: number; instruction_en: string; instruction_mk: string }>
  >;
  saved_recipes: Table<
    { user_id: string; recipe_id: string; created_at: string }, { user_id: string; recipe_id: string }, Record<string, never>
  >;
  meal_plan_items: Table<
    { id: string; user_id: string; planned_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; recipe_id: string | null; label: string; servings: number } & Timestamps,
    { id?: string; user_id: string; planned_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; recipe_id?: string | null; label: string; servings?: number },
    Partial<{ planned_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; recipe_id: string | null; label: string; servings: number }>
  >;
  grocery_items: Table<
    { id: string; user_id: string; name: string; quantity: number | null; unit: string | null; category: string; is_checked: boolean; source: "manual" | "meal_plan" } & Timestamps,
    { id?: string; user_id: string; name: string; quantity?: number | null; unit?: string | null; category?: string; is_checked?: boolean; source?: "manual" | "meal_plan" },
    Partial<{ name: string; quantity: number | null; unit: string | null; category: string; is_checked: boolean }>
  >;
}; Views: Record<string, never>; Functions: Record<string, never>; Enums: Record<string, never>; CompositeTypes: Record<string, never> } };
