import { notFound } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import { loadTemplate } from "@/features/fitness/repository";
import { updateTemplateAction } from "@/features/fitness/actions";
import { WorkoutBuilder } from "@/features/fitness/workout-builder";
import type { WorkoutPrescription } from "@/features/fitness/workout-ideas";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const data = await loadTemplate(user.id, id);
  if (!data.template) notFound();

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
          <p className="eyebrow">Workout editor</p>
          <h1>Edit {data.template.name}</h1>
          <p>
            Completed sessions remain unchanged when you refine this template.
          </p>
        </div>
      </header>
      <WorkoutBuilder
        action={updateTemplateAction}
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
