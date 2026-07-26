import Link from "next/link";
import { Repeat2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUser } from "@/features/auth/session";
import { HabitActions } from "@/features/tracking/habit-actions";
import { getTrackingContent } from "@/features/tracking/content";
import {
  loadTodayData,
  loadTrackingContext,
} from "@/features/tracking/repository";
import { HabitForm } from "@/features/tracking/tracking-form";
import { getLocale } from "@/lib/i18n/server";

export default async function HabitsPage() {
  const user = await requireUser();
  const context = await loadTrackingContext(user.id);
  const [data, locale] = await Promise.all([
    loadTodayData(user.id, context.settings),
    getLocale(),
  ]);
  const c = getTrackingContent(locale);
  const statuses = new Map(
    data.checkins.map((item) => [item.habit_id, item.status]),
  );

  return (
    <main id="main-content" className="shell tracking-page">
      <header className="tracking-page-header">
        <div>
          <p className="eyebrow">{c.nav.today}</p>
          <h1>{c.pages.habits}</h1>
          <p>{c.pages.habitsIntro}</p>
        </div>
      </header>

      {data.habits.length ? (
        <div className="tracking-records">
          {data.habits.map((habit) => {
            const status = statuses.get(habit.id) ?? null;
            return (
              <article className="tracking-record" key={habit.id}>
                <div>
                  <span className={`status-pill ${status ?? "remaining"}`}>
                    {status === "complete"
                      ? c.status.complete
                      : status === "skipped"
                        ? c.status.skipped
                        : c.today.remaining}
                  </span>
                  <h2>{habit.title}</h2>
                </div>
                <HabitActions
                  id={habit.id}
                  date={data.date}
                  status={status}
                  labels={c.forms}
                />
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Repeat2}
          title={c.empty.habits}
          description={
            locale === "mk"
              ? "Почни со една навика што реално можеш да ја повторуваш."
              : "Begin with one action you can realistically repeat."
          }
          action={
            <Link className="ui-button ui-button-secondary" href="#new-habit">
              {c.forms.addHabit}
            </Link>
          }
        />
      )}

      <section className="tracking-form-panel" id="new-habit">
        <h2>{c.forms.addHabit}</h2>
        <HabitForm labels={c.forms} />
      </section>
    </main>
  );
}
