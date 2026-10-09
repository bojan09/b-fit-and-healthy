import Link from "next/link";
import { Check, Circle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export type SetupSignals = {
  hasTargets: boolean;
  hasHabits: boolean;
  hasMeals: boolean;
  hasGoals: boolean;
};

const copy = {
  en: {
    title: "Get set up",
    intro: "A few quick steps make Today useful.",
    done: "Done",
    steps: {
      targets: "Set your daily targets",
      habits: "Add a first habit",
      meals: "Log a meal",
      goals: "Add a goal",
    },
  },
  mk: {
    title: "Подготви се",
    intro: "Неколку брзи чекори го прават Денес покорисен.",
    done: "Готово",
    steps: {
      targets: "Постави дневни цели",
      habits: "Додај прва навика",
      meals: "Запиши оброк",
      goals: "Додај цел",
    },
  },
} as const;

const hrefs = {
  targets: "/settings#targets",
  habits: "/habits",
  meals: "/nutrition",
  goals: "/goals",
} as const;

/** Guided first steps. Renders nothing once every step is done, so it never nags returning users. */
export function SetupChecklist({ locale, signals }: { locale: Locale; signals: SetupSignals }) {
  const t = copy[locale];
  const items = [
    { key: "targets", done: signals.hasTargets },
    { key: "habits", done: signals.hasHabits },
    { key: "meals", done: signals.hasMeals },
    { key: "goals", done: signals.hasGoals },
  ] as const;
  if (items.every((item) => item.done)) return null;
  const completed = items.filter((item) => item.done).length;

  return (
    <section className="tracking-key setup-checklist" aria-labelledby="setup-checklist-title">
      <h2 id="setup-checklist-title">{t.title} <span>{completed}/{items.length}</span></h2>
      <p>{t.intro}</p>
      <ul>
        {items.map(({ key, done }) => (
          <li key={key} data-done={done || undefined}>
            {done ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
            {done ? (
              <span>{t.steps[key]} <span className="sr-only">— {t.done}</span></span>
            ) : (
              <Link href={hrefs[key]}>{t.steps[key]}</Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
