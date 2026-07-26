import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, CalendarPlus, ChevronLeft, Clock } from "lucide-react";
import { toggleSavedRecipeAction } from "@/features/nutrition/actions";
import { recipes } from "@/features/nutrition/catalogue";
import { getNutritionContent } from "@/features/nutrition/content";
import { loadSavedRecipeIds } from "@/features/nutrition/repository";
import { requireUser } from "@/features/auth/session";
import { getLocale } from "@/lib/i18n/server";

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = recipes.find((item) => item.slug === slug);
  if (!recipe) notFound();

  const user = await requireUser();
  const locale = await getLocale();
  const c = getNutritionContent(locale);
  const saved = recipe.databaseReady && (await loadSavedRecipeIds(user.id)).has(recipe.id);

  return (
    <main className="product-page recipe-detail">
      <Link href="/recipes" className="back-link"><ChevronLeft />{c.recipes.title}</Link>
      <header className="recipe-hero">
        <div>
          <div className="recipe-tags">{recipe.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <h1>{recipe.title[locale]}</h1>
          <p>{recipe.summary[locale]}</p>
          <div className="recipe-time"><Clock />{recipe.prepMinutes} min prep · {recipe.cookMinutes} min cooking · {recipe.servings} servings</div>
          <div className="recipe-actions">
            {recipe.databaseReady && (
              <form action={toggleSavedRecipeAction}>
                <input type="hidden" name="recipeId" value={recipe.id} />
                <input type="hidden" name="saved" value={String(saved)} />
                <button className="button button-secondary"><Bookmark />{saved ? c.recipes.saved : c.recipes.save}</button>
              </form>
            )}
            <Link className="button button-primary" href={`/meal-planner?recipe=${recipe.slug}`}>
              <CalendarPlus />{c.recipes.plan}
            </Link>
          </div>
        </div>
        <div className="recipe-nutrition-card">
          <span>{c.recipes.nutrition} · estimated</span>
          <strong>{recipe.nutrition.energyKcal} kcal</strong>
          <dl>
            <div><dt>{c.nutrition.protein}</dt><dd>{recipe.nutrition.proteinG} g</dd></div>
            <div><dt>{c.nutrition.carbs}</dt><dd>{recipe.nutrition.carbohydrateG} g</dd></div>
            <div><dt>{c.nutrition.fat}</dt><dd>{recipe.nutrition.fatG} g</dd></div>
            <div><dt>{c.nutrition.fibre}</dt><dd>{recipe.nutrition.fibreG} g</dd></div>
          </dl>
        </div>
      </header>
      <div className="recipe-reading-layout">
        <section>
          <h2>{c.recipes.ingredients}</h2>
          <ul className="ingredient-list">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.name.en}>
                <span>{ingredient.name[locale]}</span>
                <strong>{ingredient.quantity} {ingredient.unit}</strong>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{c.recipes.method}</h2>
          <ol className="method-list">
            {recipe.steps[locale].map((step, index) => (
              <li key={step}><span>{index + 1}</span><p>{step}</p></li>
            ))}
          </ol>
        </section>
      </div>
      <p className="source-note">Locally curated recipe. Nutrition values are estimates and can vary with brands, portions and preparation.</p>
    </main>
  );
}
