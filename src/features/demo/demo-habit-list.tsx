"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { DemoHabit } from "@/features/demo/data";

export function DemoHabitList({
  habits,
  locale,
  title
}: {
  habits: DemoHabit[];
  locale: Locale;
  title: string;
}) {
  const [state, setState] = useState(habits);
  const toggle = (id: string) =>
    setState((current) =>
      current.map((habit) => (habit.id === id ? { ...habit, done: !habit.done } : habit))
    );

  return (
    <section className="demo-habit-list" aria-labelledby="demo-habits-title">
      <h2 id="demo-habits-title">{title}</h2>
      <ul>
        {state.map((habit) => (
          <li key={habit.id}>
            <button type="button" onClick={() => toggle(habit.id)} aria-pressed={habit.done}>
              {habit.done ? <CheckCircle2 aria-hidden="true" /> : <Circle aria-hidden="true" />}
              <span>{habit.title[locale]}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
