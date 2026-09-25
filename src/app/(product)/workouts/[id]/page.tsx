import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarPlus, Play } from "lucide-react";
import { requireUser } from "@/features/auth/session";
import { deleteTemplateAction, scheduleWorkoutAction, startSessionAction } from "@/features/fitness/actions";
import { getFitnessCopy } from "@/features/fitness/content";
import { ActionErrorNotice } from "@/features/fitness/action-error-notice";
import { loadTemplate } from "@/features/fitness/repository";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { getLocale } from "@/lib/i18n/server";

export default async function WorkoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [user, locale, { id }, query] = await Promise.all([requireUser(), getLocale(), params, searchParams]);
  const data = await loadTemplate(user.id, id);
  const c = getFitnessCopy(locale);
  if (!data.template && !data.unavailable) notFound();
  if (!data.template) {
    return <main className="product-page"><p className="inline-notice warning">{c.storageUnavailable}</p></main>;
  }
  const titles = new Map(data.exerciseCatalogue.map((item) => [item.id, locale === "mk" ? item.title_mk : item.title_en]));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div>
          <p className="eyebrow">{c.templateEyebrow}</p>
          <h1>{data.template.name}</h1>
          <p>{data.template.description || c.templateFallback}</p>
        </div>
        <div className="heading-actions">
          <Link className="ui-button ui-button-secondary" href={`/workouts/${id}/edit`}>{c.edit}</Link>
          <form action={startSessionAction}>
            <input type="hidden" name="templateId" value={id} />
            <button className="ui-button ui-button-primary"><Play aria-hidden="true" /> {c.start}</button>
          </form>
        </div>
      </header>
      <ActionErrorNotice error={query.error} c={c} />
      <div className="workout-detail-grid">
        <section className="product-panel">
          <h2>{c.sessionPlan}</h2>
          <ol className="workout-sequence">
            {data.exercises.map((row) => (
              <li key={row.id}>
                <span>{row.position + 1}</span>
                <div>
                  <strong>{(row.exercise_id && titles.get(row.exercise_id)) || c.exercise}</strong>
                  <small>
                    {row.target_sets} {c.sets} · {row.rep_min ?? "—"}–{row.rep_max ?? "—"} {c.reps} · {row.rest_seconds}s {c.rest}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <aside>
          <form action={scheduleWorkoutAction} className="product-panel schedule-card">
            <CalendarPlus aria-hidden="true" />
            <h2>{c.putOnWeek}</h2>
            <input type="hidden" name="templateId" value={id} />
            <label>
              {c.date}
              <input type="date" name="plannedOn" required min={today} />
            </label>
            <button className="ui-button ui-button-secondary">{c.schedule}</button>
          </form>
          <form action={deleteTemplateAction}>
            <input type="hidden" name="id" value={id} />
            <ConfirmSubmitButton className="text-action danger-text" message={c.deleteConfirm}>
              {c.deleteTemplate}
            </ConfirmSubmitButton>
          </form>
        </aside>
      </div>
    </main>
  );
}
