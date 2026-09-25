import { notFound } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import {
  addSetAction,
  discardSessionAction,
  finishSessionAction,
  removeSetAction,
  updateSetAction,
} from "@/features/fitness/actions";
import { getFitnessCopy } from "@/features/fitness/content";
import { loadSession } from "@/features/fitness/repository";
import { SessionLogger } from "@/features/fitness/session-logger";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { getLocale } from "@/lib/i18n/server";

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [user, locale, { id }, query] = await Promise.all([requireUser(), getLocale(), params, searchParams]);
  const data = await loadSession(user.id, id);
  const c = getFitnessCopy(locale);
  if (!data.session && !data.unavailable) notFound();
  if (!data.session) {
    return <main className="product-page"><p className="inline-notice warning">{c.storageUnavailable}</p></main>;
  }
  const rows = data.exercises.map((exercise) => ({
    id: exercise.id,
    name: locale === "mk" ? exercise.name_mk_snapshot : exercise.name_en_snapshot,
    target: `${exercise.target_sets} × ${exercise.rep_min ?? "—"}–${exercise.rep_max ?? "—"}`,
    sets: data.sets
      .filter((set) => set.session_exercise_id === exercise.id)
      .map((set) => ({
        id: set.id,
        reps: set.reps,
        loadKg: set.load_kg,
        isComplete: set.is_complete,
        isBodyweight: set.is_bodyweight,
      })),
  }));
  const startedAt = new Intl.DateTimeFormat(locale === "mk" ? "mk-MK" : "en", { hour: "numeric", minute: "2-digit" })
    .format(new Date(data.session.started_at));

  return (
    <main className="product-page session-page">
      <header className="session-header">
        <div>
          <p className="eyebrow">{c.activeSession}</p>
          <h1>{data.session.name_snapshot}</h1>
          <p>{c.started(startedAt)}</p>
        </div>
        <form action={discardSessionAction}>
          <input type="hidden" name="id" value={id} />
          <ConfirmSubmitButton className="text-action danger-text" message={c.discardConfirm}>{c.discard}</ConfirmSubmitButton>
        </form>
      </header>
      {query.error === "no-sets" && <p className="inline-notice warning" role="alert">{c.needOneSet}</p>}
      {query.error === "storage" && <p className="inline-notice warning" role="alert">{c.errorStorage}</p>}
      <SessionLogger
        sessionId={id}
        exercises={rows}
        locale={locale}
        updateAction={updateSetAction}
        addAction={addSetAction}
        removeAction={removeSetAction}
        finishAction={finishSessionAction}
      />
    </main>
  );
}
