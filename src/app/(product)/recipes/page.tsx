import Link from "next/link";
import { recipes } from "@/features/nutrition/catalogue";
import { getNutritionContent } from "@/features/nutrition/content";
import { RecipeLibrary } from "@/features/nutrition/recipe-library";
import { getLocale } from "@/lib/i18n/server";

export default async function RecipesPage() {
  const locale = await getLocale();
  const c = getNutritionContent(locale);
  return (
    <main className="product-page recipe-page">
      <header className="product-page-heading recipe-heading">
        <div>
          <p className="eyebrow">{locale === "mk" ? "Готвење со јасност" : "Cook with clarity"}</p>
          <h1>{c.recipes.title}</h1>
          <p>{c.recipes.intro}</p>
        </div>
        <Link href="/meal-planner" className="ui-button ui-button-secondary">{locale === "mk" ? "Отвори планер за оброци" : "Open meal planner"}</Link>
      </header>
      <RecipeLibrary recipes={recipes} locale={locale} />
    </main>
  );
}
