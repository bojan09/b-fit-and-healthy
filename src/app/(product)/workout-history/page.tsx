import Link from "next/link";
import { ChevronRight, History } from "lucide-react";
import { requireUser } from "@/features/auth/session";
import { getFitnessCopy } from "@/features/fitness/content";
import { loadHistory } from "@/features/fitness/repository";
import { getLocale } from "@/lib/i18n/server";

export default async function HistoryPage() {
  const [user, locale] = await Promise.all([requireUser(), getLocale()]);
  const data = await loadHistory(user.id);
  const c = getFitnessCopy(locale);

  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div>
          <p className="eyebrow">{c.historyEyebrow}</p>
          <h1>{c.history}</h1>
          <p>{c.historyIntro}</p>
        </div>
      </header>
      {data.unavailable && <p className="inline-notice warning">{c.storageUnavailable}</p>}
      {data.sessions.length ? (
        <div className="history-list">
          {data.sessions.map((session) => (
            <Link className="product-panel history-row" href={`/workout-history/${session.id}`} key={session.id}>
              <History aria-hidden="true" />
              <div>
                <strong>{session.name_snapshot}</strong>
                <span>
                  {session.finished_at?.slice(0, 10)} · {session.duration_seconds ? Math.round(session.duration_seconds / 60) : 0} {c.min}
                </span>
              </div>
              <ChevronRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="product-empty">
          <History aria-hidden="true" />
          <h2>{c.noHistoryTitle}</h2>
          <p>{c.noHistoryBody}</p>
          <Link className="ui-button ui-button-secondary" href="/training">{c.goToTraining}</Link>
        </div>
      )}
    </main>
  );
}
