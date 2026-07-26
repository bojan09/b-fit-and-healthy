export const localFoods = [
  { id: "local-oats", source: "local" as const, name: "Rolled oats", brand: null, servingGrams: 100, energyKcal: 379, proteinG: 13.2, carbohydrateG: 67.7, fatG: 6.5, fibreG: 10.1 },
  { id: "local-banana", source: "local" as const, name: "Banana", brand: null, servingGrams: 100, energyKcal: 89, proteinG: 1.1, carbohydrateG: 22.8, fatG: 0.3, fibreG: 2.6 },
  { id: "local-chicken", source: "local" as const, name: "Chicken breast, cooked", brand: null, servingGrams: 100, energyKcal: 165, proteinG: 31, carbohydrateG: 0, fatG: 3.6, fibreG: 0 },
  { id: "local-lentils", source: "local" as const, name: "Lentils, cooked", brand: null, servingGrams: 100, energyKcal: 116, proteinG: 9, carbohydrateG: 20.1, fatG: 0.4, fibreG: 7.9 },
];

export { recipeCatalogue as recipes } from "./recipe-catalogue";
export type { Recipe as CatalogueRecipe } from "./recipe-types";
