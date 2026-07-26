"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import {
  equipmentOptions,
  exercises,
  muscleOptions,
  type Exercise,
} from "@/features/fitness/catalogue";
import type { DiscoveryExercise } from "@/features/discovery/types";
import { useDiscoverySearch } from "@/features/discovery/use-discovery-search";
import { DiscoveryStatus } from "@/components/discovery/discovery-status";
import { ReviewSheet } from "@/components/discovery/review-sheet";
import { importDiscoveryItemAction } from "@/features/discovery/actions";
import { ActionFeedback } from "@/features/motion/action-feedback";
import type { AuthActionState } from "@/features/auth/types";

const noExternalExercises: DiscoveryExercise[] = [];
const initial: AuthActionState = { status: "idle" };
const providerLabels: Record<DiscoveryExercise["provider"], string> = {
  local: "B Fit & Healthy",
  usda: "USDA",
  "open-food-facts": "Open Food Facts",
  themealdb: "TheMealDB",
  wger: "wger",
  musclewiki: "MuscleWiki",
  "exercise-api": "ExerciseAPI",
  wrkout: "wrkout",
};

export function ExerciseLibrary({ locale }: { locale: "en" | "mk" }) {
  const [query, setQuery] = useState("");
  const [equipment, setEquipment] = useState("");
  const [muscle, setMuscle] = useState("");
  const [type, setType] = useState<Exercise["exerciseType"] | "">("");
  const endpoint = `/api/discovery/exercises${equipment ? `?equipment=${encodeURIComponent(equipment)}` : ""}`;
  const providerSearch = useDiscoverySearch<DiscoveryExercise>({
    endpoint,
    localResults: noExternalExercises,
  });
  const [selected, setSelected] = useState<DiscoveryExercise | null>(null);
  const [saveState, saveAction, saving] = useActionState(
    importDiscoveryItemAction,
    initial,
  );
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  const results = useMemo(
    () =>
      exercises.filter((exercise) => {
        const text =
          `${exercise.titleEn} ${exercise.titleMk} ${exercise.primaryMuscles.join(" ")} ${exercise.movementPattern}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (!equipment || exercise.equipment.includes(equipment)) &&
          (!muscle || exercise.primaryMuscles.includes(muscle)) &&
          (!type || exercise.exerciseType === type)
        );
      }),
    [query, equipment, muscle, type],
  );
  const providerResults = providerSearch.results.filter(
    (exercise) => exercise.provider !== "local",
  );
  const updateQuery = (value: string) => {
    setQuery(value);
    providerSearch.setQuery(value);
  };
  const clear = () => {
    updateQuery("");
    setEquipment("");
    setMuscle("");
    setType("");
  };

  return (
    <div className="fitness-library">
      <div className="fitness-filter">
        <label className="exercise-search">
          <Search aria-hidden="true" />
          <span>{locale === "mk" ? "Пребарај" : "Search"}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder={
              locale === "mk"
                ? "Вежба, мускул или движење"
                : "Exercise, muscle or movement"
            }
          />
        </label>
        <div className="exercise-filter-row">
          <SlidersHorizontal aria-hidden="true" />
          <label>
            <span>{locale === "mk" ? "Опрема" : "Equipment"}</span>
            <select
              aria-label="Equipment"
              value={equipment}
              onChange={(event) => setEquipment(event.target.value)}
            >
              <option value="">{locale === "mk" ? "Сета опрема" : "All equipment"}</option>
              {equipmentOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>Muscle</span>
            <select aria-label="Muscle" value={muscle} onChange={(event) => setMuscle(event.target.value)}>
              <option value="">All muscles</option>
              {muscleOptions.map((item) => <option key={item}>{item.replaceAll("-", " ")}</option>)}
            </select>
          </label>
          <label>
            <span>Type</span>
            <select
              aria-label="Exercise type"
              value={type}
              onChange={(event) => setType(event.target.value as Exercise["exerciseType"] | "")}
            >
              <option value="">All types</option>
              <option value="strength">Strength</option>
              <option value="core">Core</option>
              <option value="mobility">Mobility</option>
            </select>
          </label>
          <button type="button" className="text-action" onClick={clear}>
            {locale === "mk" ? "Исчисти филтри" : "Clear filters"}
          </button>
        </div>
      </div>
      <DiscoveryStatus status={providerSearch.status} message={providerSearch.message} />
      <div className="exercise-results-heading">
        <strong>
          {results.length} local · {providerResults.length} connected{" "}
          {providerResults.length === 1 ? "exercise" : "exercises"}
        </strong>
        <span>Curated guidance with commercially permitted connected sources</span>
      </div>
      {results.length ? (
        <div className="exercise-grid">
          {results.map((exercise) => (
            <Link className="exercise-card" href={`/exercises/${exercise.slug}`} key={exercise.slug}>
              <span className={`movement-mark movement-${exercise.movementPattern}`}>{exercise.movementPattern.replaceAll("-", " ")}</span>
              <div>
                <p className="eyebrow">{exercise.exerciseType} · {exercise.difficulty}</p>
                <h2>{locale === "mk" ? exercise.titleMk : exercise.titleEn}</h2>
                <p>{locale === "mk" ? exercise.summaryMk : exercise.summaryEn}</p>
                <ul className="tag-row">{exercise.equipment.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="product-empty">
          <h2>{locale === "mk" ? "Нема соодветни вежби." : "No exercises match those filters."}</h2>
          <p>{locale === "mk" ? "Исчистете ги филтрите или пробајте пошироко пребарување." : "Clear the filters or try a broader search."}</p>
          <button type="button" onClick={clear}>Clear filters</button>
        </div>
      )}

      {providerResults.length ? (
        <section className="provider-discovery-results" aria-labelledby="provider-exercises-title">
          <div className="recipe-results-heading">
            <div>
              <p className="eyebrow">Connected movement libraries</p>
              <h2 id="provider-exercises-title">{providerResults.length} live matches</h2>
            </div>
            <p>Review technique, target muscles, and source before saving a movement.</p>
          </div>
          <div className="provider-card-grid">
            {providerResults.map((exercise) => (
              <button
                className="provider-card"
                type="button"
                key={exercise.id}
                aria-label={`Review ${exercise.title} from ${providerLabels[exercise.provider]}`}
                onClick={(event) => {
                  setReturnFocus(event.currentTarget);
                  setSelected(exercise);
                }}
              >
                <span className="provider-card-provenance">
                  <span>{providerLabels[exercise.provider]}</span>
                  <span>{exercise.license.name}</span>
                </span>
                <strong>{exercise.title}</strong>
                <span>{exercise.primaryMuscles.join(", ") || "General movement"}</span>
                <small>{exercise.equipment.join(", ") || "No equipment listed"}</small>
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
            <button className="ui-button ui-button-primary" form="exercise-review-form" disabled={saving}>{saving ? "Saving…" : "Save exercise"}</button>
          </>
        ) : null}
      >
        {selected ? (
          <form id="exercise-review-form" action={saveAction} className="discovery-review-form">
            <input type="hidden" name="item" value={JSON.stringify(selected)} />
            <p className="discovery-source">
              {providerLabels[selected.provider]} · {selected.quality}
            </p>
            <dl className="discovery-facts">
              <div><dt>Primary muscles</dt><dd>{selected.primaryMuscles.join(", ") || "Not supplied"}</dd></div>
              <div><dt>Equipment</dt><dd>{selected.equipment.join(", ") || "Not supplied"}</dd></div>
              <div><dt>Difficulty</dt><dd>{selected.difficulty ?? "Not supplied"}</dd></div>
              <div><dt>License</dt><dd>{selected.license.name}</dd></div>
            </dl>
            <section className="discovery-review-section">
              <h3>Source and attribution</h3>
              <p>{selected.license.attribution}</p>
              {selected.sourceUrl ? (
                <a href={selected.sourceUrl} target="_blank" rel="noreferrer">
                  Open original source
                </a>
              ) : null}
            </section>
            <section className="discovery-review-section">
              <h3>How to perform it</h3>
              <ol>{selected.instructions.map((step, index) => <li key={index}>{step}</li>)}</ol>
            </section>
            {selected.safety ? <section className="discovery-review-section"><h3>Safety note</h3><p>{selected.safety}</p></section> : null}
          </form>
        ) : null}
      </ReviewSheet>
    </div>
  );
}
