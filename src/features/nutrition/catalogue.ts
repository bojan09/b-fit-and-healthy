export const localFoods = [
  { id: "local-oats", source: "local" as const, name: "Rolled oats", brand: null, servingGrams: 100, energyKcal: 379, proteinG: 13.2, carbohydrateG: 67.7, fatG: 6.5, fibreG: 10.1 },
  { id: "local-banana", source: "local" as const, name: "Banana", brand: null, servingGrams: 100, energyKcal: 89, proteinG: 1.1, carbohydrateG: 22.8, fatG: 0.3, fibreG: 2.6 },
  { id: "local-chicken", source: "local" as const, name: "Chicken breast, cooked", brand: null, servingGrams: 100, energyKcal: 165, proteinG: 31, carbohydrateG: 0, fatG: 3.6, fibreG: 0 },
  { id: "local-lentils", source: "local" as const, name: "Lentils, cooked", brand: null, servingGrams: 100, energyKcal: 116, proteinG: 9, carbohydrateG: 20.1, fatG: 0.4, fibreG: 7.9 },
];

export const recipes = [
  {
    id: "11111111-1111-4111-8111-111111111111", slug: "oat-banana-breakfast", tags: ["Breakfast", "Quick"], prepMinutes: 8, cookMinutes: 5, servings: 1,
    title: { en: "Warm oat and banana bowl", mk: "Топла овесна каша со банана" },
    summary: { en: "A steady breakfast with oats, fruit and yoghurt.", mk: "Стабилен појадок со овес, овошје и јогурт." },
    nutrition: { energyKcal: 438, proteinG: 18, carbohydrateG: 69, fatG: 11, fibreG: 9 },
    ingredients: [
      { name: { en: "Rolled oats", mk: "Овесни снегулки" }, quantity: 60, unit: "g" },
      { name: { en: "Banana", mk: "Банана" }, quantity: 1, unit: "piece" },
      { name: { en: "Plain yoghurt", mk: "Обичен јогурт" }, quantity: 150, unit: "g" },
    ],
    steps: { en: ["Cook the oats with water until creamy.", "Slice the banana and serve with yoghurt."], mk: ["Сварете го овесот со вода додека не стане кремаст.", "Исечете ја бананата и послужете со јогурт."] },
  },
  {
    id: "22222222-2222-4222-8222-222222222222", slug: "lentil-chicken-salad", tags: ["Lunch", "Protein"], prepMinutes: 15, cookMinutes: 20, servings: 2,
    title: { en: "Lentil and chicken salad", mk: "Салата со леќа и пилешко" },
    summary: { en: "A filling lunch built around legumes, vegetables and lean protein.", mk: "Заситен ручек со мешунки, зеленчук и немасен протеин." },
    nutrition: { energyKcal: 512, proteinG: 43, carbohydrateG: 48, fatG: 17, fibreG: 13 },
    ingredients: [
      { name: { en: "Cooked lentils", mk: "Варена леќа" }, quantity: 240, unit: "g" },
      { name: { en: "Chicken breast", mk: "Пилешки гради" }, quantity: 220, unit: "g" },
      { name: { en: "Mixed vegetables", mk: "Мешан зеленчук" }, quantity: 300, unit: "g" },
      { name: { en: "Olive oil", mk: "Маслиново масло" }, quantity: 2, unit: "tbsp" },
    ],
    steps: { en: ["Cook and rest the chicken, then slice it.", "Combine all ingredients and season to taste."], mk: ["Испечете го пилешкото, оставете го да одмори и исечете го.", "Соединете ги состојките и зачинете по вкус."] },
  },
  {
    id: "33333333-3333-4333-8333-333333333333", slug: "herby-bean-tray", tags: ["Dinner", "Plant-forward"], prepMinutes: 12, cookMinutes: 28, servings: 4,
    title: { en: "Herby bean and vegetable tray", mk: "Тава со грав, зеленчук и билки" },
    summary: { en: "A flexible weeknight tray with beans and seasonal vegetables.", mk: "Флексибилна вечера со грав и сезонски зеленчук." },
    nutrition: { energyKcal: 386, proteinG: 17, carbohydrateG: 57, fatG: 11, fibreG: 15 },
    ingredients: [
      { name: { en: "Cooked white beans", mk: "Варен бел грав" }, quantity: 600, unit: "g" },
      { name: { en: "Seasonal vegetables", mk: "Сезонски зеленчук" }, quantity: 800, unit: "g" },
      { name: { en: "Olive oil", mk: "Маслиново масло" }, quantity: 3, unit: "tbsp" },
    ],
    steps: { en: ["Heat the oven to 210°C.", "Toss everything on a tray and roast until browned."], mk: ["Загрејте ја рерната на 210°C.", "Измешајте сè во тава и печете додека не зарумени."] },
  },
] as const;

export type CatalogueRecipe = (typeof recipes)[number];
