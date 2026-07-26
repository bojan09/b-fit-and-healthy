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

const noExternalWorkouts: DiscoveryWorkout[] = [];
const initial: AuthActionState = { status: "idle" };

export function WorkoutIdeaLibrary({ ideas }: { ideas: readonly WorkoutIdea[] }) {
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
          <p className="eyebrow">A useful place to begin</p>
          <h2 id="workout-ideas-title">Workout ideas</h2>
          <p>Choose a sensible starting structure, then edit every exercise to fit you.</p>
        </div>
        <div className="workout-idea-filters">
          <SlidersHorizontal aria-hidden="true" />
          <label>
            <span>Goal</span>
            <select value={goal} onChange={(event) => setGoal(event.target.value as WorkoutGoal | "all")}>
              <option value="all">All goals</option>
              <option value="strength">Strength</option>
              <option value="mobility">Mobility</option>
              <option value="conditioning">Conditioning</option>
            </select>
          </label>
          <label>
            <span>Time</span>
            <select value={duration} onChange={(event) => setDuration(Number(event.target.value))}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">Up to 45 minutes</option>
            </select>
          </label>
        </div>
      </div>
      <div className="workout-provider-search">
        <label className="discovery-search-field">
          <Search aria-hidden="true" />
          <span className="sr-only">Search connected workout ideas</span>
          <input
            type="search"
            value={providerSearch.query}
            onChange={(event) => providerSearch.setQuery(event.target.value)}
            placeholder="Search by goal, muscle or equipment"
          />
        </label>
        <DiscoveryStatus status={providerSearch.status} message={providerSearch.message} />
      </div>
      <div className="workout-idea-grid">
        {results.map((idea) => (
          <Link href={`/workouts/new?idea=${idea.slug}`} className="workout-idea-card" key={idea.slug}>
            <div className="workout-idea-icon"><Dumbbell aria-hidden="true" /></div>
            <div>
              <p className="eyebrow">{idea.goal} · {idea.level}</p>
              <h3>{idea.title}</h3>
              <p>{idea.summary}</p>
            </div>
            <div className="workout-idea-meta">
              <span><Clock aria-hidden="true" />{idea.durationMinutes} min</span>
              <span>{idea.exerciseSlugs.length} exercises</span>
              <ArrowRight aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
      {providerResults.length ? (
        <section className="provider-discovery-results" aria-labelledby="provider-workouts-title">
          <div className="recipe-results-heading">
            <div>
              <p className="eyebrow">Connected workout libraries</p>
              <h2 id="provider-workouts-title">{providerResults.length} live matches</h2>
            </div>
            <p>Review the complete structure before saving it to your private library.</p>
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
                <span>{workout.goal} · {workout.difficulty ?? "Open level"}</span>
                <small>{workout.exercises.length} exercises · {workout.durationMinutes ?? "Flexible"} min</small>
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
            <button className="ui-button ui-button-primary" form="workout-review-form" disabled={saving}>{saving ? "Creating…" : "Create editable workout"}</button>
          </>
        ) : null}
      >
        {selected ? (
          <form id="workout-review-form" action={saveAction} className="discovery-review-form">
            <input type="hidden" name="item" value={JSON.stringify(selected)} />
            <p className="discovery-source">{selected.attribution} · {selected.quality}</p>
            <dl className="discovery-facts">
              <div><dt>Goal</dt><dd>{selected.goal}</dd></div>
              <div><dt>Difficulty</dt><dd>{selected.difficulty ?? "Not supplied"}</dd></div>
              <div><dt>Duration</dt><dd>{selected.durationMinutes ? `${selected.durationMinutes} min` : "Flexible"}</dd></div>
              <div><dt>Equipment</dt><dd>{selected.equipment.join(", ") || "Not supplied"}</dd></div>
            </dl>
            <section className="discovery-review-section">
              <h3>Workout structure</h3>
              <ol>
                {selected.exercises.map((exercise, index) => (
                  <li key={`${exercise.exerciseId}-${index}`}>
                    <strong>{exercise.title}</strong> · {exercise.sets} sets
                    {exercise.repMin ? ` · ${exercise.repMin}${exercise.repMax ? `–${exercise.repMax}` : ""} reps` : ""}
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
