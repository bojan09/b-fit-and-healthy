import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/features/auth/session";
import { getFitnessCopy } from "@/features/fitness/content";
import { fitnessLabel } from "@/features/fitness/labels";
import { loadTraining } from "@/features/fitness/repository";
import { getLocale } from "@/lib/i18n/server";

export default async function WorkoutsPage() {
  const [user, locale] = await Promise.all([requireUser(), getLocale()]);
  const data = await loadTraining(user.id);
  const c = getFitnessCopy(locale);

  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div>
          <p className="eyebrow">{c.workoutsEyebrow}</p>
          <h1>{c.workouts}</h1>
          <p>{c.workoutsIntro}</p>
        </div>
        <Link className="ui-button ui-button-primary" href="/workouts/new">
          <Plus aria-hidden="true" /> {c.create}
        </Link>
      </header>
      {data.unavailable && <p className="inline-notice warning">{c.unavailable}</p>}
      {data.templates.length ? (
        <div className="template-grid">
          {data.templates.map((item) => (
            <Link className="product-panel template-card" href={`/workouts/${item.id}`} key={item.id}>
              <p className="eyebrow">{fitnessLabel(item.goal, locale)}</p>
              <h2>{item.name}</h2>
              <p>{item.description || c.readyDescription}</p>
              <span>
                {item.expected_duration_minutes} {c.min} · {fitnessLabel(item.difficulty, locale)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="product-empty">
          <h2>{c.firstWorkoutTitle}</h2>
          <p>{c.firstWorkoutBody}</p>
          <Link className="ui-button ui-button-secondary" href="/workouts/new">{c.create}</Link>
        </div>
      )}
    </main>
  );
}
