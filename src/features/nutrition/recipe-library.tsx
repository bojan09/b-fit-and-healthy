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

const meals: Array<{ value: RecipeMeal | "all"; label: string }> = [
  { value: "all", label: "All meals" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snacks" },
];

const dietaryOptions: Array<{ value: RecipeDietary | "all"; label: string }> = [
  { value: "all", label: "Any style" },
  { value: "plant-forward", label: "Plant-forward" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "high-protein", label: "High protein" },
];

export function RecipeLibrary({ recipes, locale }: { recipes: readonly Recipe[]; locale: Locale }) {
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
          <label className="sr-only" htmlFor="recipe-query">Search recipes</label>
          <input
            id="recipe-query"
            type="search"
            placeholder="Search by recipe, ingredient or goal"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
          />
        </div>
        <fieldset className="recipe-meal-filter">
          <legend className="sr-only">Meal</legend>
          {meals.map((option) => (
            <button
              aria-pressed={meal === option.value}
              className={meal === option.value ? "is-active" : ""}
              key={option.value}
              onClick={() => setMeal(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </fieldset>
        <div className="recipe-refinements">
          <SlidersHorizontal aria-hidden="true" />
          <label>
            <span>Eating style</span>
            <select value={dietary} onChange={(event) => setDietary(event.target.value as RecipeDietary | "all")}>
              {dietaryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label>
            <span>Time</span>
            <select value={maxMinutes} onChange={(event) => setMaxMinutes(Number(event.target.value))}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">Up to 1 hour</option>
            </select>
          </label>
        </div>
      </div>
      <DiscoveryStatus status={providerSearch.status} message={providerSearch.message} />

      <div className="recipe-results-heading">
        <div>
          <p className="eyebrow">Practical ideas</p>
          <h2 id="recipe-library-title">{results.length} recipes</h2>
        </div>
        <p>Nutrition is shown per serving. Adjust portions to your own needs.</p>
      </div>

      {results.length ? (
        <div className="recipe-grid">
          {results.map((recipe) => (
            <Link href={`/recipes/${recipe.slug}`} className={`recipe-card recipe-meal-${recipe.meal}`} key={recipe.slug}>
              <div className="recipe-card-topline">
                <span>{recipe.meal}</span>
                <span><Clock aria-hidden="true" />{recipe.totalMinutes} min</span>
              </div>
              <div className="recipe-card-body">
                <h3>{recipe.title[locale]}</h3>
                <p>{recipe.summary[locale]}</p>
                <div className="recipe-tags">
                  {recipe.dietary.slice(0, 2).map((tag) => <span key={tag}>{tag.replace("-", " ")}</span>)}
                </div>
              </div>
              <div className="recipe-card-meta">
                <span><strong>{recipe.nutrition.proteinG} g</strong> protein</span>
                <span><strong>{recipe.nutrition.energyKcal}</strong> kcal</span>
                <ArrowRight aria-hidden="true" />
              </div>
              <div className="recipe-card-trust">
                <span>{recipe.provenance === "verified-local" ? "Locally curated" : "Provider inspiration"}</span>
                <span>Estimated nutrition</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state recipe-empty">
          <Search aria-hidden="true" />
          <h3>No matching recipes</h3>
          <p>Try a different ingredient, meal, or time range.</p>
          <button className="button button-secondary" type="button" onClick={() => {
            updateQuery("");
            setMeal("all");
            setDietary("all");
            setMaxMinutes(60);
          }}>Clear filters</button>
        </div>
      )}

      {providerResults.length ? (
        <section className="provider-discovery-results" aria-labelledby="provider-recipes-title">
          <div className="recipe-results-heading">
            <div>
              <p className="eyebrow">More from connected sources</p>
              <h2 id="provider-recipes-title">{providerResults.length} live matches</h2>
            </div>
            <p>Open a result to review its source, ingredients, and available nutrition before saving.</p>
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
                <span>{[recipe.cuisine, recipe.category].filter(Boolean).join(" · ") || "Recipe idea"}</span>
                <small>{recipe.nutrition ? `${recipe.nutrition.energyKcal ?? "—"} kcal` : "Nutrition unavailable"}</small>
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
            <button className="ui-button ui-button-secondary" type="button" onClick={() => setSelected(null)}>Cancel</button>
            <button className="ui-button ui-button-primary" form="recipe-review-form" disabled={saving}>
              {saving ? "Saving…" : "Save recipe"}
            </button>
          </>
        ) : null}
      >
        {selected ? (
          <form id="recipe-review-form" action={saveAction} className="discovery-review-form">
            <input type="hidden" name="item" value={JSON.stringify(selected)} />
            <p className="discovery-source">{selected.attribution} · {selected.quality}</p>
            <dl className="discovery-facts">
              <div><dt>Category</dt><dd>{selected.category ?? "Not supplied"}</dd></div>
              <div><dt>Cuisine</dt><dd>{selected.cuisine ?? "Not supplied"}</dd></div>
              <div><dt>Servings</dt><dd>{selected.servings ?? "Adjust to taste"}</dd></div>
              <div><dt>Nutrition</dt><dd>{selected.nutrition ? "Available" : "Unavailable"}</dd></div>
            </dl>
            <section className="discovery-review-section">
              <h3>Ingredients</h3>
              <ul>{selected.ingredients.map((ingredient, index) => <li key={`${ingredient.name}-${index}`}>{ingredient.measure} {ingredient.name}</li>)}</ul>
            </section>
            <section className="discovery-review-section">
              <h3>Method</h3>
              <ol>{selected.instructions.map((step, index) => <li key={index}>{step}</li>)}</ol>
            </section>
          </form>
        ) : null}
      </ReviewSheet>
    </section>
  );
}
