"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Dumbbell,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import {
  discoverWorkoutIdeas,
  ideaCopy,
  type WorkoutGoal,
  type WorkoutIdea,
} from "./workout-ideas";
import type { DiscoveryWorkout } from "@/features/discovery/types";
import { useDiscoverySearch } from "@/features/discovery/use-discovery-search";
import { DiscoveryStatus } from "@/components/discovery/discovery-status";
import { ReviewSheet } from "@/components/discovery/review-sheet";
import { importDiscoveryWorkoutAction } from "@/features/fitness/actions";
import { ActionFeedback } from "@/features/motion/action-feedback";
import type { AuthActionState } from "@/features/auth/types";
import { useOptionalLocale } from "@/components/providers/locale-provider";

const copy = {
  en: { eyebrow: "A useful place to begin", title: "Workout ideas", intro: "Choose a sensible starting structure, then edit every exercise to fit you.", goal: "Goal", allGoals: "All goals", strength: "Strength", mobility: "Mobility", conditioning: "Conditioning", time: "Time", m15: "15 minutes", m30: "30 minutes", m45: "Up to 45 minutes", searchLabel: "Search connected workout ideas", searchPlaceholder: "Search by goal, muscle or equipment", min: "min", exercises: "exercises", connected: "Connected workout libraries", liveMatches: "live matches", reviewNote: "Review the complete structure before saving it to your private library.", openLevel: "Open level", flexible: "Flexible", cancel: "Cancel", creating: "Creating…", create: "Create editable workout", difficulty: "Difficulty", duration: "Duration", equipment: "Equipment", notSupplied: "Not supplied", structure: "Workout structure", sets: "sets", reps: "reps", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
  mk: { eyebrow: "Корисно место за почеток", title: "Идеи за тренинг", intro: "Изберете разумна почетна структура, па прилагодете ја секоја вежба.", goal: "Цел", allGoals: "Сите цели", strength: "Сила", mobility: "Мобилност", conditioning: "Кондиција", time: "Време", m15: "15 минути", m30: "30 минути", m45: "До 45 минути", searchLabel: "Пребарај поврзани идеи за тренинг", searchPlaceholder: "Пребарај по цел, мускул или опрема", min: "мин", exercises: "вежби", connected: "Поврзани библиотеки со тренинзи", liveMatches: "резултати", reviewNote: "Прегледајте ја целата структура пред да ја зачувате во приватната библиотека.", openLevel: "Отворено ниво", flexible: "Флексибилно", cancel: "Откажи", creating: "Се креира…", create: "Креирај тренинг за уредување", difficulty: "Тежина", duration: "Времетраење", equipment: "Опрема", notSupplied: "Не е наведено", structure: "Структура на тренингот", sets: "серии", reps: "повторувања", beginner: "Почетно", intermediate: "Средно", advanced: "Напредно" },
} as const;

const noExternalWorkouts: DiscoveryWorkout[] = [];
const initial: AuthActionState = { status: "idle" };

export function WorkoutIdeaLibrary({ ideas }: { ideas: readonly WorkoutIdea[] }) {
  const locale = useOptionalLocale();
  const t = copy[locale];
  const [goal, setGoal] = useState<WorkoutGoal | "all">("all");
  const [duration, setDuration] = useState(45);
  const providerSearch = useDiscoverySearch<DiscoveryWorkout>({
    endpoint: "/api/discovery/workouts",
    localResults: noExternalWorkouts,
  });
  const [selected, setSelected] = useState<DiscoveryWorkout | null>(null);
  const [saveState, saveAction, saving] = useActionState(
    importDiscoveryWorkoutAction,
    initial,
  );
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  const results = useMemo(
    () =>
      discoverWorkoutIdeas({ goal, maxMinutes: duration }).filter((idea) =>
        ideas.some((item) => item.slug === idea.slug),
      ),
    [duration, goal, ideas],
  );
  const providerResults = providerSearch.results.filter(
    (workout) => workout.provider !== "local",
  );

  return (
    <section className="workout-ideas" aria-labelledby="workout-ideas-title">
      <div className="workout-ideas-heading">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="workout-ideas-title">{t.title}</h2>
          <p>{t.intro}</p>
        </div>
        <div className="workout-idea-filters">
          <SlidersHorizontal aria-hidden="true" />
          <label>
            <span>{t.goal}</span>
            <select value={goal} onChange={(event) => setGoal(event.target.value as WorkoutGoal | "all")}>
              <option value="all">{t.allGoals}</option>
              <option value="strength">{t.strength}</option>
              <option value="mobility">{t.mobility}</option>
              <option value="conditioning">{t.conditioning}</option>
            </select>
          </label>
          <label>
            <span>{t.time}</span>
            <select value={duration} onChange={(event) => setDuration(Number(event.target.value))}>
              <option value="15">{t.m15}</option>
              <option value="30">{t.m30}</option>
              <option value="45">{t.m45}</option>
            </select>
          </label>
        </div>
      </div>
      <div className="workout-provider-search">
        <label className="discovery-search-field">
          <Search aria-hidden="true" />
          <span className="sr-only">{t.searchLabel}</span>
          <input
            type="search"
            value={providerSearch.query}
            onChange={(event) => providerSearch.setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
          />
        </label>
        <DiscoveryStatus status={providerSearch.status} message={providerSearch.message} />
      </div>
      <div className="workout-idea-grid">
        {results.map((idea) => (
          <Link href={`/workouts/new?idea=${idea.slug}`} className="workout-idea-card" key={idea.slug}>
            <div className="workout-idea-icon"><Dumbbell aria-hidden="true" /></div>
            <div>
              <p className="eyebrow">{t[idea.goal]} · {t[idea.level]}</p>
              <h3>{ideaCopy(idea, locale).title}</h3>
              <p>{ideaCopy(idea, locale).summary}</p>
            </div>
            <div className="workout-idea-meta">
              <span><Clock aria-hidden="true" />{idea.durationMinutes} {t.min}</span>
              <span>{idea.exercises.length} {t.exercises}</span>
              <ArrowRight aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
      {providerResults.length ? (
        <section className="provider-discovery-results" aria-labelledby="provider-workouts-title">
          <div className="recipe-results-heading">
            <div>
              <p className="eyebrow">{t.connected}</p>
              <h2 id="provider-workouts-title">{providerResults.length} {t.liveMatches}</h2>
            </div>
            <p>{t.reviewNote}</p>
          </div>
          <div className="provider-card-grid">
            {providerResults.map((workout) => (
              <button
                className="provider-card"
                type="button"
                key={workout.id}
                onClick={(event) => {
                  setReturnFocus(event.currentTarget);
                  setSelected(workout);
                }}
              >
                <span className="provider-card-kicker">{workout.attribution}</span>
                <strong>{workout.title}</strong>
                <span>{workout.goal} · {workout.difficulty ?? t.openLevel}</span>
                <small>{workout.exercises.length} {t.exercises} · {workout.durationMinutes ?? t.flexible} {t.min}</small>
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
            <button className="ui-button ui-button-primary" form="workout-review-form" disabled={saving}>{saving ? t.creating : t.create}</button>
          </>
        ) : null}
      >
        {selected ? (
          <form id="workout-review-form" action={saveAction} className="discovery-review-form">
            <input type="hidden" name="item" value={JSON.stringify(selected)} />
            <p className="discovery-source">{selected.attribution} · {selected.quality}</p>
            <dl className="discovery-facts">
              <div><dt>{t.goal}</dt><dd>{selected.goal}</dd></div>
              <div><dt>{t.difficulty}</dt><dd>{selected.difficulty ?? t.notSupplied}</dd></div>
              <div><dt>{t.duration}</dt><dd>{selected.durationMinutes ? `${selected.durationMinutes} ${t.min}` : t.flexible}</dd></div>
              <div><dt>{t.equipment}</dt><dd>{selected.equipment.join(", ") || t.notSupplied}</dd></div>
            </dl>
            <section className="discovery-review-section">
              <h3>{t.structure}</h3>
              <ol>
                {selected.exercises.map((exercise, index) => (
                  <li key={`${exercise.exerciseId}-${index}`}>
                    <strong>{exercise.title}</strong> · {exercise.sets} {t.sets}
                    {exercise.repMin ? ` · ${exercise.repMin}${exercise.repMax ? `–${exercise.repMax}` : ""} ${t.reps}` : ""}
                  </li>
                ))}
              </ol>
            </section>
          </form>
        ) : null}
      </ReviewSheet>
    </section>
  );
}
