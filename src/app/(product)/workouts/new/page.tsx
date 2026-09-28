import { WorkoutBuilder } from "@/features/fitness/workout-builder";
import { createTemplateAction } from "@/features/fitness/actions";
import { getFitnessCopy } from "@/features/fitness/content";
import { ActionErrorNotice } from "@/features/fitness/action-error-notice";
import { getWorkoutIdea, ideaCopy } from "@/features/fitness/workout-ideas";
import { getLocale } from "@/lib/i18n/server";

export default async function NewWorkoutPage({ searchParams }: { searchParams: Promise<{ idea?: string; error?: string }> }) {
  const [query, locale] = await Promise.all([searchParams, getLocale()]);
  const idea = getWorkoutIdea(query.idea);
  const c = getFitnessCopy(locale);
  const text = idea ? ideaCopy(idea, locale) : null;
  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div>
          <p className="eyebrow">{idea ? c.adaptIdea : c.builderEyebrow}</p>
          <h1>{text?.title ?? c.createTitle}</h1>
          <p>{text?.summary ?? c.createIntro}</p>
        </div>
      </header>
      <ActionErrorNotice error={query.error} c={c} />
      <WorkoutBuilder
        action={createTemplateAction}
        locale={locale}
        initial={idea && text ? {
          name: text.title,
          description: text.summary,
          duration: idea.durationMinutes,
          prescriptions: idea.exercises,
        } : undefined}
      />
    </main>
  );
}
