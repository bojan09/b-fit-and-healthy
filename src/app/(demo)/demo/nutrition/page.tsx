import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
import { DemoMealTracker } from "@/features/demo/demo-meal-tracker";
import { demoMeals, demoAddableMeal } from "@/features/demo/data";

export const metadata = publicMetadata(
  "Try the demo — Nutrition",
  "See how meal and macro tracking works in B Fit & Healthy.",
  "/demo/nutrition"
);

export default async function DemoNutritionPage() {
  const locale = await getLocale();
  const c = getPublicContent(locale).demo;
  const home = getPublicContent(locale).home;

  return (
    <div className="demo-page">
      <header className="page-header">
        <p className="eyebrow">{c.nav.nutrition}</p>
        <h1>{c.nutrition.title}</h1>
        <p>{c.nutrition.subtitle}</p>
      </header>
      <DemoMealTracker
        meals={demoMeals}
        addableMeal={demoAddableMeal}
        locale={locale}
        labels={{
          addFood: c.nutrition.addFood,
          total: c.nutrition.total,
          protein: home.proteinLabel,
          carbs: home.carbsLabel,
          fat: home.fatLabel,
          kcal: home.caloriesUnit
        }}
      />
    </div>
  );
}
