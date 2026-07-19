import type { Locale } from "@/lib/i18n/config";

const content = {
  en: {
    nav: { nutrition: "Nutrition", planner: "Planner", recipes: "Recipes", groceries: "Groceries" },
    nutrition: { title: "Nutrition", intro: "Log what is useful, then read the day without judgement.", energy: "Energy", protein: "Protein", carbs: "Carbohydrate", fat: "Fat", fibre: "Fibre", add: "Add food", search: "Search foods", custom: "Create custom food", noEntries: "Nothing logged for this day. Search for a food or use one of your custom foods.", targets: "Daily direction", targetMissing: "Complete your nutrition targets in settings to compare your day.", source: "External results are supplied by USDA FoodData Central." },
    planner: { title: "Meal planner", intro: "Give the week enough structure while leaving room to change it.", add: "Plan a meal", empty: "No meal planned", generate: "Build grocery list" },
    recipes: { title: "Recipe library", intro: "Practical meals with clear ingredients, steps and nutrition estimates.", ingredients: "Ingredients", method: "Method", nutrition: "Per serving estimate", save: "Save recipe", saved: "Saved", plan: "Add to planner" },
    groceries: { title: "Grocery list", intro: "One checkable list built from your plan and manual additions.", add: "Add item", generate: "Add ingredients from the next two weeks", empty: "Your grocery list is empty. Add an item or generate one from planned recipes." },
    common: { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", delete: "Remove", save: "Save", grams: "grams", amount: "Amount", date: "Date", servings: "Servings", name: "Name", quantity: "Quantity", unit: "Unit", category: "Category" },
  },
  mk: {
    nav: { nutrition: "Исхрана", planner: "Планер", recipes: "Рецепти", groceries: "Намирници" },
    nutrition: { title: "Исхрана", intro: "Забележете го корисното, па прегледајте го денот без осуда.", energy: "Енергија", protein: "Протеини", carbs: "Јаглехидрати", fat: "Масти", fibre: "Влакна", add: "Додај храна", search: "Пребарај храна", custom: "Создај сопствена храна", noEntries: "Нема внес за овој ден. Пребарајте храна или користете сопствена храна.", targets: "Дневна насока", targetMissing: "Поставете цели за исхрана за да го споредите денот.", source: "Надворешните резултати ги обезбедува USDA FoodData Central." },
    planner: { title: "Планер за оброци", intro: "Дајте ѝ структура на неделата, со простор за промени.", add: "Планирај оброк", empty: "Нема планиран оброк", generate: "Создај список" },
    recipes: { title: "Библиотека со рецепти", intro: "Практични оброци со јасни состојки, чекори и проценка на хранливост.", ingredients: "Состојки", method: "Подготовка", nutrition: "Проценка по порција", save: "Зачувај рецепт", saved: "Зачувано", plan: "Додај во планер" },
    groceries: { title: "Список за намирници", intro: "Еден список од планот и рачно додадените ставки.", add: "Додај ставка", generate: "Додај состојки за следните две недели", empty: "Списокот е празен. Додајте ставка или создајте го од планирани рецепти." },
    common: { breakfast: "Појадок", lunch: "Ручек", dinner: "Вечера", snack: "Ужина", delete: "Отстрани", save: "Зачувај", grams: "грама", amount: "Количина", date: "Датум", servings: "Порции", name: "Име", quantity: "Количина", unit: "Единица", category: "Категорија" },
  },
} as const;
export function getNutritionContent(locale: Locale) { return content[locale]; }
