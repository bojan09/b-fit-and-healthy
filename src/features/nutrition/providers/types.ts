export type ProviderRecipe = {
  provider: "themealdb";
  externalId: string;
  title: string;
  category: string | null;
  cuisine: string | null;
  instructions: string[];
  ingredients: Array<{ name: string; measure: string }>;
  sourceUrl: string | null;
  nutrition: null;
};
