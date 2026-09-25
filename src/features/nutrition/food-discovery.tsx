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
import { useOptionalLocale } from "@/components/providers/locale-provider";

const copy = {
  en: { search: "Search foods", placeholder: "Oats, lentils, yoghurt…", per100: "100 g", serving: "serving", scan: "Scan or enter barcode", barcode: "Barcode", digits: "Enter 6–18 digits", lookUp: "Look up", looking: "Looking up…", invalid: "Enter a barcode of 6–18 digits.", notFound: "No food found for that barcode.", failed: "Barcode lookup failed. Check your connection and try again.", cancel: "Cancel", adding: "Adding…", add: "Add to day", energy: "Energy", protein: "Protein", carbs: "Carbohydrate", fat: "Fat", unavailable: "Unavailable", incomplete: "This source does not provide complete nutrition, so logging is disabled.", meal: "Meal", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", amount: "Amount (g)" },
  mk: { search: "Пребарај храна", placeholder: "Овес, леќа, јогурт…", per100: "100 g", serving: "порција", scan: "Скенирај или внеси баркод", barcode: "Баркод", digits: "Внеси 6–18 цифри", lookUp: "Пронајди", looking: "Се бара…", invalid: "Внесете баркод од 6–18 цифри.", notFound: "Нема храна за тој баркод.", failed: "Пребарувањето на баркодот не успеа. Проверете ја врската и обидете се пак.", cancel: "Откажи", adding: "Се додава…", add: "Додај во денот", energy: "Енергија", protein: "Протеини", carbs: "Јаглехидрати", fat: "Масти", unavailable: "Недостапно", incomplete: "Овој извор нема целосни нутритивни податоци, па евидентирањето е оневозможено.", meal: "Оброк", breakfast: "Појадок", lunch: "Ручек", dinner: "Вечера", snack: "Ужина", amount: "Количина (g)" },
} as const;

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
  const t = copy[useOptionalLocale()];
  const [barcodeMessage, setBarcodeMessage] = useState<string | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
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
    if (!/^\d{6,18}$/.test(barcode)) {
      setBarcodeMessage(t.invalid);
      return;
    }
    setBarcodeMessage(null);
    setLookingUp(true);
    try {
      const response = await fetch(
        `/api/discovery/foods?barcode=${encodeURIComponent(barcode)}`,
      );
      if (!response.ok) throw new Error(String(response.status));
      const body = (await response.json()) as { results?: DiscoveryFood[] };
      if (body.results?.[0]) setSelected(body.results[0]);
      else setBarcodeMessage(t.notFound);
    } catch {
      setBarcodeMessage(t.failed);
    } finally {
      setLookingUp(false);
    }
  }

  return (
    <div className="food-discovery">
      <label className="discovery-search-field">
        <Search aria-hidden="true" />
        <span className="sr-only">{t.search}</span>
        <input
          type="search"
          value={search.query}
          onChange={(event) => search.setQuery(event.target.value)}
          placeholder={t.placeholder}
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
              <small>kcal / {food.nutrientBasis === "per-100-g" ? t.per100 : t.serving}</small>
            </span>
            <Plus aria-hidden="true" />
          </button>
        ))}
      </div>
      <details className="barcode-disclosure">
        <summary><Barcode aria-hidden="true" /> {t.scan}</summary>
        <form onSubmit={barcodeSearch}>
          <label>
            <span className="sr-only">{t.barcode}</span>
            <input
              inputMode="numeric"
              pattern="[0-9]{6,18}"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              placeholder={t.digits}
            />
          </label>
          <button className="ui-button ui-button-secondary" type="submit" disabled={lookingUp}>{lookingUp ? t.looking : t.lookUp}</button>
        </form>
        {barcodeMessage ? <p className="inline-notice warning" role="status">{barcodeMessage}</p> : null}
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
            <button className="ui-button ui-button-secondary" type="button" onClick={() => setSelected(null)}>{t.cancel}</button>
            <button className="ui-button ui-button-primary" form="food-review-form" disabled={pending || !complete}>
              {pending ? t.adding : t.add}
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
              <div><dt>{t.energy}</dt><dd>{selected.energyKcal ?? t.unavailable} kcal</dd></div>
              <div><dt>{t.protein}</dt><dd>{selected.proteinG ?? t.unavailable} g</dd></div>
              <div><dt>{t.carbs}</dt><dd>{selected.carbohydrateG ?? t.unavailable} g</dd></div>
              <div><dt>{t.fat}</dt><dd>{selected.fatG ?? t.unavailable} g</dd></div>
            </dl>
            {!complete ? <p className="inline-notice warning">{t.incomplete}</p> : null}
            <div className="discovery-review-fields">
              <label>{t.meal}<select name="mealSlot" defaultValue="breakfast"><option value="breakfast">{t.breakfast}</option><option value="lunch">{t.lunch}</option><option value="dinner">{t.dinner}</option><option value="snack">{t.snack}</option></select></label>
              <label>{t.amount}<input name="amountGrams" type="number" min="1" max="5000" defaultValue={Math.round(selected.servingAmount || 100)} /></label>
            </div>
          </form>
        ) : null}
      </ReviewSheet>
    </div>
  );
}
