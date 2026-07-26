import { exercises } from "@/features/fitness/catalogue";
import { workoutIdeas } from "@/features/fitness/workout-ideas";
import { localFoods } from "@/features/nutrition/catalogue";
import { recipeCatalogue } from "@/features/nutrition/recipe-catalogue";
import {
  normalizeDiscoveryTitle,
  type DiscoveryExercise,
  type DiscoveryFood,
  type DiscoveryRecipe,
  type DiscoveryWorkout,
} from "@/features/discovery/types";

const retrievedAt = "2026-07-25T00:00:00.000Z";

export const localDiscoveryFoods: DiscoveryFood[] = localFoods.map((food) => ({
  id: `local:${food.id}`,
  kind: "food",
  provider: "local",
  externalId: food.id,
  title: food.name,
  normalizedTitle: normalizeDiscoveryTitle(food.name),
  sourceUrl: null,
  attribution: "B Fit & Healthy curated food catalogue",
  retrievedAt,
  quality: "curated",
  completeness: [
    "energyKcal",
    "proteinG",
    "carbohydrateG",
    "fatG",
    "fibreG",
  ],
  alternates: [],
  brand: food.brand,
  servingAmount: food.servingGrams,
  servingUnit: "g",
  energyKcal: food.energyKcal,
  proteinG: food.proteinG,
  carbohydrateG: food.carbohydrateG,
  fatG: food.fatG,
  fibreG: food.fibreG,
  barcode: null,
  nutrientBasis: "per-100-g",
}));

export const localDiscoveryRecipes: DiscoveryRecipe[] = recipeCatalogue.map(
  (recipe) => ({
    id: `local:${recipe.id}`,
    kind: "recipe",
    provider: "local",
    externalId: recipe.id,
    title: recipe.title.en,
    normalizedTitle: normalizeDiscoveryTitle(recipe.title.en),
    sourceUrl: `/recipes/${recipe.slug}`,
    attribution: "B Fit & Healthy curated recipe",
    retrievedAt,
    quality: "curated",
    completeness: ["ingredients", "instructions", "nutrition"],
    alternates: [],
    category: recipe.meal,
    cuisine: null,
    ingredients: recipe.ingredients.map((ingredient) => ({
      name: ingredient.name.en,
      measure: `${ingredient.quantity} ${ingredient.unit}`.trim(),
    })),
    instructions: recipe.steps.en,
    servings: recipe.servings,
    totalMinutes: recipe.totalMinutes,
    imageUrl: null,
    nutrition: {
      energyKcal: recipe.nutrition.energyKcal,
      proteinG: recipe.nutrition.proteinG,
      carbohydrateG: recipe.nutrition.carbohydrateG,
      fatG: recipe.nutrition.fatG,
      fibreG: recipe.nutrition.fibreG,
    },
  }),
);

export const localDiscoveryExercises: DiscoveryExercise[] = exercises.map(
  (exercise) => ({
    id: `local:${exercise.slug}`,
    kind: "exercise",
    provider: "local",
    externalId: exercise.slug,
    title: exercise.titleEn,
    normalizedTitle: normalizeDiscoveryTitle(exercise.titleEn),
    sourceUrl: `/exercises/${exercise.slug}`,
    attribution: "B Fit & Healthy clinical exercise catalogue",
    retrievedAt,
    quality: "curated",
    completeness: ["instructions", "safety"],
    alternates: [],
    primaryMuscles: exercise.primaryMuscles,
    secondaryMuscles: exercise.secondaryMuscles,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    movementPattern: exercise.movementPattern,
    instructions: exercise.instructionsEn,
    safety: exercise.safetyEn,
    media: [],
  }),
);

export const localDiscoveryWorkouts: DiscoveryWorkout[] = workoutIdeas.map(
  (workout) => ({
    id: `local:${workout.slug}`,
    kind: "workout",
    provider: "local",
    externalId: workout.slug,
    title: workout.title,
    normalizedTitle: normalizeDiscoveryTitle(workout.title),
    sourceUrl: `/workouts/new?idea=${workout.slug}`,
    attribution: "B Fit & Healthy curated workout",
    retrievedAt,
    quality: "curated",
    completeness: ["exercises", "duration", "difficulty"],
    alternates: [],
    goal: workout.goal,
    durationMinutes: workout.durationMinutes,
    difficulty: workout.level,
    equipment: workout.equipment,
    exercises: workout.exerciseSlugs.map((slug) => {
      const exercise = exercises.find((item) => item.slug === slug);
      return {
        exerciseId: `local:${slug}`,
        title: exercise?.titleEn ?? slug,
        sets: 3,
        repMin: 8,
        repMax: 12,
        durationSeconds: null,
        restSeconds: 90,
      };
    }),
  }),
);

export function searchLocal<T extends { normalizedTitle: string }>(
  items: readonly T[],
  query: string,
) {
  const normalized = normalizeDiscoveryTitle(query);
  return items.filter((item) => item.normalizedTitle.includes(normalized));
}
