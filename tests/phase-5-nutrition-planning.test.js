const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

describe("Phase 5 nutrition and planning", () => {
  it("provides every protected nutrition workflow", () => {
    for (const route of ["nutrition", "recipes", "meal-planner", "grocery-list"]) {
      assert.ok(fs.existsSync(path.join(root, `src/app/(product)/${route}/page.tsx`)), route);
    }
    assert.ok(fs.existsSync(path.join(root, "src/app/(product)/recipes/[slug]/page.tsx")));
  });

  it("defines private nutrition storage with RLS", () => {
    const sql = read("supabase/migrations/202607190004_nutrition_planning.sql");
    for (const table of ["foods", "food_favourites", "meal_entries", "recipes", "recipe_ingredients", "recipe_steps", "saved_recipes", "meal_plan_items", "grocery_items"]) {
      assert.match(sql, new RegExp(`create table public\\.${table}`));
      assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`));
    }
    assert.match(sql, /auth\.uid\(\) = user_id/);
    assert.doesNotMatch(sql, /service_role/i);
  });

  it("keeps USDA credentials server-only and attributes the source", () => {
    const adapter = read("src/features/nutrition/usda.ts");
    const api = read("src/app/api/foods/search/route.ts");
    assert.match(adapter, /USDA_FDC_API_KEY/);
    assert.match(adapter, /api\.nal\.usda\.gov\/fdc\/v1\/foods\/search/);
    assert.match(api, /FoodData Central/);
    assert.doesNotMatch(`${adapter}${api}`, /NEXT_PUBLIC_USDA/);
  });

  it("integrates nutrition destinations into product navigation", () => {
    const nav = read("src/components/shell/product-navigation.tsx");
    for (const href of ["/nutrition", "/meal-planner", "/recipes", "/grocery-list"]) assert.match(nav, new RegExp(href));
  });
});
