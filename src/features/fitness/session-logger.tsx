"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { getFitnessCopy } from "@/features/fitness/content";
import type { Locale } from "@/lib/i18n/config";

type SetRow = { id: string; reps: number | null; loadKg: number | null; isComplete: boolean; isBodyweight: boolean };
type ExerciseRow = { id: string; name: string; target: string; sets: SetRow[] };
type Action = (data: FormData) => void | Promise<void>;

export function SessionLogger({
  sessionId,
  exercises: initial,
  locale = "en",
  onUpdate,
  updateAction,
  addAction,
  removeAction,
  finishAction,
}: {
  sessionId: string;
  exercises: ExerciseRow[];
  locale?: Locale;
  onUpdate?: (set: SetRow) => void;
  updateAction?: Action;
  addAction?: Action;
  removeAction?: Action;
  finishAction?: Action;
}) {
  const c = getFitnessCopy(locale);
  const [items, setItems] = useState(initial);
  const change = (exerciseIndex: number, setIndex: number, patch: Partial<SetRow>) =>
    setItems((current) => current.map((exercise, index) => index === exerciseIndex
      ? { ...exercise, sets: exercise.sets.map((set, row) => (row === setIndex ? { ...set, ...patch } : set)) }
      : exercise));
  const addLocalSet = (exerciseIndex: number) =>
    setItems((current) => current.map((item, index) => index === exerciseIndex
      ? { ...item, sets: [...item.sets, { id: `new-${Date.now()}`, reps: null, loadKg: null, isComplete: false, isBodyweight: false }] }
      : item));
  const hasComplete = items.some((exercise) => exercise.sets.some((set) => set.isComplete));

  return (
    <div className="session-logger">
      {items.map((exercise, exerciseIndex) => (
        <section className="session-exercise" key={exercise.id}>
          <header>
            <div>
              <p className="eyebrow">{exercise.target}</p>
              <h2>{exercise.name}</h2>
            </div>
            <span className="session-progress" data-complete={exercise.sets.every((set) => set.isComplete) || undefined}>
              {exercise.sets.filter((set) => set.isComplete).length}/{exercise.sets.length}
            </span>
          </header>
          <div className="set-table">
            <div className="set-head">
              <span>{c.set}</span>
              <span>{c.kg}</span>
              <span>{c.repsLabel}</span>
              <span>{c.done}</span>
            </div>
            {exercise.sets.map((set, setIndex) => (
              <form
                action={updateAction}
                data-action-status={set.isComplete ? "success" : "idle"}
                className={set.isComplete ? "set-row complete" : "set-row"}
                key={set.id}
              >
                <input type="hidden" name="setId" value={set.id} />
                <input type="hidden" name="sessionId" value={sessionId} />
                <strong>{setIndex + 1}</strong>
                <input
                  name="loadKg"
                  aria-label={c.loadLabel}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step=".5"
                  disabled={set.isBodyweight}
                  value={set.loadKg ?? ""}
                  onChange={(event) => change(exerciseIndex, setIndex, { loadKg: Number(event.target.value) })}
                />
                <input
                  name="reps"
                  aria-label={c.repsLabel}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={set.reps ?? ""}
                  onChange={(event) => change(exerciseIndex, setIndex, { reps: Number(event.target.value) })}
                />
                <input
                  name="complete"
                  aria-label={c.completeLabel}
                  type="checkbox"
                  checked={set.isComplete}
                  onChange={(event) => {
                    const next = { ...set, isComplete: event.target.checked };
                    change(exerciseIndex, setIndex, { isComplete: event.target.checked });
                    onUpdate?.(next);
                  }}
                />
                <label className="bodyweight-check">
                  <input
                    name="bodyweight"
                    aria-label={c.bodyweight}
                    type="checkbox"
                    checked={set.isBodyweight}
                    onChange={(event) => change(exerciseIndex, setIndex, {
                      isBodyweight: event.target.checked,
                      loadKg: event.target.checked ? 0 : set.loadKg,
                    })}
                  />
                  {c.bodyweight}
                </label>
                {updateAction && (
                  <button className="set-save" aria-label={c.saveSet(setIndex + 1)}>
                    <Save aria-hidden="true" /> {c.save}
                  </button>
                )}
                {removeAction && exercise.sets.length > 1 && (
                  <button className="set-remove" formAction={removeAction} name="setId" value={set.id} aria-label={c.removeSet(setIndex + 1)}>
                    <Trash2 aria-hidden="true" />
                  </button>
                )}
              </form>
            ))}
          </div>
          {addAction ? (
            <form action={addAction}>
              <input type="hidden" name="sessionId" value={sessionId} />
              <input type="hidden" name="sessionExerciseId" value={exercise.id} />
              <button className="text-action"><Plus aria-hidden="true" /> {c.addSet}</button>
            </form>
          ) : (
            <button type="button" className="text-action" onClick={() => addLocalSet(exerciseIndex)}>
              <Plus aria-hidden="true" /> {c.addSet}
            </button>
          )}
        </section>
      ))}
      <form action={finishAction}>
        <input type="hidden" name="id" value={sessionId} />
        <button className="ui-button ui-button-primary session-finish" disabled={!hasComplete}>{c.finishWorkout}</button>
      </form>
    </div>
  );
}
