import type { Locale } from "@/lib/i18n/config";

export type RecipeMeal = "breakfast" | "lunch" | "dinner" | "snack";
export type RecipeDietary = "plant-forward" | "vegetarian" | "high-protein";
export type RecipeProvenance = "verified-local" | "provider-inspiration";

export type LocalizedText = Record<Locale, string>;

export type Recipe = {
  id: string;
  slug: string;
  meal: RecipeMeal;
  tags: string[];
  dietary: RecipeDietary[];
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  servings: number;
  title: LocalizedText;
  summary: LocalizedText;
  nutrition: {
    energyKcal: number;
    proteinG: number;
    carbohydrateG: number;
    fatG: number;
    fibreG: number;
    status: "estimated";
  };
  ingredients: Array<{
    name: LocalizedText;
    quantity: number;
    unit: string;
  }>;
  steps: Record<Locale, string[]>;
  provenance: RecipeProvenance;
  providerUrl?: string;
  databaseReady: boolean;
};
