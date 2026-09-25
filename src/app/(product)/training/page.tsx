import Link from "next/link";
import { BookOpen, CalendarDays, ChevronRight, History, Play, Trophy } from "lucide-react";
import { requireUser } from "@/features/auth/session";
import { loadTraining } from "@/features/fitness/repository";
import { startSessionAction } from "@/features/fitness/actions";
import { getLocale } from "@/lib/i18n/server";
import { fitnessContent } from "@/features/fitness/content";
import { exercises } from "@/features/fitness/catalogue";
import { fitnessLabel } from "@/features/fitness/labels";
import { WorkoutIdeaLibrary } from "@/features/fitness/workout-idea-library";
import { workoutIdeas } from "@/features/fitness/workout-ideas";

export default async function TrainingPage() {
  const [user, locale] = await Promise.all([requireUser(), getLocale()]);
  const data = await loadTraining(user.id);
  const c = fitnessContent[locale];
  const next = data.plans.find((plan) => plan.status === "planned");
  const template = next ? data.templates.find((item) => item.id === next.template_id) : data.templates[0];
  const tools = [
    { href: "/training/planner", icon: CalendarDays, title: c.planner, copy: c.toolPlanner },
    { href: "/workouts", icon: Play, title: c.workouts, copy: c.toolWorkouts },
    { href: "/exercises", icon: BookOpen, title: c.exercises, copy: c.toolExercises(exercises.length) },
    { href: "/workout-history", icon: History, title: c.history, copy: c.toolHistory },
    { href: "/personal-records", icon: Trophy, title: c.records, copy: c.toolRecords },
  ];

  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div><p className="eyebrow">{c.trainingEyebrow}</p><h1>{c.training}</h1><p>{c.trainingIntro}</p></div>
        {data.active
          ? <Link className="ui-button ui-button-primary" href={`/session/${data.active.id}`}><Play />{c.resume}</Link>
          : <Link className="ui-button ui-button-secondary" href="/workouts/new">{c.create}</Link>}
      </header>
      {data.unavailable && <p className="inline-notice warning">{c.unavailable}</p>}
      <section className="training-hero">
        <div>
          <p className="eyebrow">{next ? c.nextOn(next.planned_on) : c.readyWhenYouAre}</p>
          <h2>{template?.name ?? c.chooseStart}</h2>
          <p>{template ? c.templateMeta(template.expected_duration_minutes, fitnessLabel(template.goal, locale)) : c.browseHint}</p>
        </div>
        {template
          ? <form action={startSessionAction}><input type="hidden" name="templateId" value={template.id} /><button className="ui-button ui-button-primary"><Play />{c.start}</button></form>
          : <Link className="ui-button ui-button-primary" href="#workout-ideas-title">{c.browseIdeas}</Link>}
      </section>
      <nav className="training-tool-rail" aria-label={c.toolsLabel}>
        {tools.map(({ href, icon: Icon, title, copy }) => (
          <Link href={href} key={href}>
            <Icon aria-hidden="true" />
            <span><strong>{title}</strong><small>{copy}</small></span>
            <ChevronRight aria-hidden="true" />
          </Link>
        ))}
      </nav>
      <WorkoutIdeaLibrary ideas={workoutIdeas} />
    </main>
  );
}
