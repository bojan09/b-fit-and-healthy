import { getLocale } from "@/lib/i18n/server";
import { getPublicContent } from "@/lib/i18n/public-content";
import { publicMetadata } from "@/lib/seo/metadata";
import { DailyBalance } from "@/features/dashboard/daily-balance";
import { DemoHabitList } from "@/features/demo/demo-habit-list";
import { demoHabits } from "@/features/demo/data";

export const metadata = publicMetadata(
  "Try the demo — Today",
  "See what a day of tracking looks like in B Fit & Healthy.",
  "/demo/today"
);

export default async function DemoTodayPage() {
  const locale = await getLocale();
  const c = getPublicContent(locale).demo;
  const energyLabel = locale === "mk" ? "Енергија" : "Energy";
  const waterLabel = locale === "mk" ? "Вода" : "Water";

  return (
    <div className="demo-page">
      <header className="page-header">
        <p className="eyebrow">{c.nav.today}</p>
        <h1>{c.today.greeting}</h1>
        <p>{c.today.subtitle}</p>
      </header>
      <div className="demo-today-layout">
        <DailyBalance
          title={c.today.balanceTitle}
          rows={[
            { label: energyLabel, value: "1,570 / 2,200 kcal", ratio: 0.71 },
            { label: waterLabel, value: "1.4 / 2.5 L", ratio: 0.56 },
            { label: locale === "mk" ? "Навики" : "Habits", value: "2 / 4", ratio: 0.5 }
          ]}
        />
        <DemoHabitList habits={demoHabits} locale={locale} title={c.today.habitsTitle} />
      </div>
    </div>
  );
}
