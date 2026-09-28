import { notFound } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import { loadTemplate } from "@/features/fitness/repository";
import { updateTemplateAction } from "@/features/fitness/actions";
import { getFitnessCopy } from "@/features/fitness/content";
import { ActionErrorNotice } from "@/features/fitness/action-error-notice";
import { WorkoutBuilder } from "@/features/fitness/workout-builder";
import type { WorkoutPrescription } from "@/features/fitness/workout-ideas";
import { getLocale } from "@/lib/i18n/server";

export default async function EditWorkoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [user, locale, { id }, query] = await Promise.all([requireUser(), getLocale(), params, searchParams]);
  const data = await loadTemplate(user.id, id);
  if (!data.template) notFound();
  const c = getFitnessCopy(locale);

  const byId = new Map(
    data.exerciseCatalogue.map((item) => [item.id, item.slug]),
  );
  const prescriptions = data.exercises.flatMap<WorkoutPrescription>((row) => {
    const exerciseSlug = row.exercise_id
      ? byId.get(row.exercise_id)
      : undefined;
    if (!exerciseSlug) return [];

    return [{
      exerciseSlug,
      sets: row.target_sets,
      repMin: row.rep_min,
      repMax: row.rep_max,
      durationSeconds: row.target_duration_seconds,
      restSeconds: row.rest_seconds,
    }];
  });

  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div>
          <p className="eyebrow">{c.editorEyebrow}</p>
          <h1>{c.editTitle(data.template.name)}</h1>
          <p>{c.editIntro}</p>
        </div>
      </header>
      <ActionErrorNotice error={query.error} c={c} />
      <WorkoutBuilder
        action={updateTemplateAction}
        locale={locale}
        initial={{
          id,
          name: data.template.name,
          description: data.template.description,
          duration: data.template.expected_duration_minutes,
          prescriptions,
        }}
      />
    </main>
  );
}
