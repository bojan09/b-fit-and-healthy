import { requireUser } from "@/features/auth/session";
import { getFitnessCopy } from "@/features/fitness/content";
import { derivePersonalRecords } from "@/features/fitness/domain";
import { RecordSummary } from "@/features/fitness/record-summary";
import { loadRecordSessions } from "@/features/fitness/repository";
import { loadTrackingContext } from "@/features/tracking/repository";
import { getLocale } from "@/lib/i18n/server";

export default async function RecordsPage() {
  const [user, locale] = await Promise.all([requireUser(), getLocale()]);
  const [sessions, context] = await Promise.all([loadRecordSessions(user.id, locale), loadTrackingContext(user.id)]);
  const records = derivePersonalRecords(sessions);
  const c = getFitnessCopy(locale);

  return (
    <main className="product-page fitness-page">
      <header className="product-page-heading">
        <div>
          <p className="eyebrow">{c.recordsEyebrow}</p>
          <h1>{c.records}</h1>
          <p>{c.recordsIntro}</p>
        </div>
      </header>
      <RecordSummary records={records} units={context.settings.units} locale={locale} />
    </main>
  );
}
