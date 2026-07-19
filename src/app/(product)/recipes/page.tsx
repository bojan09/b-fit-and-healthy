import Link from "next/link";
import { ArrowRight, Clock, Leaf } from "lucide-react";
import { recipes } from "@/features/nutrition/catalogue";
import { getNutritionContent } from "@/features/nutrition/content";
import { getLocale } from "@/lib/i18n/server";

export default async function RecipesPage() { const locale = await getLocale(); const c = getNutritionContent(locale); return <main className="product-page"><header className="product-page-heading recipe-heading"><div><p className="eyebrow">Cook with clarity</p><h1>{c.recipes.title}</h1><p>{c.recipes.intro}</p></div><Link href="/meal-planner" className="button button-secondary">Open meal planner</Link></header><div className="recipe-grid">{recipes.map((recipe, index) => <Link href={`/recipes/${recipe.slug}`} className={`recipe-card recipe-tone-${index + 1}`} key={recipe.slug}><div className="recipe-card-art" aria-hidden="true"><Leaf /><span>{recipe.tags[0]}</span></div><div className="recipe-card-body"><div className="recipe-tags">{recipe.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><h2>{recipe.title[locale]}</h2><p>{recipe.summary[locale]}</p><div className="recipe-card-meta"><span><Clock />{recipe.prepMinutes + recipe.cookMinutes} min</span><span>{recipe.nutrition.proteinG} g protein</span><ArrowRight /></div></div></Link>)}</div></main>; }
