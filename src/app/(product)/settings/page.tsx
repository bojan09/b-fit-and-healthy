import { AccountSettingsForm } from "@/features/account/account-settings-form";
import { DailyTargetsForm } from "@/features/account/daily-targets-form";
import { loadAccountSettings } from "@/features/account/repository";
import { requireUser } from "@/features/auth/session";
import { getLocale } from "@/lib/i18n/server";

export default async function SettingsPage() {
  const [user, locale] = await Promise.all([requireUser(), getLocale()]);
  const data = await loadAccountSettings(user.id);
  const copy =
    locale === "en"
      ? {
          eyebrow: "Your account",
          title: "Profile and preferences",
          intro:
            "Keep the details that shape daily guidance accurate and useful.",
          profile: "Profile",
          profileBody: "Choose how your name appears throughout the app.",
          preferences: "Preferences",
          preferencesBody:
            "Set the units and timezone used for tracking and summaries.",
          targets: "Daily targets",
          targetsBody: "Optional goals that power the progress bars on Today. Leave one empty to skip it.",
        }
      : {
          eyebrow: "Вашата сметка",
          title: "Профил и поставки",
          intro:
            "Чувајте ги точни деталите што го обликуваат дневното насочување.",
          profile: "Профил",
          profileBody: "Изберете како ќе се прикажува вашето име.",
          preferences: "Поставки",
          preferencesBody:
            "Поставете единици и временска зона за следење и прегледи.",
          targets: "Дневни цели",
          targetsBody: "Незадолжителни цели за лентите на напредок на Денес. Оставете празно за да прескокнете.",
        };

  return (
    <main className="product-page account-settings-page">
      <header className="product-page-heading">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
      </header>
      <div className="account-settings-layout">
        <div className="account-settings-copy">
          <section id="profile" aria-labelledby="profile-title">
            <h2 id="profile-title">{copy.profile}</h2>
            <p>{copy.profileBody}</p>
          </section>
          <section id="preferences" aria-labelledby="preferences-title">
            <h2 id="preferences-title">{copy.preferences}</h2>
            <p>{copy.preferencesBody}</p>
          </section>
          <section id="targets" aria-labelledby="targets-title">
            <h2 id="targets-title">{copy.targets}</h2>
            <p>{copy.targetsBody}</p>
          </section>
        </div>
        <AccountSettingsForm
          displayName={data.profile.display_name}
          units={data.settings.units}
          timezone={data.settings.timezone}
          locale={locale}
        />
        <DailyTargetsForm
          energyKcal={data.target?.energy_kcal ?? null}
          waterMl={data.target?.water_ml ?? null}
          proteinG={data.target?.protein_g === null || data.target?.protein_g === undefined ? null : Number(data.target.protein_g)}
          locale={locale}
        />
      </div>
    </main>
  );
}
