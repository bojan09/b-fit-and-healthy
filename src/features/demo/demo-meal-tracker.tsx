"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import type { DemoMeal } from "@/features/demo/data";

type Labels = { addFood: string; total: string; protein: string; carbs: string; fat: string; kcal: string };

// Reference maxima express each bar as "progress toward a typical daily amount," not raw
// proportion-of-each-other (which would always sum to 100% regardless of total intake).
const REFERENCE_MAX_G = { protein: 150, carbs: 300, fat: 90 } as const;

function fillPercent(grams: number, referenceMax: number) {
  return Math.min(100, Math.round((grams / referenceMax) * 100));
}

function fillStyle(colorVar: string, percent: number) {
  return { background: `linear-gradient(90deg, var(${colorVar}) 0 ${percent}%, var(--surface-hover) ${percent}%)` };
}

export function DemoMealTracker({
  meals,
  addableMeal,
  locale,
  labels
}: {
  meals: DemoMeal[];
  addableMeal: DemoMeal;
  locale: Locale;
  labels: Labels;
}) {
  const [list, setList] = useState(meals);
  const [added, setAdded] = useState(false);
  const totals = list.reduce(
    (sum, meal) => ({
      kcal: sum.kcal + meal.kcal,
      proteinG: sum.proteinG + meal.proteinG,
      carbsG: sum.carbsG + meal.carbsG,
      fatG: sum.fatG + meal.fatG
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );

  return (
    <div className="demo-nutrition">
      <p className="demo-nutrition-total">{labels.total}</p>
      <div className="nutrition-stat">
        <strong>{totals.kcal}</strong>
        <span>{labels.kcal}</span>
      </div>
      <div className="nutrient-lines">
        <div className="nutrient-line">
          <span>{labels.protein}</span>
          <i style={fillStyle("--brand", fillPercent(totals.proteinG, REFERENCE_MAX_G.protein))} />
          <b>{totals.proteinG}g</b>
        </div>
        <div className="nutrient-line">
          <span>{labels.carbs}</span>
          <i style={fillStyle("--mineral", fillPercent(totals.carbsG, REFERENCE_MAX_G.carbs))} />
          <b>{totals.carbsG}g</b>
        </div>
        <div className="nutrient-line">
          <span>{labels.fat}</span>
          <i style={fillStyle("--ochre", fillPercent(totals.fatG, REFERENCE_MAX_G.fat))} />
          <b>{totals.fatG}g</b>
        </div>
      </div>
      <ul className="demo-meal-list">
        {list.map((meal) => (
          <li key={meal.id}>
            <span>{meal.time}</span>
            <strong>{meal.name[locale]}</strong>
            <b>{meal.kcal} {labels.kcal}</b>
          </li>
        ))}
      </ul>
      {!added && (
        <Button
          variant="secondary"
          onClick={() => {
            setList((current) => [...current, addableMeal]);
            setAdded(true);
          }}
        >
          <Plus aria-hidden="true" />
          {labels.addFood}
        </Button>
      )}
    </div>
  );
}
