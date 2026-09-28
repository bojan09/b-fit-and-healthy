import { Award, BarChart3, Dumbbell, Repeat2 } from "lucide-react";
import { getFitnessCopy } from "@/features/fitness/content";
import { kgToDisplayLoad, type PersonalRecord, type UnitSystem } from "@/features/fitness/domain";
import type { Locale } from "@/lib/i18n/config";

export function RecordSummary({
  records,
  units,
  locale = "en",
}: {
  records: PersonalRecord[];
  units: UnitSystem;
  locale?: Locale;
}) {
  const c = getFitnessCopy(locale);
  if (!records.length) {
    return (
      <div className="product-empty">
        <Award aria-hidden="true" />
        <h2>{c.noRecordsTitle}</h2>
        <p>{c.noRecordsBody}</p>
      </div>
    );
  }
  const unit = units === "imperial" ? "lb" : "kg";

  return (
    <div className="record-grid">
      {records.map((record) => (
        <article className="product-panel record-card" key={record.exerciseId}>
          <p className="eyebrow">{c.personalBests}</p>
          <h2>{record.exerciseName}</h2>
          <dl>
            <div><Dumbbell aria-hidden="true" /><dt>{c.heaviestLoad}</dt><dd>{kgToDisplayLoad(record.heaviestLoadKg, units)} {unit}</dd></div>
            <div><Repeat2 aria-hidden="true" /><dt>{c.mostReps}</dt><dd>{record.maxReps} {c.reps}</dd></div>
            <div><BarChart3 aria-hidden="true" /><dt>{c.bestSetVolume}</dt><dd>{kgToDisplayLoad(record.bestSetVolumeKg, units)} {unit}</dd></div>
            <div><Award aria-hidden="true" /><dt>{c.bestSessionVolume}</dt><dd>{kgToDisplayLoad(record.bestSessionVolumeKg, units)} {unit}</dd></div>
          </dl>
          <time dateTime={record.achievedAt}>{c.latestAchievement(record.achievedAt.slice(0, 10))}</time>
        </article>
      ))}
    </div>
  );
}
