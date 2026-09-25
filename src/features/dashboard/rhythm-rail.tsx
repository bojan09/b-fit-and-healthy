import Link from "next/link";
import { Activity, Check, Circle, Droplets, Minus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

type EmptyRhythm = {
  title: string;
  description: string;
  href: string;
  action: string;
};

export function RhythmRail({
  title,
  waterTitle,
  waterEntries,
  habits,
  statusLabels,
  empty,
  noActivity = "No tracked activity yet today.",
}: {
  noActivity?: string;
  title: string;
  waterTitle: string;
  waterEntries: Array<{ id: string; amount: string; time: string }>;
  habits: Array<{
    id: string;
    title: string;
    status: "complete" | "skipped" | null;
  }>;
  statusLabels: {
    complete: string;
    skipped: string;
    remaining: string;
  };
  empty?: EmptyRhythm;
}) {
  const items = [
    ...waterEntries.map((entry) => ({
      ...entry,
      title: waterTitle,
      detail: `${entry.amount} · ${entry.time}`,
      status: "complete" as const,
    })),
    ...habits.map((habit) => ({
      ...habit,
      detail:
        habit.status === "complete"
          ? statusLabels.complete
          : habit.status === "skipped"
            ? statusLabels.skipped
            : statusLabels.remaining,
    })),
  ];

  return (
    <section className="rhythm-section" aria-labelledby="rhythm-title">
      <h2 id="rhythm-title">{title}</h2>
      {items.length ? (
        <ol className="rhythm-rail">
          {items.map((item) => {
            const Icon =
              item.status === "complete"
                ? Check
                : item.status === "skipped"
                  ? Minus
                  : Circle;
            return (
              <li
                key={`${item.id}-${item.title}`}
                data-status={item.status ?? "remaining"}
              >
                <span className="rhythm-mark">
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
                {"amount" in item && <Droplets aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      ) : empty ? (
        <EmptyState
          icon={Activity}
          title={empty.title}
          description={empty.description}
          action={
            <Link className="text-link" href={empty.href}>
              {empty.action}
            </Link>
          }
        />
      ) : (
        <p className="tracking-empty">{noActivity}</p>
      )}
    </section>
  );
}
