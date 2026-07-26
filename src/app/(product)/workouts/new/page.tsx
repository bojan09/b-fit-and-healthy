import { WorkoutBuilder } from "@/features/fitness/workout-builder";
import { createTemplateAction } from "@/features/fitness/actions";
import { getWorkoutIdea } from "@/features/fitness/workout-ideas";

export default async function NewWorkoutPage({ searchParams }: { searchParams: Promise<{ idea?: string }> }) {
  const query = await searchParams;
  const idea = getWorkoutIdea(query.idea);
  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div>
          <p className="eyebrow">{idea ? "Adapt a starting idea" : "Workout builder"}</p>
          <h1>{idea?.title ?? "Create a workout"}</h1>
          <p>{idea?.summary ?? "Choose a clear sequence now so training feels simpler later."}</p>
        </div>
      </header>
      <WorkoutBuilder
        action={createTemplateAction}
        initial={idea ? {
          name: idea.title,
          description: idea.summary,
          duration: idea.durationMinutes,
          prescriptions: idea.exercises,
        } : undefined}
      />
    </main>
  );
}
