import type { Recipe, RecipeDietary, RecipeMeal } from "./recipe-types";

type RecipeSeed = {
  slug: string;
  meal: RecipeMeal;
  title: string;
  summary: string;
  minutes: number;
  protein: number;
  kcal: number;
  dietary?: RecipeDietary[];
  ingredients: string[];
};

const seeds: RecipeSeed[] = [
  { slug: "oat-banana-breakfast", meal: "breakfast", title: "Warm oat and banana bowl", summary: "Creamy oats, fruit and yoghurt for an easy, steady start.", minutes: 13, protein: 18, kcal: 438, dietary: ["vegetarian"], ingredients: ["Rolled oats", "Banana", "Plain yoghurt"] },
  { slug: "berry-yoghurt-crunch", meal: "breakfast", title: "Berry yoghurt crunch", summary: "Cool yoghurt with berries, toasted oats and pumpkin seeds.", minutes: 8, protein: 22, kcal: 390, dietary: ["vegetarian", "high-protein"], ingredients: ["Greek yoghurt", "Mixed berries", "Rolled oats", "Pumpkin seeds"] },
  { slug: "spinach-egg-toast", meal: "breakfast", title: "Spinach eggs on toast", summary: "Soft eggs and wilted greens on wholegrain toast.", minutes: 15, protein: 25, kcal: 420, dietary: ["vegetarian", "high-protein"], ingredients: ["Eggs", "Spinach", "Wholegrain bread", "Tomato"] },
  { slug: "apple-cinnamon-overnight-oats", meal: "breakfast", title: "Apple cinnamon overnight oats", summary: "A prepare-ahead jar with apple, oats and warming spice.", minutes: 10, protein: 16, kcal: 405, dietary: ["vegetarian"], ingredients: ["Rolled oats", "Apple", "Milk", "Chia seeds"] },
  { slug: "savoury-chickpea-breakfast", meal: "breakfast", title: "Savoury chickpea breakfast", summary: "Lemony chickpeas, tomatoes and herbs over toast.", minutes: 18, protein: 17, kcal: 445, dietary: ["plant-forward"], ingredients: ["Chickpeas", "Tomatoes", "Wholegrain bread", "Parsley"] },

  { slug: "lentil-chicken-salad", meal: "lunch", title: "Lentil and chicken salad", summary: "Legumes, crisp vegetables and lean protein in one satisfying bowl.", minutes: 25, protein: 43, kcal: 512, dietary: ["high-protein"], ingredients: ["Cooked lentils", "Chicken breast", "Mixed vegetables", "Olive oil"] },
  { slug: "tuna-white-bean-pita", meal: "lunch", title: "Tuna and white bean pita", summary: "A bright pantry lunch with lemon, herbs and crunchy leaves.", minutes: 12, protein: 36, kcal: 475, dietary: ["high-protein"], ingredients: ["Tuna", "White beans", "Wholegrain pita", "Lettuce"] },
  { slug: "roasted-vegetable-couscous", meal: "lunch", title: "Roasted vegetable couscous", summary: "Colourful vegetables, couscous and a sharp herb dressing.", minutes: 28, protein: 16, kcal: 465, dietary: ["plant-forward"], ingredients: ["Couscous", "Courgette", "Pepper", "Chickpeas"] },
  { slug: "turkey-avocado-wrap", meal: "lunch", title: "Turkey avocado wrap", summary: "A portable wrap with turkey, avocado and plenty of salad.", minutes: 10, protein: 34, kcal: 490, dietary: ["high-protein"], ingredients: ["Turkey breast", "Avocado", "Wholegrain wrap", "Salad leaves"] },
  { slug: "tomato-lentil-soup", meal: "lunch", title: "Tomato and red lentil soup", summary: "A comforting one-pot soup that keeps well for tomorrow.", minutes: 30, protein: 19, kcal: 410, dietary: ["plant-forward"], ingredients: ["Red lentils", "Tomatoes", "Carrot", "Vegetable stock"] },

  { slug: "herby-bean-tray", meal: "dinner", title: "Herby bean and vegetable tray", summary: "A flexible weeknight tray with beans and seasonal vegetables.", minutes: 30, protein: 17, kcal: 386, dietary: ["plant-forward"], ingredients: ["White beans", "Seasonal vegetables", "Olive oil", "Fresh herbs"] },
  { slug: "lemon-chicken-potatoes", meal: "dinner", title: "Lemon chicken and potatoes", summary: "A simple tray bake with lemon, oregano and green beans.", minutes: 45, protein: 46, kcal: 590, dietary: ["high-protein"], ingredients: ["Chicken breast", "Baby potatoes", "Green beans", "Lemon"] },
  { slug: "ginger-tofu-noodles", meal: "dinner", title: "Ginger tofu noodles", summary: "Crisp tofu, vegetables and noodles in a gingery sauce.", minutes: 25, protein: 26, kcal: 535, dietary: ["plant-forward", "vegetarian"], ingredients: ["Firm tofu", "Noodles", "Broccoli", "Ginger"] },
  { slug: "salmon-pea-rice", meal: "dinner", title: "Salmon, pea and herb rice", summary: "Flaky salmon with bright peas and lemony brown rice.", minutes: 30, protein: 39, kcal: 610, dietary: ["high-protein"], ingredients: ["Salmon", "Brown rice", "Peas", "Lemon"] },
  { slug: "turkey-bean-chilli", meal: "dinner", title: "Turkey and bean chilli", summary: "A freezer-friendly chilli with vegetables and warm spices.", minutes: 40, protein: 44, kcal: 545, dietary: ["high-protein"], ingredients: ["Turkey mince", "Kidney beans", "Tomatoes", "Pepper"] },
  { slug: "mushroom-spinach-orzo", meal: "dinner", title: "Mushroom spinach orzo", summary: "Creamy-tasting orzo made fresh with mushrooms and greens.", minutes: 27, protein: 20, kcal: 500, dietary: ["vegetarian"], ingredients: ["Orzo", "Mushrooms", "Spinach", "Parmesan"] },
  { slug: "quick-chickpea-curry", meal: "dinner", title: "Quick chickpea curry", summary: "A fragrant tomato curry designed for busy evenings.", minutes: 25, protein: 18, kcal: 470, dietary: ["plant-forward"], ingredients: ["Chickpeas", "Tomatoes", "Spinach", "Curry spices"] },
  { slug: "beef-broccoli-rice", meal: "dinner", title: "Beef and broccoli rice bowl", summary: "Lean beef, crisp broccoli and rice with a savoury glaze.", minutes: 28, protein: 41, kcal: 575, dietary: ["high-protein"], ingredients: ["Lean beef", "Broccoli", "Brown rice", "Soy sauce"] },

  { slug: "pear-almond-yoghurt", meal: "snack", title: "Pear and almond yoghurt", summary: "Creamy yoghurt with fresh pear and a little almond crunch.", minutes: 5, protein: 15, kcal: 250, dietary: ["vegetarian"], ingredients: ["Plain yoghurt", "Pear", "Almonds"] },
  { slug: "hummus-crunch-box", meal: "snack", title: "Hummus crunch box", summary: "Hummus, vegetables and crispbread ready for an afternoon dip.", minutes: 8, protein: 11, kcal: 280, dietary: ["plant-forward"], ingredients: ["Hummus", "Carrot", "Cucumber", "Rye crispbread"] },
  { slug: "cocoa-oat-energy-bites", meal: "snack", title: "Cocoa oat energy bites", summary: "No-bake oat bites portioned for a practical grab-and-go snack.", minutes: 15, protein: 9, kcal: 230, dietary: ["plant-forward"], ingredients: ["Rolled oats", "Peanut butter", "Cocoa", "Dates"] },
  { slug: "cottage-cheese-tomato", meal: "snack", title: "Cottage cheese and tomato", summary: "A savoury protein snack with tomato, pepper and herbs.", minutes: 5, protein: 24, kcal: 220, dietary: ["vegetarian", "high-protein"], ingredients: ["Cottage cheese", "Tomato", "Black pepper", "Fresh herbs"] },
  { slug: "banana-peanut-toast", meal: "snack", title: "Banana peanut toast", summary: "Wholegrain toast with peanut butter and sliced banana.", minutes: 6, protein: 12, kcal: 310, dietary: ["plant-forward"], ingredients: ["Wholegrain bread", "Peanut butter", "Banana"] },
  { slug: "edamame-lemon-cup", meal: "snack", title: "Lemon pepper edamame", summary: "Warm edamame seasoned with lemon and cracked pepper.", minutes: 7, protein: 17, kcal: 210, dietary: ["plant-forward", "high-protein"], ingredients: ["Edamame", "Lemon", "Black pepper"] },

  { slug: "protein-toast", meal: "breakfast", title: "Protein toast", summary: "Wholegrain toast topped with a protein-rich spread for a quick start.", minutes: 8, protein: 20, kcal: 350, dietary: ["high-protein"], ingredients: ["Wholegrain bread", "Cottage cheese", "Egg whites"] },
  { slug: "hummus-boiled-eggs", meal: "breakfast", title: "Hummus with boiled eggs", summary: "Creamy hummus paired with simple boiled eggs for balanced protein and fibre.", minutes: 10, protein: 19, kcal: 360, dietary: ["vegetarian", "high-protein"], ingredients: ["Hummus", "Boiled eggs", "Wholegrain bread"] },
  { slug: "three-egg-omelette", meal: "breakfast", title: "Three-egg, two-white omelette", summary: "A classic high-protein omelette using whole eggs and extra whites.", minutes: 10, protein: 27, kcal: 320, dietary: ["vegetarian", "high-protein"], ingredients: ["Eggs", "Egg whites", "Peppers", "Onion"] },
  { slug: "chia-pudding", meal: "breakfast", title: "Chia pudding", summary: "An overnight chia pudding that sets into a creamy, prepare-ahead breakfast.", minutes: 6, protein: 12, kcal: 300, dietary: ["vegetarian", "plant-forward"], ingredients: ["Chia seeds", "Milk", "Honey", "Berries"] },

  { slug: "pasta-chicken-mushroom", meal: "lunch", title: "Pasta with chicken and mushrooms", summary: "Pasta tossed with chicken, mushrooms and a frozen vegetable mix.", minutes: 25, protein: 38, kcal: 560, dietary: ["high-protein"], ingredients: ["Pasta", "Chicken breast", "Mushrooms", "Frozen vegetable mix"] },
  { slug: "noodles-chicken-tomato-honey", meal: "lunch", title: "Noodles with chicken and tomato-honey sauce", summary: "Noodles with chicken in a sweet-and-spicy tomato sauce and vegetables.", minutes: 22, protein: 36, kcal: 555, dietary: ["high-protein"], ingredients: ["Noodles", "Chicken breast", "Tomato sauce", "Honey", "Chili", "Frozen vegetable mix"] },
  { slug: "chicken-white-sauce-potato-salad", meal: "lunch", title: "Chicken in white sauce with potato salad", summary: "Chicken in a light white sauce served with a simple potato salad.", minutes: 30, protein: 40, kcal: 580, dietary: ["high-protein"], ingredients: ["Chicken breast", "Light white sauce", "Potatoes", "Herbs"] },
  { slug: "tuna-salad-corn-olives", meal: "lunch", title: "Tuna salad with corn and olives", summary: "Tuna with corn, onions, olives and cucumber for a light protein lunch.", minutes: 12, protein: 32, kcal: 420, dietary: ["high-protein"], ingredients: ["Tuna", "Corn", "Onions", "Olives", "Cucumber"] },
  { slug: "fish-potato-salad", meal: "lunch", title: "Fish with potato salad", summary: "Simply cooked fish served alongside a hearty potato salad.", minutes: 25, protein: 35, kcal: 500, dietary: ["high-protein"], ingredients: ["White fish", "Potatoes", "Herbs", "Olive oil"] },
  { slug: "zucchini-patties-sopska", meal: "lunch", title: "Zucchini patties with Sopska salad", summary: "Pan-fried zucchini patties served with a fresh tomato-cucumber salad.", minutes: 30, protein: 18, kcal: 410, dietary: ["vegetarian"], ingredients: ["Zucchini", "Eggs", "Flour", "Tomato", "Cucumber", "Onion"] },
  { slug: "bojana-salad", meal: "lunch", title: "Bojana salad", summary: "A grain salad with quinoa, millet and corn, fresh vegetables, cheese and nuts.", minutes: 20, protein: 20, kcal: 460, dietary: ["vegetarian"], ingredients: ["Quinoa", "Millet", "Corn", "Cucumber", "Tomato", "Onion", "Cheese", "Trail mix nuts"] },

  { slug: "egg-whites-sopska-salad", meal: "dinner", title: "Egg whites with Sopska salad", summary: "A light, high-protein dinner of egg whites and fresh tomato-cucumber salad.", minutes: 12, protein: 24, kcal: 260, dietary: ["vegetarian", "high-protein"], ingredients: ["Egg whites", "Tomato", "Cucumber", "Onion", "White cheese"] },
  { slug: "caesar-salad", meal: "dinner", title: "Caesar salad", summary: "A classic Caesar salad kept light for an easy evening meal.", minutes: 15, protein: 26, kcal: 420, dietary: ["high-protein"], ingredients: ["Chicken breast", "Romaine lettuce", "Parmesan", "Wholegrain croutons"] },
  { slug: "egg-whites-cottage-cheese-sopska", meal: "dinner", title: "Egg whites with cottage cheese and Sopska salad", summary: "Egg whites and cottage cheese for a very high-protein, low-effort dinner.", minutes: 10, protein: 30, kcal: 280, dietary: ["vegetarian", "high-protein"], ingredients: ["Egg whites", "Cottage cheese", "Tomato", "Cucumber", "Onion"] },
  { slug: "protein-ice-cream", meal: "dinner", title: "Protein ice cream", summary: "A frozen, blended protein treat for finishing the day on a lighter note.", minutes: 5, protein: 25, kcal: 220, dietary: ["vegetarian", "high-protein"], ingredients: ["Protein powder", "Frozen banana", "Milk"] },
  { slug: "greek-yoghurt-fruit-ice-cream", meal: "dinner", title: "Greek yoghurt with fruit ice cream", summary: "Frozen Greek yoghurt blended with fruit for a simple, protein-rich dessert.", minutes: 5, protein: 18, kcal: 240, dietary: ["vegetarian", "high-protein"], ingredients: ["Greek yoghurt", "Frozen mixed fruit", "Honey"] },
];

function stableId(index: number, slug: string) {
  const seededIds: Record<string, string> = {
    "oat-banana-breakfast": "11111111-1111-4111-8111-111111111111",
    "lentil-chicken-salad": "22222222-2222-4222-8222-222222222222",
    "herby-bean-tray": "33333333-3333-4333-8333-333333333333",
  };
  if (seededIds[slug]) return seededIds[slug];
  const suffix = String(index + 1).padStart(12, "0");
  return `10000000-0000-4000-8000-${suffix}`;
}

export const recipeCatalogue: Recipe[] = seeds.map((seed, index) => {
  const prepMinutes = Math.min(15, Math.max(5, Math.round(seed.minutes * 0.35)));
  const cookMinutes = seed.minutes - prepMinutes;
  const title = { en: seed.title, mk: seed.title };
  return {
    id: stableId(index, seed.slug),
    slug: seed.slug,
    meal: seed.meal,
    tags: [seed.meal[0].toUpperCase() + seed.meal.slice(1), ...(seed.dietary ?? []).map((tag) => tag.replace("-", " "))],
    dietary: seed.dietary ?? [],
    prepMinutes,
    cookMinutes,
    totalMinutes: seed.minutes,
    servings: seed.meal === "dinner" ? 4 : seed.meal === "lunch" ? 2 : 1,
    title,
    summary: { en: seed.summary, mk: seed.summary },
    nutrition: {
      energyKcal: seed.kcal,
      proteinG: seed.protein,
      carbohydrateG: Math.round(seed.kcal * 0.11),
      fatG: Math.round(seed.kcal * 0.035),
      fibreG: seed.dietary?.includes("plant-forward") ? 12 : 7,
      status: "estimated",
    },
    ingredients: seed.ingredients.map((ingredient, ingredientIndex) => ({
      name: { en: ingredient, mk: ingredient },
      quantity: ingredientIndex === 0 ? 150 : 100,
      unit: "g",
    })),
    steps: {
      en: [
        `Prepare the ${seed.ingredients.slice(0, -1).join(", ")} and ${seed.ingredients.at(-1)}.`,
        "Cook or assemble until everything is ready, then season to taste.",
        "Divide into servings and add any fresh finishing ingredients.",
      ],
      mk: [
        `Prepare the ${seed.ingredients.slice(0, -1).join(", ")} and ${seed.ingredients.at(-1)}.`,
        "Cook or assemble until everything is ready, then season to taste.",
        "Divide into servings and add any fresh finishing ingredients.",
      ],
    },
    provenance: "verified-local",
    databaseReady: ["oat-banana-breakfast", "lentil-chicken-salad", "herby-bean-tray"].includes(seed.slug),
  };
});
