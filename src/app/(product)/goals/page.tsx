import Link from "next/link";
import { Flag } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUser } from "@/features/auth/session";
import { GoalActions } from "@/features/tracking/goal-actions";
import { getTrackingContent } from "@/features/tracking/content";
import { loadProgressData } from "@/features/tracking/repository";
import { GoalForm } from "@/features/tracking/tracking-form";
import { getLocale } from "@/lib/i18n/server";

export default async function GoalsPage() {
  const user = await requireUser();
  const [data, locale] = await Promise.all([
    loadProgressData(user.id),
    getLocale(),
  ]);
  const c = getTrackingContent(locale);

  return (
    <main id="main-content" className="shell tracking-page">
      <header className="tracking-page-header">
        <div>
          <p className="eyebrow">{c.nav.today}</p>
          <h1>{c.pages.goals}</h1>
          <p>{c.pages.goalsIntro}</p>
        </div>
      </header>

      {data.goals.length ? (
        <div className="tracking-records">
          {data.goals.map((goal) => (
            <article className="tracking-record" key={goal.id}>
              <div>
                <span className={`status-pill ${goal.status}`}>
                  {c.status[goal.status]}
                </span>
                <h2>{goal.kind}</h2>
                <p>
                  {goal.target
                    ? `${goal.target}${goal.unit ? ` ${goal.unit}` : ""}`
                    : locale === "mk"
                      ? "Цел без бројчана вредност"
                      : "Direction goal without a numeric target"}
                  {goal.ends_on ? ` · ${goal.ends_on}` : ""}
                </p>
              </div>
              <GoalActions
                id={goal.id}
                status={goal.status}
                labels={c.forms}
              />
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Flag}
          title={c.empty.goals}
          description={
            locale === "mk"
              ? "Постави една насока што ќе ти помогне да го избереш следниот чекор."
              : "Set one direction that helps you choose the next useful step."
          }
          action={
            <Link className="ui-button ui-button-secondary" href="#new-goal">
              {c.forms.addGoal}
            </Link>
          }
        />
      )}

      <section className="tracking-form-panel" id="new-goal">
        <h2>{c.forms.addGoal}</h2>
        <GoalForm labels={c.forms} />
      </section>
    </main>
  );
}
