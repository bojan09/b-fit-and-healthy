import { notFound } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import { getFitnessCopy } from "@/features/fitness/content";
import { buildSessionSummary } from "@/features/fitness/domain";
import { loadSession } from "@/features/fitness/repository";
import { getLocale } from "@/lib/i18n/server";

export default async function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [user, locale, { id }] = await Promise.all([requireUser(), getLocale(), params]);
  const data = await loadSession(user.id, id);
  if (!data.session) notFound();
  const c = getFitnessCopy(locale);
  const summary = buildSessionSummary(data.sets.map((set) => ({
    exerciseId: set.session_exercise_id,
    reps: set.reps,
    loadKg: set.load_kg,
    isComplete: set.is_complete,
    isBodyweight: set.is_bodyweight,
  })));

  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div>
          <p className="eyebrow">{c.sessionRecord(data.session.finished_at?.slice(0, 10) ?? "")}</p>
          <h1>{data.session.name_snapshot}</h1>
          <p>{c.sessionSummary(summary.completedSets, summary.totalReps, summary.volumeKg)}</p>
        </div>
      </header>
      <div className="history-detail">
        {data.exercises.map((exercise) => (
          <section className="product-panel" key={exercise.id}>
            <h2>{locale === "mk" ? exercise.name_mk_snapshot : exercise.name_en_snapshot}</h2>
            <div className="completed-sets">
              {data.sets
                .filter((set) => set.session_exercise_id === exercise.id && set.is_complete)
                .map((set) => (
                  <div key={set.id}>
                    <span>{c.set} {set.position + 1}</span>
                    <strong>{set.is_bodyweight ? c.bodyweight : `${set.load_kg ?? 0} kg`} × {set.reps ?? 0}</strong>
                    {set.rpe && <small>RPE {set.rpe}</small>}
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
