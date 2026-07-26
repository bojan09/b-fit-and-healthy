import { WeightChart } from "@/features/progress/weight-chart";
import { requireUser } from "@/features/auth/session";
import { getTrackingContent } from "@/features/tracking/content";
import { kgToLb, localDateInTimezone } from "@/features/tracking/domain";
import {
  loadProgressData,
  loadTrackingContext,
} from "@/features/tracking/repository";
import { WeightForm } from "@/features/tracking/tracking-form";
import { getLocale } from "@/lib/i18n/server";

export default async function ProgressPage() {
  const user = await requireUser();
  const [data, context, locale] = await Promise.all([
    loadProgressData(user.id),
    loadTrackingContext(user.id),
    getLocale(),
  ]);
  const c = getTrackingContent(locale);
  const complete = data.checkins.filter(
    (item) => item.status === "complete",
  ).length;
  const expected = data.habits.length * 7;
  const consistency = expected
    ? Math.round((complete / expected) * 100)
    : null;
  const unit = context.settings.units === "metric" ? "kg" : "lb";
  const points = data.measurements.map((item) => ({
    date: item.recorded_on,
    value: Number(
      context.settings.units === "metric"
        ? item.weight_kg
        : kgToLb(Number(item.weight_kg)).toFixed(1),
    ),
  }));

  return (
    <main id="main-content" className="shell tracking-page">
      <header className="tracking-page-header">
        <div>
          <p className="eyebrow">{c.nav.today}</p>
          <h1>{c.pages.progress}</h1>
          <p>{c.pages.progressIntro}</p>
        </div>
      </header>

      <div className="progress-summary">
        <article>
          <span>{c.pages.consistency}</span>
          <strong>{consistency === null ? "—" : `${consistency}%`}</strong>
          <p>
            {data.habits.length
              ? `${complete} ${locale === "mk" ? "завршени проверки" : "completed check-ins"}`
              : c.empty.habits}
          </p>
        </article>
        <article>
          <span>{c.nav.goals}</span>
          <strong>
            {data.goals.filter((goal) => goal.status === "active").length}
          </strong>
          <p>{c.status.active}</p>
        </article>
      </div>

      <section className="progress-panel">
        <h2>{c.pages.history}</h2>
        <WeightChart
          points={points}
          unit={unit}
          emptyLabel={c.empty.weight}
          historyLabel={c.pages.history}
          locale={locale}
          emptyAction={{ href: "#weight", label: c.forms.saveWeight }}
        />
      </section>

      <section className="tracking-form-panel" id="weight">
        <h2>{c.forms.saveWeight}</h2>
        <WeightForm
          labels={c.forms}
          units={context.settings.units}
          date={localDateInTimezone(context.settings.timezone)}
        />
      </section>
    </main>
  );
}
