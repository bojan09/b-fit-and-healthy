export type DiscoveryProvider =
  | "local"
  | "usda"
  | "open-food-facts"
  | "themealdb"
  | "wger"
  | "musclewiki";

export type DiscoveryQuality = "curated" | "verified" | "community";
export type DiscoveryKind = "food" | "recipe" | "exercise" | "workout";

export type DiscoveryBase = {
  id: string;
  kind: DiscoveryKind;
  provider: DiscoveryProvider;
  externalId: string;
  title: string;
  normalizedTitle: string;
  sourceUrl: string | null;
  attribution: string;
  retrievedAt: string;
  quality: DiscoveryQuality;
  completeness: string[];
  alternates: string[];
};

export type NutrientValues = {
  energyKcal: number | null;
  proteinG: number | null;
  carbohydrateG: number | null;
  fatG: number | null;
  fibreG: number | null;
};

export type DiscoveryFood = DiscoveryBase &
  NutrientValues & {
    kind: "food";
    brand: string | null;
    servingAmount: number;
    servingUnit: string;
    barcode: string | null;
    nutrientBasis: "per-100-g" | "per-serving";
  };

export type DiscoveryRecipe = DiscoveryBase & {
  kind: "recipe";
  category: string | null;
  cuisine: string | null;
  ingredients: Array<{ name: string; measure: string }>;
  instructions: string[];
  servings: number | null;
  totalMinutes: number | null;
  imageUrl: string | null;
  nutrition: NutrientValues | null;
};

export type DiscoveryExercise = DiscoveryBase & {
  kind: "exercise";
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: string | null;
  movementPattern: string | null;
  instructions: string[];
  safety: string | null;
  media: Array<{ type: "image" | "video"; url: string }>;
};

export type DiscoveryWorkoutExercise = {
  exerciseId: string;
  title: string;
  sets: number;
  repMin: number | null;
  repMax: number | null;
  durationSeconds: number | null;
  restSeconds: number;
};

export type DiscoveryWorkout = DiscoveryBase & {
  kind: "workout";
  goal: string;
  durationMinutes: number | null;
  difficulty: string | null;
  equipment: string[];
  exercises: DiscoveryWorkoutExercise[];
};

export type DiscoveryItem =
  | DiscoveryFood
  | DiscoveryRecipe
  | DiscoveryExercise
  | DiscoveryWorkout;

export type DiscoveryContext = {
  query: string;
  activeGoals?: string[];
  recentIds?: string[];
  equipment?: string[];
  difficulty?: string | null;
};

export function normalizeDiscoveryTitle(value: string) {
  return value
    .normalize("NFKD")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}
