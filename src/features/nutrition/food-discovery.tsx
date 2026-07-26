"use client";

import { useActionState, useMemo, useState } from "react";
import { Barcode, Plus, Search } from "lucide-react";
import { ActionFeedback } from "@/features/motion/action-feedback";
import { DiscoveryStatus } from "@/components/discovery/discovery-status";
import { ReviewSheet } from "@/components/discovery/review-sheet";
import { useDiscoverySearch } from "@/features/discovery/use-discovery-search";
import {
  normalizeDiscoveryTitle,
  type DiscoveryFood,
} from "@/features/discovery/types";
import { logDiscoveryFoodAction } from "@/features/nutrition/actions";
import type { AuthActionState } from "@/features/auth/types";

const initial: AuthActionState = { status: "idle" };

type SavedFood = {
  id: string;
  name: string;
  brand: string | null;
  servingGrams: number;
  energyKcal: number;
  proteinG: number;
  carbohydrateG: number;
  fatG: number;
  fibreG: number;
};

function normalizeSavedFood(food: SavedFood): DiscoveryFood {
  return {
    id: `local:${food.id}`,
    kind: "food",
    provider: "local",
    externalId: food.id,
    title: food.name,
    normalizedTitle: normalizeDiscoveryTitle(food.name),
    sourceUrl: null,
    attribution: "Your saved food",
    retrievedAt: new Date().toISOString(),
    quality: "curated",
    completeness: ["nutrition"],
    alternates: [],
    brand: food.brand,
    servingAmount: food.servingGrams || 100,
    servingUnit: "g",
    energyKcal: food.energyKcal,
    proteinG: food.proteinG,
    carbohydrateG: food.carbohydrateG,
    fatG: food.fatG,
    fibreG: food.fibreG,
    barcode: null,
    nutrientBasis: "per-100-g",
  };
}

export function FoodDiscovery({
  date,
  savedFoods,
}: {
  date: string;
  savedFoods: SavedFood[];
}) {
  const local = useMemo(() => savedFoods.map(normalizeSavedFood), [savedFoods]);
  const search = useDiscoverySearch<DiscoveryFood>({
    endpoint: "/api/discovery/foods",
    localResults: local,
  });
  const [selected, setSelected] = useState<DiscoveryFood | null>(null);
  const [barcode, setBarcode] = useState("");
  const [state, action, pending] = useActionState(logDiscoveryFoodAction, initial);
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  const complete = selected
    ? [
        selected.energyKcal,
        selected.proteinG,
        selected.carbohydrateG,
        selected.fatG,
        selected.fibreG,
      ].every((value) => value !== null)
    : false;

  async function barcodeSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!/^\d{6,18}$/.test(barcode)) return;
    const response = await fetch(
      `/api/discovery/foods?barcode=${encodeURIComponent(barcode)}`,
    );
    const body = (await response.json()) as { results?: DiscoveryFood[] };
    if (body.results?.[0]) setSelected(body.results[0]);
  }

  return (
    <div className="food-discovery">
      <label className="discovery-search-field">
        <Search aria-hidden="true" />
        <span className="sr-only">Search foods</span>
        <input
          type="search"
          value={search.query}
          onChange={(event) => search.setQuery(event.target.value)}
          placeholder="Oats, lentils, yoghurt…"
        />
      </label>
      <DiscoveryStatus status={search.status} message={search.message} />
      <div className="discovery-result-list">
        {search.results.slice(0, 12).map((food) => (
          <button
            className="discovery-result-row"
            type="button"
            key={food.id}
            onClick={(event) => {
              setReturnFocus(event.currentTarget);
              setSelected(food);
            }}
          >
            <span>
              <strong>{food.title}</strong>
              <small>{food.brand ?? food.attribution}</small>
            </span>
            <span>
              <b>{food.energyKcal === null ? "—" : Math.round(food.energyKcal)}</b>
              <small>kcal / {food.nutrientBasis === "per-100-g" ? "100 g" : "serving"}</small>
            </span>
            <Plus aria-hidden="true" />
          </button>
        ))}
      </div>
      <details className="barcode-disclosure">
        <summary><Barcode aria-hidden="true" /> Scan or enter barcode</summary>
        <form onSubmit={barcodeSearch}>
          <label>
            <span className="sr-only">Barcode</span>
            <input
              inputMode="numeric"
              pattern="[0-9]{6,18}"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              placeholder="Enter 6–18 digits"
            />
          </label>
          <button className="ui-button ui-button-secondary" type="submit">Look up</button>
        </form>
      </details>
      {state.message ? (
        <ActionFeedback className="form-status" status={state.status} message={state.message} />
      ) : null}
      <ReviewSheet
        open={Boolean(selected)}
        title={selected?.title ?? ""}
        onClose={() => setSelected(null)}
        returnFocus={returnFocus}
        footer={selected ? (
          <>
            <button className="ui-button ui-button-secondary" type="button" onClick={() => setSelected(null)}>Cancel</button>
            <button className="ui-button ui-button-primary" form="food-review-form" disabled={pending || !complete}>
              {pending ? "Adding…" : "Add to day"}
            </button>
          </>
        ) : null}
      >
        {selected ? (
          <form id="food-review-form" action={action} className="discovery-review-form">
            <input type="hidden" name="item" value={JSON.stringify(selected)} />
            <input type="hidden" name="loggedOn" value={date} />
            <p className="discovery-source">{selected.attribution} · {selected.quality}</p>
            <dl className="discovery-facts">
              <div><dt>Energy</dt><dd>{selected.energyKcal ?? "Unavailable"} kcal</dd></div>
              <div><dt>Protein</dt><dd>{selected.proteinG ?? "Unavailable"} g</dd></div>
              <div><dt>Carbohydrate</dt><dd>{selected.carbohydrateG ?? "Unavailable"} g</dd></div>
              <div><dt>Fat</dt><dd>{selected.fatG ?? "Unavailable"} g</dd></div>
            </dl>
            {!complete ? <p className="inline-notice warning">This source does not provide complete nutrition, so logging is disabled.</p> : null}
            <div className="discovery-review-fields">
              <label>Meal<select name="mealSlot" defaultValue="breakfast"><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="snack">Snack</option></select></label>
              <label>Amount (g)<input name="amountGrams" type="number" min="1" max="5000" defaultValue={Math.round(selected.servingAmount || 100)} /></label>
            </div>
          </form>
        ) : null}
      </ReviewSheet>
    </div>
  );
}
