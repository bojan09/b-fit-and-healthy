"use client";

import Link from "next/link";
import { ArrowRight, Clock, Search, SlidersHorizontal } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { discoverRecipes } from "./recipe-discovery";
import type { Recipe, RecipeDietary, RecipeMeal } from "./recipe-types";
import type { Locale } from "@/lib/i18n/config";
import type { DiscoveryRecipe } from "@/features/discovery/types";
import { useDiscoverySearch } from "@/features/discovery/use-discovery-search";
import { DiscoveryStatus } from "@/components/discovery/discovery-status";
import { ReviewSheet } from "@/components/discovery/review-sheet";
import { importDiscoveryItemAction } from "@/features/discovery/actions";
import { ActionFeedback } from "@/features/motion/action-feedback";
import type { AuthActionState } from "@/features/auth/types";

const noExternalRecipes: DiscoveryRecipe[] = [];
const initial: AuthActionState = { status: "idle" };

const mealValues: Array<RecipeMeal | "all"> = ["all", "breakfast", "lunch", "dinner", "snack"];
const dietaryValues: Array<RecipeDietary | "all"> = ["all", "plant-forward", "vegetarian", "high-protein"];

const copy = {
  en: {
    meals: { all: "All meals", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snacks" },
    dietary: { all: "Any style", "plant-forward": "Plant-forward", vegetarian: "Vegetarian", "high-protein": "High protein" } as Record<string, string>,
    search: "Search recipes", placeholder: "Search by recipe, ingredient or goal", meal: "Meal", style: "Eating style", time: "Time", m15: "15 minutes", m30: "30 minutes", m45: "45 minutes", m60: "Up to 1 hour", eyebrow: "Practical ideas", recipes: "recipes", perServing: "Nutrition is shown per serving. Adjust portions to your own needs.", min: "min", protein: "protein", curated: "Locally curated", inspiration: "Provider inspiration", estimated: "Estimated nutrition", noMatch: "No matching recipes", noMatchBody: "Try a different ingredient, meal, or time range.", clear: "Clear filters", moreEyebrow: "More from connected sources", liveMatches: "live matches", reviewNote: "Open a result to review its source, ingredients, and available nutrition before saving.", idea: "Recipe idea", nutritionUnavailable: "Nutrition unavailable", cancel: "Cancel", saving: "Saving…", save: "Save recipe", category: "Category", cuisine: "Cuisine", servings: "Servings", nutrition: "Nutrition", notSupplied: "Not supplied", toTaste: "Adjust to taste", available: "Available", unavailable: "Unavailable", ingredients: "Ingredients", method: "Method",
  },
  mk: {
    meals: { all: "Сите оброци", breakfast: "Појадок", lunch: "Ручек", dinner: "Вечера", snack: "Ужини" },
    dietary: { all: "Секој стил", "plant-forward": "Претежно растително", vegetarian: "Вегетаријанско", "high-protein": "Богато со протеини" } as Record<string, string>,
    search: "Пребарај рецепти", placeholder: "Пребарај по рецепт, состојка или цел", meal: "Оброк", style: "Стил на исхрана", time: "Време", m15: "15 минути", m30: "30 минути", m45: "45 минути", m60: "До 1 час", eyebrow: "Практични идеи", recipes: "рецепти", perServing: "Нутритивните вредности се по порција. Прилагодете ги порциите на вашите потреби.", min: "мин", protein: "протеини", curated: "Локално курирано", inspiration: "Инспирација од извор", estimated: "Проценети вредности", noMatch: "Нема соодветни рецепти", noMatchBody: "Пробајте друга состојка, оброк или време.", clear: "Исчисти филтри", moreEyebrow: "Повеќе од поврзани извори", liveMatches: "резултати во живо", reviewNote: "Отворете резултат за да ги прегледате изворот, состојките и нутритивните податоци пред зачувување.", idea: "Идеја за рецепт", nutritionUnavailable: "Нема нутритивни податоци", cancel: "Откажи", saving: "Се зачувува…", save: "Зачувај рецепт", category: "Категорија", cuisine: "Кујна", servings: "Порции", nutrition: "Нутритивни вредности", notSupplied: "Не е наведено", toTaste: "По вкус", available: "Достапно", unavailable: "Недостапно", ingredients: "Состојки", method: "Подготовка",
  },
} as const;

export function RecipeLibrary({ recipes, locale }: { recipes: readonly Recipe[]; locale: Locale }) {
  const t = copy[locale];
  const [query, setQuery] = useState("");
  const [meal, setMeal] = useState<RecipeMeal | "all">("all");
  const [dietary, setDietary] = useState<RecipeDietary | "all">("all");
  const [maxMinutes, setMaxMinutes] = useState(60);
  const results = useMemo(
    () => discoverRecipes(recipes, { query, meal, dietary, maxMinutes }),
    [recipes, query, meal, dietary, maxMinutes],
  );
  const providerSearch = useDiscoverySearch<DiscoveryRecipe>({
    endpoint: "/api/discovery/recipes",
    localResults: noExternalRecipes,
  });
  const [selected, setSelected] = useState<DiscoveryRecipe | null>(null);
  const [saveState, saveAction, saving] = useActionState(
    importDiscoveryItemAction,
    initial,
  );
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  const providerResults = providerSearch.results.filter(
    (recipe) => recipe.provider !== "local",
  );

  function updateQuery(value: string) {
    setQuery(value);
    providerSearch.setQuery(value);
  }

  return (
    <section className="recipe-library" aria-labelledby="recipe-library-title">
      <div className="recipe-discovery">
        <div className="recipe-search">
          <Search aria-hidden="true" />
          <label className="sr-only" htmlFor="recipe-query">{t.search}</label>
          <input
            id="recipe-query"
            type="search"
            placeholder={t.placeholder}
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
          />
        </div>
        <fieldset className="recipe-meal-filter">
          <legend className="sr-only">{t.meal}</legend>
          {mealValues.map((value) => (
            <button
              aria-pressed={meal === value}
              className={meal === value ? "is-active" : ""}
              key={value}
              onClick={() => setMeal(value)}
              type="button"
            >
              {t.meals[value]}
            </button>
          ))}
        </fieldset>
        <div className="recipe-refinements">
          <SlidersHorizontal aria-hidden="true" />
          <label>
            <span>{t.style}</span>
            <select value={dietary} onChange={(event) => setDietary(event.target.value as RecipeDietary | "all")}>
              {dietaryValues.map((value) => <option key={value} value={value}>{t.dietary[value]}</option>)}
            </select>
          </label>
          <label>
            <span>{t.time}</span>
            <select value={maxMinutes} onChange={(event) => setMaxMinutes(Number(event.target.value))}>
              <option value="15">{t.m15}</option>
              <option value="30">{t.m30}</option>
              <option value="45">{t.m45}</option>
              <option value="60">{t.m60}</option>
            </select>
          </label>
        </div>
      </div>
      <DiscoveryStatus status={providerSearch.status} message={providerSearch.message} />

      <div className="recipe-results-heading">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="recipe-library-title">{results.length} {t.recipes}</h2>
        </div>
        <p>{t.perServing}</p>
      </div>

      {results.length ? (
        <div className="recipe-grid">
          {results.map((recipe) => (
            <Link href={`/recipes/${recipe.slug}`} className={`recipe-card recipe-meal-${recipe.meal}`} key={recipe.slug}>
              <div className="recipe-card-topline">
                <span>{t.meals[recipe.meal]}</span>
                <span><Clock aria-hidden="true" />{recipe.totalMinutes} {t.min}</span>
              </div>
              <div className="recipe-card-body">
                <h3>{recipe.title[locale]}</h3>
                <p>{recipe.summary[locale]}</p>
                <div className="recipe-tags">
                  {recipe.dietary.slice(0, 2).map((tag) => <span key={tag}>{t.dietary[tag] ?? tag.replaceAll("-", " ")}</span>)}
                </div>
              </div>
              <div className="recipe-card-meta">
                <span><strong>{recipe.nutrition.proteinG} g</strong> {t.protein}</span>
                <span><strong>{recipe.nutrition.energyKcal}</strong> kcal</span>
                <ArrowRight aria-hidden="true" />
              </div>
              <div className="recipe-card-trust">
                <span>{recipe.provenance === "verified-local" ? t.curated : t.inspiration}</span>
                <span>{t.estimated}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state recipe-empty">
          <Search aria-hidden="true" />
          <h3>{t.noMatch}</h3>
          <p>{t.noMatchBody}</p>
          <button className="ui-button ui-button-secondary" type="button" onClick={() => {
            updateQuery("");
            setMeal("all");
            setDietary("all");
            setMaxMinutes(60);
          }}>{t.clear}</button>
        </div>
      )}

      {providerResults.length ? (
        <section className="provider-discovery-results" aria-labelledby="provider-recipes-title">
          <div className="recipe-results-heading">
            <div>
              <p className="eyebrow">{t.moreEyebrow}</p>
              <h2 id="provider-recipes-title">{providerResults.length} {t.liveMatches}</h2>
            </div>
            <p>{t.reviewNote}</p>
          </div>
          <div className="provider-card-grid">
            {providerResults.map((recipe) => (
              <button
                className="provider-card"
                type="button"
                key={recipe.id}
                onClick={(event) => {
                  setReturnFocus(event.currentTarget);
                  setSelected(recipe);
                }}
              >
                <span className="provider-card-kicker">{recipe.attribution}</span>
                <strong>{recipe.title}</strong>
                <span>{[recipe.cuisine, recipe.category].filter(Boolean).join(" · ") || t.idea}</span>
                <small>{recipe.nutrition ? `${recipe.nutrition.energyKcal ?? "—"} kcal` : t.nutritionUnavailable}</small>
              </button>
            ))}
          </div>
        </section>
      ) : null}
      {saveState.message ? <ActionFeedback className="form-status" status={saveState.status} message={saveState.message} /> : null}
      <ReviewSheet
        open={Boolean(selected)}
        title={selected?.title ?? ""}
        onClose={() => setSelected(null)}
        returnFocus={returnFocus}
        footer={selected ? (
          <>
            <button className="ui-button ui-button-secondary" type="button" onClick={() => setSelected(null)}>{t.cancel}</button>
            <button className="ui-button ui-button-primary" form="recipe-review-form" disabled={saving}>
              {saving ? t.saving : t.save}
            </button>
          </>
        ) : null}
      >
        {selected ? (
          <form id="recipe-review-form" action={saveAction} className="discovery-review-form">
            <input type="hidden" name="item" value={JSON.stringify(selected)} />
            <p className="discovery-source">{selected.attribution} · {selected.quality}</p>
            <dl className="discovery-facts">
              <div><dt>{t.category}</dt><dd>{selected.category ?? t.notSupplied}</dd></div>
              <div><dt>{t.cuisine}</dt><dd>{selected.cuisine ?? t.notSupplied}</dd></div>
              <div><dt>{t.servings}</dt><dd>{selected.servings ?? t.toTaste}</dd></div>
              <div><dt>{t.nutrition}</dt><dd>{selected.nutrition ? t.available : t.unavailable}</dd></div>
            </dl>
            <section className="discovery-review-section">
              <h3>{t.ingredients}</h3>
              <ul>{selected.ingredients.map((ingredient, index) => <li key={`${ingredient.name}-${index}`}>{ingredient.measure} {ingredient.name}</li>)}</ul>
            </section>
            <section className="discovery-review-section">
              <h3>{t.method}</h3>
              <ol>{selected.instructions.map((step, index) => <li key={index}>{step}</li>)}</ol>
            </section>
          </form>
        ) : null}
      </ReviewSheet>
    </section>
  );
}
