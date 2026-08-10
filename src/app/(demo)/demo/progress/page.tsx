import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
import { WeightChart } from "@/features/progress/weight-chart";
import { demoWeightPoints } from "@/features/demo/data";

export const metadata = publicMetadata(
  "Try the demo — Progress",
  "See how weight and consistency trends are tracked in B Fit & Healthy.",
  "/demo/progress"
);

export default async function DemoProgressPage() {
  const locale = await getLocale();
  const c = getPublicContent(locale).demo;

  return (
    <div className="demo-page">
      <header className="page-header">
        <p className="eyebrow">{c.nav.progress}</p>
        <h1>{c.progress.title}</h1>
        <p>{c.progress.subtitle}</p>
      </header>
      <WeightChart
        points={demoWeightPoints}
        unit={c.progress.unit}
        emptyLabel={c.progress.title}
        historyLabel={c.progress.history}
        locale={locale}
      />
    </div>
  );
}
