import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { requireUser } from "@/features/auth/session";
import { scheduleWorkoutAction, updatePlanStatusAction } from "@/features/fitness/actions";
import { getFitnessCopy } from "@/features/fitness/content";
import { trainingWeekDates } from "@/features/fitness/domain";
import { loadPlanner, loadTraining } from "@/features/fitness/repository";
import { getLocale } from "@/lib/i18n/server";

export default async function TrainingPlannerPage() {
  const [user, locale] = await Promise.all([requireUser(), getLocale()]);
  const c = getFitnessCopy(locale);
  const days = trainingWeekDates(new Date());
  const [data, training] = await Promise.all([
    loadPlanner(user.id, days[0], days[6]),
    loadTraining(user.id),
  ]);
  const weekday = new Intl.DateTimeFormat(locale === "mk" ? "mk-MK" : "en", { weekday: "short", timeZone: "UTC" });
  const templateName = new Map(training.templates.map((item) => [item.id, item.name]));

  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div>
          <p className="eyebrow">{c.plannerEyebrow}</p>
          <h1>{c.plannerTitle}</h1>
          <p>{c.plannerIntro}</p>
        </div>
        <Link className="ui-button ui-button-secondary" href="/workouts">{c.manageWorkouts}</Link>
      </header>
      <div className="planner-layout">
        <section className="week-rail">
          {days.map((day) => {
            const plans = data.plans.filter((item) => item.planned_on === day);
            return (
              <article className="planner-day" key={day}>
                <time dateTime={day}>
                  <strong>{weekday.format(new Date(`${day}T12:00:00Z`))}</strong>
                  <span>{day.slice(5)}</span>
                </time>
                <div>
                  {plans.length ? plans.map((plan) => (
                    <div className={`planned-workout ${plan.status}`} key={plan.id}>
                      <strong>{templateName.get(plan.template_id) ?? c.workout}</strong>
                      <span>{plan.status === "skipped" ? c.skipped : c.planned}</span>
                      <form action={updatePlanStatusAction}>
                        <input type="hidden" name="id" value={plan.id} />
                        <input type="hidden" name="status" value={plan.status === "skipped" ? "planned" : "skipped"} />
                        <button className="text-action">{plan.status === "skipped" ? c.restore : c.skip}</button>
                      </form>
                    </div>
                  )) : <span className="rest-day">{c.openDay}</span>}
                </div>
              </article>
            );
          })}
        </section>
        <aside className="product-panel quick-schedule">
          <CalendarPlus aria-hidden="true" />
          <h2>{c.scheduleWorkout}</h2>
          {training.templates.length ? (
            <form action={scheduleWorkoutAction}>
              <label>
                {c.workout}
                <select name="templateId">
                  {training.templates.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
                </select>
              </label>
              <label>
                {c.date}
                <input name="plannedOn" type="date" min={days[0]} max={days[6]} required />
              </label>
              <button className="ui-button ui-button-primary">{c.addToWeek}</button>
            </form>
          ) : (
            <p>
              {c.createBeforeScheduling} <Link className="text-link" href="/workouts/new">{c.create}</Link>
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
