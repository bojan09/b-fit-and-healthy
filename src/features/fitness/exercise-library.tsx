"use client";

import {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
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
import { CatalogueImage } from "@/components/media/catalogue-image";
import {
  catalogueMediaForDisplay,
  fallbackKindForMedia,
} from "@/features/media/catalogue-media";
import type { AuthActionState } from "@/features/auth/types";
import {
  buildExerciseDiscoveryEndpoint,
  effectiveExerciseQuery,
  type ExerciseSearchCriteria,
} from "@/features/fitness/exercise-search";

const noExternalExercises: DiscoveryExercise[] = [];
const initial: AuthActionState = { status: "idle" };
const CONNECTED_PAGE_SIZE = 12;
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
  const [visibleConnectedCount, setVisibleConnectedCount] = useState(
    CONNECTED_PAGE_SIZE,
  );
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const filterRegionId = useId();
  const criteria = useMemo<ExerciseSearchCriteria>(() => ({
    query,
    muscle,
    equipment,
    type,
  }), [equipment, muscle, query, type]);
  const endpoint = useMemo(
    () => buildExerciseDiscoveryEndpoint({ ...criteria, query: "" }),
    [criteria],
  );
  const effectiveQuery = useMemo(
    () => effectiveExerciseQuery(criteria),
    [criteria],
  );
  const providerSearch = useDiscoverySearch<DiscoveryExercise>({
    endpoint,
    localResults: noExternalExercises,
  });
  const setProviderQuery = providerSearch.setQuery;
  useEffect(() => {
    setProviderQuery(effectiveQuery);
  }, [effectiveQuery, setProviderQuery]);
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
  const visibleProviderResults = providerResults.slice(
    0,
    visibleConnectedCount,
  );
  const remainingProviderResults = Math.max(
    providerResults.length - visibleConnectedCount,
    0,
  );
  const activeFilterCount = [equipment, muscle, type].filter(Boolean).length;
  const updateQuery = (value: string) => {
    setQuery(value);
    setVisibleConnectedCount(CONNECTED_PAGE_SIZE);
  };
  const clear = () => {
    updateQuery("");
    setEquipment("");
    setMuscle("");
    setType("");
    setVisibleConnectedCount(CONNECTED_PAGE_SIZE);
    setFiltersExpanded(false);
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
        <button
          type="button"
          className="exercise-filter-toggle"
          aria-expanded={filtersExpanded}
          aria-controls={filterRegionId}
          onClick={() => setFiltersExpanded((expanded) => !expanded)}
        >
          <SlidersHorizontal aria-hidden="true" />
          Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
        </button>
        <div
          id={filterRegionId}
          className={`exercise-filter-row exercise-filter-region${filtersExpanded ? " is-open" : ""}`}
        >
          <label>
            <span>{locale === "mk" ? "Опрема" : "Equipment"}</span>
            <select
              aria-label="Equipment"
              value={equipment}
              onChange={(event) => {
                setEquipment(event.target.value);
                setVisibleConnectedCount(CONNECTED_PAGE_SIZE);
              }}
            >
              <option value="">{locale === "mk" ? "Сета опрема" : "All equipment"}</option>
              {equipmentOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span>Muscle</span>
            <select
              aria-label="Muscle"
              value={muscle}
              onChange={(event) => {
                setMuscle(event.target.value);
                setVisibleConnectedCount(CONNECTED_PAGE_SIZE);
              }}
            >
              <option value="">All muscles</option>
              {muscleOptions.map((item) => <option key={item}>{item.replaceAll("-", " ")}</option>)}
            </select>
          </label>
          <label>
            <span>Type</span>
            <select
              aria-label="Exercise type"
              value={type}
              onChange={(event) => {
                setType(event.target.value as Exercise["exerciseType"] | "");
                setVisibleConnectedCount(CONNECTED_PAGE_SIZE);
              }}
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
      <DiscoveryStatus
        status={providerSearch.status}
        message={providerSearch.message}
        onRetry={providerSearch.retry}
      />
      <div className="exercise-results-heading">
        <strong>
          {results.length} local · {providerResults.length} connected{" "}
          {providerResults.length === 1 ? "exercise" : "exercises"}
        </strong>
        <span>Curated guidance with commercially permitted connected sources</span>
      </div>
      <section
        className="curated-exercise-results"
        aria-labelledby="curated-exercises-title"
      >
        <div className="recipe-results-heading">
          <div>
            <p className="eyebrow">Locally maintained guidance</p>
            <h2 id="curated-exercises-title">Curated by B Fit & Healthy</h2>
            <p>{results.length} {results.length === 1 ? "match" : "matches"}</p>
          </div>
          <p>Reviewed exercise guidance with dedicated detail pages.</p>
        </div>
      {results.length ? (
        <div className="exercise-grid">
          {results.map((exercise) => (
            <Link
              aria-label={locale === "mk" ? exercise.titleMk : exercise.titleEn}
              className="exercise-card"
              href={`/exercises/${exercise.slug}`}
              key={exercise.slug}
            >
              <CatalogueImage
                data-testid="exercise-card-media"
                media={catalogueMediaForDisplay(exercise.media, locale)}
                fallback={fallbackKindForMedia({ kind: "exercise", category: exercise.movementPattern })}
                sizes="(max-width: 48rem) 100vw, (max-width: 72rem) 50vw, 33vw"
                objectFit="contain"
              />
              <div>
                <p className="eyebrow">{exercise.exerciseType} · {exercise.difficulty}</p>
                <span className="movement-badge">{exercise.movementPattern.replaceAll("-", " ")}</span>
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
          {providerResults.length ? (
            <p>No curated matches. Showing connected library results.</p>
          ) : null}
          <h2>{locale === "mk" ? "Нема соодветни вежби." : "No exercises match those filters."}</h2>
          <p>{locale === "mk" ? "Исчистете ги филтрите или пробајте пошироко пребарување." : "Clear the filters or try a broader search."}</p>
          <button type="button" onClick={clear}>Clear filters</button>
        </div>
      )}
      </section>

      <section className="provider-discovery-results" aria-labelledby="connected-exercises-title">
          <div className="recipe-results-heading">
            <div>
              <p className="eyebrow">Connected movement libraries</p>
              <h2 id="connected-exercises-title">Connected libraries</h2>
              <p>{providerResults.length} live matches</p>
            </div>
            <p>Review technique, target muscles, and source before saving a movement.</p>
          </div>
          <div className="provider-card-grid">
            {visibleProviderResults.map((exercise) => (
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
                {exercise.difficulty ? (
                  <span>{exercise.difficulty}</span>
                ) : null}
                <small>
                  {exercise.instructions.length
                    ? "Instructions available"
                    : "Instructions not supplied"}
                </small>
                <small>{exercise.license.attribution}</small>
                {exercise.attribution !== exercise.license.attribution ? (
                  <small>{exercise.attribution}</small>
                ) : null}
              </button>
            ))}
          </div>
          {!providerResults.length ? (
            <div className="product-empty">
              {providerSearch.status === "error" ? (
                <p>
                  {results.length
                    ? "Connected search is unavailable. Matching curated exercises remain usable."
                    : "Connected search is unavailable. Try again or broaden the search."}
                </p>
              ) : providerSearch.status === "success" ? (
                <p>
                  {results.length
                    ? "No connected matches. Curated exercises remain available."
                    : "No exercises found in curated or connected libraries."}
                </p>
              ) : providerSearch.status === "partial" ? (
                <p>
                  {results.length
                    ? "No connected matches in the available sources. Curated exercises remain available."
                    : "No matches were available from the connected sources that responded."}
                </p>
              ) : providerSearch.status === "loading" ? (
                <p>Checking connected libraries for matches.</p>
              ) : (
                <p>Search or choose a filter to check connected libraries.</p>
              )}
            </div>
          ) : null}
          {remainingProviderResults ? (
            <button
              type="button"
              className="text-action exercise-show-more"
              onClick={() => setVisibleConnectedCount((count) =>
                count + CONNECTED_PAGE_SIZE
              )}
            >
              Show {Math.min(CONNECTED_PAGE_SIZE, remainingProviderResults)} more
            </button>
          ) : null}
      </section>
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
              {selected.license.url ? (
                <a href={selected.license.url} target="_blank" rel="noreferrer">
                  View license
                </a>
              ) : null}
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
