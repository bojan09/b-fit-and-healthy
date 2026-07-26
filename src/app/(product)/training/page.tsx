import Link from "next/link";
import { BookOpen, CalendarDays, ChevronRight, History, Play, Trophy } from "lucide-react";
import { requireUser } from "@/features/auth/session";
import { loadTraining } from "@/features/fitness/repository";
import { startSessionAction } from "@/features/fitness/actions";
import { getLocale } from "@/lib/i18n/server";
import { fitnessContent } from "@/features/fitness/content";
import { WorkoutIdeaLibrary } from "@/features/fitness/workout-idea-library";
import { workoutIdeas } from "@/features/fitness/workout-ideas";

export default async function TrainingPage() {
  const [user, locale] = await Promise.all([requireUser(), getLocale()]);
  const data = await loadTraining(user.id);
  const c = fitnessContent[locale];
  const next = data.plans.find((plan) => plan.status === "planned");
  const template = next ? data.templates.find((item) => item.id === next.template_id) : data.templates[0];
  const tools = [
    { href: "/training/planner", icon: CalendarDays, title: c.planner, copy: "See and shape the next seven days" },
    { href: "/workouts", icon: Play, title: c.workouts, copy: "Build and reuse your routines" },
    { href: "/exercises", icon: BookOpen, title: c.exercises, copy: `Explore ${30} guided movements` },
    { href: "/workout-history", icon: History, title: c.history, copy: "Review completed work" },
    { href: "/personal-records", icon: Trophy, title: c.records, copy: "See genuine bests" },
  ];

  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div><p className="eyebrow">Move with direction</p><h1>{c.training}</h1><p>{c.trainingIntro}</p></div>
        {data.active
          ? <Link className="ui-button ui-button-primary" href={`/session/${data.active.id}`}><Play />{c.resume}</Link>
          : <Link className="ui-button ui-button-secondary" href="/workouts/new">{c.create}</Link>}
      </header>
      {data.unavailable && <p className="inline-notice warning">{c.unavailable}</p>}
      <section className="training-hero">
        <div>
          <p className="eyebrow">{next ? `Next · ${next.planned_on}` : "Ready when you are"}</p>
          <h2>{template?.name ?? "Choose a useful starting point"}</h2>
          <p>{template ? `${template.expected_duration_minutes} minutes · ${template.goal}` : "Browse a complete idea, adapt it, and save only what fits."}</p>
        </div>
        {template
          ? <form action={startSessionAction}><input type="hidden" name="templateId" value={template.id} /><button className="ui-button ui-button-primary"><Play />{c.start}</button></form>
          : <Link className="ui-button ui-button-primary" href="#workout-ideas-title">Browse ideas</Link>}
      </section>
      <nav className="training-tool-rail" aria-label="Training tools">
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
