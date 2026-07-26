"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { exercises } from "@/features/fitness/catalogue";
import type { WorkoutPrescription } from "@/features/fitness/workout-ideas";

type InitialWorkout = {
  id?: string;
  name?: string;
  description?: string;
  duration?: number;
  prescriptions?: WorkoutPrescription[];
};

const defaultPrescription = (exerciseSlug: string): WorkoutPrescription => ({
  exerciseSlug,
  sets: 3,
  repMin: 8,
  repMax: 12,
  durationSeconds: null,
  restSeconds: 90,
});

function prescriptionLabel(row: WorkoutPrescription) {
  if (row.durationSeconds !== null) {
    const sets = row.sets > 1 ? `${row.sets} sets · ` : "";
    return `${sets}${row.durationSeconds} sec · ${row.restSeconds} sec rest`;
  }

  return `${row.sets} sets · ${row.repMin}–${row.repMax} reps · ${row.restSeconds} sec rest`;
}

export function WorkoutBuilder({
  action,
  initial = {},
}: {
  action?: (formData: FormData) => void | Promise<void>;
  initial?: InitialWorkout;
}) {
  const [rows, setRows] = useState<WorkoutPrescription[]>(
    initial.prescriptions ?? [],
  );

  const move = (index: number, offset: number) => {
    setRows((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <div className="builder-layout">
      <form action={action} className="product-panel workout-builder">
        {initial.id ? (
          <input type="hidden" name="templateId" value={initial.id} />
        ) : null}
        <div className="field-grid">
          <label>
            Workout name
            <input
              name="name"
              required
              maxLength={80}
              defaultValue={initial.name}
              placeholder="e.g. Full body A"
            />
          </label>
          <label>
            Expected duration
            <input
              name="duration"
              type="number"
              min="5"
              max="300"
              defaultValue={initial.duration ?? 40}
            />
          </label>
        </div>
        <label>
          Description
          <textarea
            name="description"
            rows={3}
            defaultValue={initial.description}
            placeholder="What is this session for?"
          />
        </label>
        <input
          type="hidden"
          name="prescriptions"
          value={JSON.stringify(rows)}
        />
        <div className="builder-rows">
          {rows.map((row, index) => {
            const exercise = exercises.find(
              (item) => item.slug === row.exerciseSlug,
            );
            if (!exercise) return null;

            return (
              <div
                data-testid="builder-row"
                className="builder-row"
                key={`${row.exerciseSlug}-${index}`}
              >
                <div className="builder-row-content">
                  <span>{index + 1}</span>
                  <strong>{exercise.titleEn}</strong>
                  <small>{prescriptionLabel(row)}</small>
                </div>
                <div
                  className="builder-row-actions"
                  role="group"
                  aria-label={`Reorder or remove ${exercise.titleEn}`}
                >
                  <button
                    type="button"
                    aria-label={`Move ${exercise.titleEn} up`}
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${exercise.titleEn} down`}
                    onClick={() => move(index, 1)}
                    disabled={index === rows.length - 1}
                  >
                    <ArrowDown aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${exercise.titleEn}`}
                    onClick={() => setRows((current) =>
                      current.filter((_, rowIndex) => rowIndex !== index)
                    )}
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {!rows.length ? (
          <p data-testid="builder-error" className="inline-notice warning">
            Add at least one exercise to save this workout.
          </p>
        ) : null}
        <button
          className="ui-button ui-button-primary"
          disabled={!rows.length}
        >
          Save workout
        </button>
      </form>

      <aside className="product-panel builder-catalogue">
        <p className="eyebrow">Exercise library</p>
        <h2>Add movement</h2>
        <div>
          {exercises.map((exercise) => (
            <button
              type="button"
              aria-label={`Add ${exercise.titleEn}`}
              key={exercise.slug}
              onClick={() => setRows((current) => [
                ...current,
                defaultPrescription(exercise.slug),
              ])}
            >
              <span>
                <strong>{exercise.titleEn}</strong>
                <small>{exercise.primaryMuscles.join(" · ")}</small>
              </span>
              <Plus aria-hidden="true" />
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
