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
import { fitnessLabel } from "@/features/fitness/labels";

const noExternalExercises: DiscoveryExercise[] = [];
const initial: AuthActionState = { status: "idle" };
const CONNECTED_PAGE_SIZE = 12;
const CURATED_PAGE_SIZE = 24;
const copy = {
  en: { search: "Search", placeholder: "Exercise, muscle or movement", filters: "Filters", equipment: "Equipment", allEquipment: "All equipment", muscle: "Muscle", allMuscles: "All muscles", type: "Type", exerciseType: "Exercise type", allTypes: "All types", clear: "Clear filters", local: "local", connected: "connected", exercise: "exercise", exercises: "exercises", sourcesNote: "Curated guidance with commercially permitted connected sources", localEyebrow: "Locally maintained guidance", curatedTitle: "Curated by B Fit & Healthy", match: "match", matches: "matches", curatedNote: "Reviewed exercise guidance with dedicated detail pages.", noCurated: "No curated matches. Showing connected library results.", noMatchTitle: "No exercises match those filters.", noMatchBody: "Clear the filters or try a broader search.", connectedEyebrow: "Connected movement libraries", connectedTitle: "Connected libraries", liveMatches: "live matches", connectedNote: "Review technique, target muscles, and source before saving a movement.", review: (title: string, provider: string) => `Review ${title} from ${provider}`, general: "General movement", noEquipment: "No equipment listed", instructions: "Instructions available", noInstructions: "Instructions not supplied", errCurated: "Connected search is unavailable. Matching curated exercises remain usable.", errNone: "Connected search is unavailable. Try again or broaden the search.", okCurated: "No connected matches. Curated exercises remain available.", okNone: "No exercises found in curated or connected libraries.", partialCurated: "No connected matches in the available sources. Curated exercises remain available.", partialNone: "No matches were available from the connected sources that responded.", loading: "Checking connected libraries for matches.", idle: "Search or choose a filter to check connected libraries.", showMore: (n: number) => `Show ${n} more`, cancel: "Cancel", saving: "Saving…", save: "Save exercise", primaryMuscles: "Primary muscles", notSupplied: "Not supplied", difficulty: "Difficulty", license: "License", source: "Source and attribution", viewLicense: "View license", openSource: "Open original source", howTo: "How to perform it", safety: "Safety note" },
  mk: { search: "Пребарај", placeholder: "Вежба, мускул или движење", filters: "Филтри", equipment: "Опрема", allEquipment: "Сета опрема", muscle: "Мускул", allMuscles: "Сите мускули", type: "Тип", exerciseType: "Тип на вежба", allTypes: "Сите типови", clear: "Исчисти филтри", local: "локални", connected: "поврзани", exercise: "вежба", exercises: "вежби", sourcesNote: "Курирани упатства со комерцијално дозволени поврзани извори", localEyebrow: "Локално одржувани упатства", curatedTitle: "Избор на B Fit & Healthy", match: "резултат", matches: "резултати", curatedNote: "Проверени упатства за вежби со посебни страници.", noCurated: "Нема курирани резултати. Се прикажуваат резултати од поврзани библиотеки.", noMatchTitle: "Нема соодветни вежби.", noMatchBody: "Исчистете ги филтрите или пробајте пошироко пребарување.", connectedEyebrow: "Поврзани библиотеки со движења", connectedTitle: "Поврзани библиотеки", liveMatches: "резултати во живо", connectedNote: "Прегледајте ја техниката, мускулите и изворот пред да зачувате движење.", review: (title: string, provider: string) => `Прегледај ${title} од ${provider}`, general: "Општо движење", noEquipment: "Нема наведена опрема", instructions: "Има упатства", noInstructions: "Нема упатства", errCurated: "Поврзаното пребарување е недостапно. Курираните вежби се достапни.", errNone: "Поврзаното пребарување е недостапно. Обидете се повторно или проширете го пребарувањето.", okCurated: "Нема поврзани резултати. Курираните вежби се достапни.", okNone: "Нема вежби во курираните или поврзаните библиотеки.", partialCurated: "Нема поврзани резултати во достапните извори. Курираните вежби се достапни.", partialNone: "Нема резултати од поврзаните извори што одговорија.", loading: "Се проверуваат поврзаните библиотеки.", idle: "Пребарајте или изберете филтер за да ги проверите поврзаните библиотеки.", showMore: (n: number) => `Прикажи уште ${n}`, cancel: "Откажи", saving: "Се зачувува…", save: "Зачувај вежба", primaryMuscles: "Главни мускули", notSupplied: "Не е наведено", difficulty: "Тежина", license: "Лиценца", source: "Извор и атрибуција", viewLicense: "Види лиценца", openSource: "Отвори оригинален извор", howTo: "Како се изведува", safety: "Безбедносна напомена" },
} as const;
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
  const t = copy[locale];
  const [curatedLimit, setCuratedLimit] = useState(CURATED_PAGE_SIZE);
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
    setCuratedLimit(CURATED_PAGE_SIZE);
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
          <span>{t.search}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder={t.placeholder}
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
          {t.filters}{activeFilterCount ? ` (${activeFilterCount})` : ""}
        </button>
        <div
          id={filterRegionId}
          className={`exercise-filter-row exercise-filter-region${filtersExpanded ? " is-open" : ""}`}
        >
          <label>
            <span>{t.equipment}</span>
            <select
              aria-label={t.equipment}
              value={equipment}
              onChange={(event) => {
                setEquipment(event.target.value);
                setCuratedLimit(CURATED_PAGE_SIZE);
                setVisibleConnectedCount(CONNECTED_PAGE_SIZE);
              }}
            >
              <option value="">{t.allEquipment}</option>
              {equipmentOptions.map((item) => <option key={item} value={item}>{fitnessLabel(item, locale)}</option>)}
            </select>
          </label>
          <label>
            <span>{t.muscle}</span>
            <select
              aria-label={t.muscle}
              value={muscle}
              onChange={(event) => {
                setMuscle(event.target.value);
                setCuratedLimit(CURATED_PAGE_SIZE);
                setVisibleConnectedCount(CONNECTED_PAGE_SIZE);
              }}
            >
              <option value="">{t.allMuscles}</option>
              {muscleOptions.map((item) => <option key={item} value={item}>{fitnessLabel(item, locale)}</option>)}
            </select>
          </label>
          <label>
            <span>{t.type}</span>
            <select
              aria-label={t.exerciseType}
              value={type}
              onChange={(event) => {
                setType(event.target.value as Exercise["exerciseType"] | "");
                setCuratedLimit(CURATED_PAGE_SIZE);
                setVisibleConnectedCount(CONNECTED_PAGE_SIZE);
              }}
            >
              <option value="">{t.allTypes}</option>
              <option value="strength">{fitnessLabel("strength", locale)}</option>
              <option value="core">{fitnessLabel("core", locale)}</option>
              <option value="mobility">{fitnessLabel("mobility", locale)}</option>
            </select>
          </label>
          <button type="button" className="text-action" onClick={clear}>
            {t.clear}
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
          {results.length} {t.local} · {providerResults.length} {t.connected}{" "}
          {providerResults.length === 1 ? t.exercise : t.exercises}
        </strong>
        <span>{t.sourcesNote}</span>
      </div>
      <section
        className="curated-exercise-results"
        aria-labelledby="curated-exercises-title"
      >
        <div className="recipe-results-heading">
          <div>
            <p className="eyebrow">{t.localEyebrow}</p>
            <h2 id="curated-exercises-title">{t.curatedTitle}</h2>
            <p>{results.length} {results.length === 1 ? t.match : t.matches}</p>
          </div>
          <p>{t.curatedNote}</p>
        </div>
      {results.length ? (
        <div className="exercise-grid">
          {results.slice(0, curatedLimit).map((exercise) => (
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
                <p className="eyebrow">{fitnessLabel(exercise.exerciseType, locale)} · {fitnessLabel(exercise.difficulty, locale)}</p>
                <span className="movement-badge">{fitnessLabel(exercise.movementPattern, locale)}</span>
                <h2>{locale === "mk" ? exercise.titleMk : exercise.titleEn}</h2>
                <p>{locale === "mk" ? exercise.summaryMk : exercise.summaryEn}</p>
                <ul className="tag-row">{exercise.equipment.map((item) => <li key={item}>{fitnessLabel(item, locale)}</li>)}</ul>
              </div>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="product-empty">
          {providerResults.length ? (
            <p>{t.noCurated}</p>
          ) : null}
          <h2>{t.noMatchTitle}</h2>
          <p>{t.noMatchBody}</p>
          <button type="button" className="text-action" onClick={clear}>{t.clear}</button>
        </div>
      )}
      {results.length > curatedLimit ? (
        <button
          type="button"
          className="text-action exercise-show-more"
          onClick={() => setCuratedLimit((count) => count + CURATED_PAGE_SIZE)}
        >
          {t.showMore(Math.min(CURATED_PAGE_SIZE, results.length - curatedLimit))}
        </button>
      ) : null}
      </section>

      <section className="provider-discovery-results" aria-labelledby="connected-exercises-title">
          <div className="recipe-results-heading">
            <div>
              <p className="eyebrow">{t.connectedEyebrow}</p>
              <h2 id="connected-exercises-title">{t.connectedTitle}</h2>
              <p>{providerResults.length} {t.liveMatches}</p>
            </div>
            <p>{t.connectedNote}</p>
          </div>
          <div className="provider-card-grid">
            {visibleProviderResults.map((exercise) => (
              <button
                className="provider-card"
                type="button"
                key={exercise.id}
                aria-label={t.review(exercise.title, providerLabels[exercise.provider])}
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
                <span>{exercise.primaryMuscles.join(", ") || t.general}</span>
                <small>{exercise.equipment.join(", ") || t.noEquipment}</small>
                {exercise.difficulty ? (
                  <span>{exercise.difficulty}</span>
                ) : null}
                <small>
                  {exercise.instructions.length
                    ? t.instructions
                    : t.noInstructions}
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
                    ? t.errCurated
                    : t.errNone}
                </p>
              ) : providerSearch.status === "success" ? (
                <p>
                  {results.length
                    ? t.okCurated
                    : t.okNone}
                </p>
              ) : providerSearch.status === "partial" ? (
                <p>
                  {results.length
                    ? t.partialCurated
                    : t.partialNone}
                </p>
              ) : providerSearch.status === "loading" ? (
                <p>{t.loading}</p>
              ) : (
                <p>{t.idle}</p>
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
              {t.showMore(Math.min(CONNECTED_PAGE_SIZE, remainingProviderResults))}
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
            <button className="ui-button ui-button-secondary" type="button" onClick={() => setSelected(null)}>{t.cancel}</button>
            <button className="ui-button ui-button-primary" form="exercise-review-form" disabled={saving}>{saving ? t.saving : t.save}</button>
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
              <div><dt>{t.primaryMuscles}</dt><dd>{selected.primaryMuscles.join(", ") || t.notSupplied}</dd></div>
              <div><dt>{t.equipment}</dt><dd>{selected.equipment.join(", ") || t.notSupplied}</dd></div>
              <div><dt>{t.difficulty}</dt><dd>{selected.difficulty ?? t.notSupplied}</dd></div>
              <div><dt>{t.license}</dt><dd>{selected.license.name}</dd></div>
            </dl>
            <section className="discovery-review-section">
              <h3>{t.source}</h3>
              <p>{selected.license.attribution}</p>
              {selected.license.url ? (
                <a href={selected.license.url} target="_blank" rel="noreferrer">
                  {t.viewLicense}
                </a>
              ) : null}
              {selected.sourceUrl ? (
                <a href={selected.sourceUrl} target="_blank" rel="noreferrer">
                  {t.openSource}
                </a>
              ) : null}
            </section>
            <section className="discovery-review-section">
              <h3>{t.howTo}</h3>
              <ol>{selected.instructions.map((step, index) => <li key={index}>{step}</li>)}</ol>
            </section>
            {selected.safety ? <section className="discovery-review-section"><h3>{t.safety}</h3><p>{selected.safety}</p></section> : null}
          </form>
        ) : null}
      </ReviewSheet>
    </div>
  );
}
