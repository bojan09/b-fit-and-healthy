"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, Plus, Search, Trash2 } from "lucide-react";
import { exercises } from "@/features/fitness/catalogue";
import { getFitnessCopy, type FitnessCopy } from "@/features/fitness/content";
import { fitnessLabel } from "@/features/fitness/labels";
import type { WorkoutPrescription } from "@/features/fitness/workout-ideas";
import type { Locale } from "@/lib/i18n/config";

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

function prescriptionLabel(row: WorkoutPrescription, c: FitnessCopy) {
  if (row.durationSeconds !== null) {
    const sets = row.sets > 1 ? `${row.sets} ${c.sets} · ` : "";
    return `${sets}${row.durationSeconds} ${c.sec} · ${row.restSeconds} ${c.sec} ${c.rest}`;
  }

  return `${row.sets} ${c.sets} · ${row.repMin}–${row.repMax} ${c.reps} · ${row.restSeconds} ${c.sec} ${c.rest}`;
}

function SaveButton({ disabled, c }: { disabled: boolean; c: FitnessCopy }) {
  const { pending } = useFormStatus();
  return (
    <button className="ui-button ui-button-primary" disabled={disabled || pending}>
      {pending ? c.saving : c.saveWorkout}
    </button>
  );
}

export function WorkoutBuilder({
  action,
  initial = {},
  locale = "en",
}: {
  action?: (formData: FormData) => void | Promise<void>;
  initial?: InitialWorkout;
  locale?: Locale;
}) {
  const c = getFitnessCopy(locale);
  const title = (exercise: (typeof exercises)[number]) => (locale === "mk" ? exercise.titleMk : exercise.titleEn);
  const [filter, setFilter] = useState("");
  const catalogue = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    if (!needle) return exercises;
    return exercises.filter((exercise) =>
      `${exercise.titleEn} ${exercise.titleMk} ${exercise.primaryMuscles.join(" ")}`.toLowerCase().includes(needle));
  }, [filter]);
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
            {c.workoutName}
            <input
              name="name"
              required
              maxLength={80}
              defaultValue={initial.name}
              placeholder={c.namePlaceholder}
            />
          </label>
          <label>
            {c.expectedDuration}
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
          {c.description}
          <textarea
            name="description"
            rows={3}
            defaultValue={initial.description}
            placeholder={c.descriptionPlaceholder}
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
                  <strong>{title(exercise)}</strong>
                  <small>{prescriptionLabel(row, c)}</small>
                </div>
                <div
                  className="builder-row-actions"
                  role="group"
                  aria-label={c.reorderOrRemove(title(exercise))}
                >
                  <button
                    type="button"
                    aria-label={c.moveUp(title(exercise))}
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={c.moveDown(title(exercise))}
                    onClick={() => move(index, 1)}
                    disabled={index === rows.length - 1}
                  >
                    <ArrowDown aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={c.remove(title(exercise))}
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
            {c.addAtLeastOne}
          </p>
        ) : null}
        <SaveButton disabled={!rows.length} c={c} />
      </form>

      <aside className="product-panel builder-catalogue">
        <p className="eyebrow">{c.exercises}</p>
        <h2>{c.addMovement}</h2>
        <label className="discovery-search-field builder-filter">
          <Search aria-hidden="true" />
          <span className="sr-only">{c.searchMovements}</span>
          <input type="search" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder={c.searchMovements} />
        </label>
        <div>
          {catalogue.map((exercise) => (
            <button
              type="button"
              aria-label={c.add(title(exercise))}
              key={exercise.slug}
              onClick={() => setRows((current) => [
                ...current,
                defaultPrescription(exercise.slug),
              ])}
            >
              <span>
                <strong>{title(exercise)}</strong>
                <small>{exercise.primaryMuscles.map((muscle) => fitnessLabel(muscle, locale)).join(" · ")}</small>
              </span>
              <Plus aria-hidden="true" />
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
