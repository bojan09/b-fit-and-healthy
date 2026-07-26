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
  external_content_snapshots: Table<
    { id: string; user_id: string; content_type: "food" | "recipe" | "exercise" | "workout"; provider: string; external_id: string; title: string; source_url: string | null; attribution: string; schema_version: number; payload: Json; retrieved_at: string } & Timestamps,
    { id?: string; user_id: string; content_type: "food" | "recipe" | "exercise" | "workout"; provider: string; external_id: string; title: string; source_url?: string | null; attribution: string; schema_version?: number; payload: Json; retrieved_at: string },
    Partial<{ title: string; source_url: string | null; attribution: string; schema_version: number; payload: Json; retrieved_at: string }>
  >;
  meal_entries: Table<
    { id: string; user_id: string; logged_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; food_id: string | null; external_snapshot_id: string | null; food_name: string; amount_grams: number; energy_kcal: number; protein_g: number; carbohydrate_g: number; fat_g: number; fibre_g: number } & Timestamps,
    { id?: string; user_id: string; logged_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; food_id?: string | null; external_snapshot_id?: string | null; food_name: string; amount_grams: number; energy_kcal: number; protein_g?: number; carbohydrate_g?: number; fat_g?: number; fibre_g?: number },
    Partial<{ logged_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; external_snapshot_id: string | null; food_name: string; amount_grams: number; energy_kcal: number; protein_g: number; carbohydrate_g: number; fat_g: number; fibre_g: number }>
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
    { id: string; user_id: string; planned_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; recipe_id: string | null; external_snapshot_id: string | null; label: string; servings: number } & Timestamps,
    { id?: string; user_id: string; planned_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; recipe_id?: string | null; external_snapshot_id?: string | null; label: string; servings?: number },
    Partial<{ planned_on: string; meal_slot: "breakfast" | "lunch" | "dinner" | "snack"; recipe_id: string | null; external_snapshot_id: string | null; label: string; servings: number }>
  >;
  grocery_items: Table<
    { id: string; user_id: string; name: string; quantity: number | null; unit: string | null; category: string; is_checked: boolean; source: "manual" | "meal_plan" } & Timestamps,
    { id?: string; user_id: string; name: string; quantity?: number | null; unit?: string | null; category?: string; is_checked?: boolean; source?: "manual" | "meal_plan" },
    Partial<{ name: string; quantity: number | null; unit: string | null; category: string; is_checked: boolean }>
  >;
  exercises: Table<{ id: string; slug: string; title_en: string; title_mk: string; summary_en: string; summary_mk: string; equipment: string[]; difficulty: string; movement_pattern: string; exercise_type: string; instructions_en: Json; instructions_mk: Json; safety_en: string; safety_mk: string; is_public: boolean } & Timestamps, { id?: string; slug: string; title_en: string; title_mk: string; summary_en: string; summary_mk: string; equipment?: string[]; difficulty?: string; movement_pattern: string; exercise_type: string }, Partial<{ title_en: string; title_mk: string; summary_en: string; summary_mk: string; equipment: string[]; is_public: boolean }>>;
  exercise_muscles: Table<{ exercise_id: string; muscle_key: string; role: "primary" | "secondary" }, { exercise_id: string; muscle_key: string; role: "primary" | "secondary" }, Record<string, never>>;
  workout_programs: Table<{ id: string; user_id: string; name: string; description: string; is_active: boolean } & Timestamps, { id?: string; user_id: string; name: string; description?: string; is_active?: boolean }, Partial<{ name: string; description: string; is_active: boolean }>>;
  workout_templates: Table<{ id: string; user_id: string; program_id: string | null; name: string; description: string; difficulty: string; expected_duration_minutes: number; goal: string } & Timestamps, { id?: string; user_id: string; program_id?: string | null; name: string; description?: string; difficulty?: string; expected_duration_minutes?: number; goal?: string }, Partial<{ program_id: string | null; name: string; description: string; difficulty: string; expected_duration_minutes: number; goal: string }>>;
  workout_template_exercises: Table<{ id: string; user_id: string; template_id: string; exercise_id: string | null; external_snapshot_id: string | null; position: number; target_sets: number; rep_min: number | null; rep_max: number | null; target_duration_seconds: number | null; rest_seconds: number; target_rpe: number | null; note: string } & Timestamps, { id?: string; user_id: string; template_id: string; exercise_id?: string | null; external_snapshot_id?: string | null; position: number; target_sets?: number; rep_min?: number | null; rep_max?: number | null; target_duration_seconds?: number | null; rest_seconds?: number; target_rpe?: number | null; note?: string }, Partial<{ exercise_id: string | null; external_snapshot_id: string | null; position: number; target_sets: number; rep_min: number | null; rep_max: number | null; target_duration_seconds: number | null; rest_seconds: number; target_rpe: number | null; note: string }>>;
  planned_workouts: Table<{ id: string; user_id: string; template_id: string; planned_on: string; status: "planned" | "complete" | "skipped" } & Timestamps, { id?: string; user_id: string; template_id: string; planned_on: string; status?: "planned" | "complete" | "skipped" }, Partial<{ planned_on: string; status: "planned" | "complete" | "skipped" }>>;
  workout_sessions: Table<{ id: string; user_id: string; template_id: string | null; planned_workout_id: string | null; name_snapshot: string; status: "active" | "complete" | "discarded"; started_at: string; finished_at: string | null; duration_seconds: number | null; note: string } & Timestamps, { id?: string; user_id: string; template_id?: string | null; planned_workout_id?: string | null; name_snapshot: string; status?: "active" | "complete" | "discarded"; started_at?: string; note?: string }, Partial<{ status: "active" | "complete" | "discarded"; finished_at: string | null; duration_seconds: number | null; note: string }>>;
  workout_session_exercises: Table<{ id: string; user_id: string; session_id: string; exercise_id: string | null; position: number; name_en_snapshot: string; name_mk_snapshot: string; target_sets: number; rep_min: number | null; rep_max: number | null; rest_seconds: number; target_rpe: number | null } & Timestamps, { id?: string; user_id: string; session_id: string; exercise_id?: string | null; position: number; name_en_snapshot: string; name_mk_snapshot: string; target_sets?: number; rep_min?: number | null; rep_max?: number | null; rest_seconds?: number; target_rpe?: number | null }, Partial<{ position: number; target_sets: number; rep_min: number | null; rep_max: number | null; rest_seconds: number; target_rpe: number | null }>>;
  workout_sets: Table<{ id: string; user_id: string; session_id: string; session_exercise_id: string; position: number; reps: number | null; load_kg: number | null; duration_seconds: number | null; rpe: number | null; is_bodyweight: boolean; is_complete: boolean; note: string } & Timestamps, { id?: string; user_id: string; session_id: string; session_exercise_id: string; position: number; reps?: number | null; load_kg?: number | null; duration_seconds?: number | null; rpe?: number | null; is_bodyweight?: boolean; is_complete?: boolean; note?: string }, Partial<{ position: number; reps: number | null; load_kg: number | null; duration_seconds: number | null; rpe: number | null; is_bodyweight: boolean; is_complete: boolean; note: string }>>;
  ai_conversations: Table<
    { id: string; user_id: string; locale: "en" | "mk"; title: string; expires_at: string; last_message_at: string } & Timestamps,
    { id?: string; user_id: string; locale?: "en" | "mk"; title?: string; expires_at?: string; last_message_at?: string },
    Partial<{ locale: "en" | "mk"; title: string; expires_at: string; last_message_at: string; updated_at: string }>
  >;
  ai_messages: Table<
    { id: string; conversation_id: string; user_id: string; role: "user" | "assistant"; content: string; draft: Json | null; applied_at: string | null; status: "complete" | "aborted" | "failed"; created_at: string },
    { id?: string; conversation_id: string; user_id: string; role: "user" | "assistant"; content: string; draft?: Json | null; applied_at?: string | null; status?: "complete" | "aborted" | "failed"; created_at?: string },
    Partial<{ content: string; draft: Json | null; applied_at: string | null; status: "complete" | "aborted" | "failed" }>
  >;
}; Views: Record<string, never>; Functions: Record<string, never>; Enums: Record<string, never>; CompositeTypes: Record<string, never> } };
