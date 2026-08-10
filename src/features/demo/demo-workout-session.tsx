"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { DemoExercise, LocalizedText } from "@/features/demo/data";

type Labels = { done: string; pending: string; complete: string };
type Session = { title: LocalizedText; duration: LocalizedText; exercises: DemoExercise[] };

export function DemoWorkoutSession({
  session,
  locale,
  labels
}: {
  session: Session;
  locale: Locale;
  labels: Labels;
}) {
  const [exercises, setExercises] = useState(session.exercises);
  const toggle = (id: string) =>
    setExercises((current) =>
      current.map((exercise) => (exercise.id === id ? { ...exercise, done: !exercise.done } : exercise))
    );
  const doneCount = exercises.filter((exercise) => exercise.done).length;

  return (
    <div className="feature-visual training-visual demo-training-visual">
      <div className="training-visual-header">
        <strong>{session.title[locale]}</strong>
        <span>{session.duration[locale]} · {doneCount}/{exercises.length} {labels.complete}</span>
      </div>
      {exercises.map((exercise) => (
        <button
          type="button"
          className="training-row"
          data-done={exercise.done}
          key={exercise.id}
          onClick={() => toggle(exercise.id)}
          aria-pressed={exercise.done}
        >
          {exercise.done ? <CheckCircle2 aria-hidden="true" /> : <Circle aria-hidden="true" />}
          <strong>{exercise.name[locale]}</strong>
          <small>{exercise.sets}</small>
          <span className="training-row-status">{exercise.done ? labels.done : labels.pending}</span>
        </button>
      ))}
    </div>
  );
}
