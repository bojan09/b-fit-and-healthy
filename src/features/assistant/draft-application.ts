import type { AssistantDraft, RecipeDraft, WorkoutDraft } from "@/features/assistant/types";

export function draftDestination(kind: AssistantDraft["kind"]) {
  return {
    meal: "/meal-planner",
    workout: "/workouts",
    habit: "/habits",
    recipe: "/recipes",
    summary: "/progress",
  }[kind];
}

export function workoutTemplateRow(draft: WorkoutDraft, userId: string) {
  return {
    user_id: userId,
    name: draft.name,
    description: draft.description,
    expected_duration_minutes: draft.durationMinutes,
  };
}

export function recipeRows(draft: RecipeDraft, userId: string, suffix: string) {
  return {
    recipe: {
      owner_id: userId,
      slug: `${draft.slug}-${suffix}`,
      title_en: draft.title,
      title_mk: draft.title,
      summary_en: draft.summary,
      summary_mk: draft.summary,
      prep_minutes: draft.prepMinutes,
      cook_minutes: draft.cookMinutes,
      servings: draft.servings,
      is_public: false,
      tags: ["Coach draft"],
    },
    ingredients: draft.ingredients.map((ingredient, index) => ({
      position: index + 1,
      name_en: ingredient.name,
      name_mk: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    })),
    steps: draft.steps.map((step, index) => ({
      position: index + 1,
      instruction_en: step,
      instruction_mk: step,
    })),
  };
}

