import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
import { DemoWorkoutSession } from "@/features/demo/demo-workout-session";
import { demoWorkoutSession } from "@/features/demo/data";

export const metadata = publicMetadata(
  "Try the demo — Training",
  "See how workout sessions are planned and tracked in B Fit & Healthy.",
  "/demo/training"
);

export default async function DemoTrainingPage() {
  const locale = await getLocale();
  const c = getPublicContent(locale).demo;

  return (
    <div className="demo-page">
      <header className="page-header">
        <p className="eyebrow">{c.nav.training}</p>
        <h1>{demoWorkoutSession.title[locale]}</h1>
        <p>{c.training.subtitle}</p>
      </header>
      <DemoWorkoutSession
        session={demoWorkoutSession}
        locale={locale}
        labels={{ done: c.training.done, pending: c.training.pending, complete: c.training.complete }}
      />
    </div>
  );
}
