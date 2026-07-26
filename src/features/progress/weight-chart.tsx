import Link from "next/link";
import { Scale } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

type EmptyAction = { href: string; label: string };

export function WeightChart({
  points,
  unit,
  emptyLabel,
  historyLabel,
  locale,
  emptyAction,
}: {
  points: Array<{ date: string; value: number }>;
  unit: string;
  emptyLabel: string;
  historyLabel: string;
  locale: "en" | "mk";
  emptyAction?: EmptyAction;
}) {
  const language = locale === "mk" ? "mk-MK" : "en-GB";
  const ordered = [...points].sort((a, b) => a.date.localeCompare(b.date));

  if (ordered.length < 2) {
    const description =
      ordered.length === 1
        ? `${ordered[0].value.toLocaleString(language, {
            maximumFractionDigits: 1,
          })} ${unit}`
        : locale === "mk"
          ? "Додај прво мерење за да поставиш приватна почетна точка."
          : "Add a first measurement to establish a private baseline.";
    return (
      <EmptyState
        icon={Scale}
        title={emptyLabel}
        description={description}
        action={
          emptyAction ? (
            <Link className="ui-button ui-button-secondary" href={emptyAction.href}>
              {emptyAction.label}
            </Link>
          ) : undefined
        }
      />
    );
  }

  const values = ordered.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coordinates = ordered
    .map(
      (point, index) =>
        `${10 + (index / (ordered.length - 1)) * 80},${85 - ((point.value - min) / range) * 70}`,
    )
    .join(" ");

  return (
    <div className="weight-visual">
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={`Weight trend: ${ordered[0].value} to ${ordered.at(-1)?.value} ${unit}`}
        preserveAspectRatio="none"
      >
        <line x1="10" y1="85" x2="90" y2="85" />
        <polyline points={coordinates} />
      </svg>
      <div>
        <h3>{historyLabel}</h3>
        <ul className="measurement-list">
          {[...ordered].reverse().map((point) => (
            <li key={point.date}>
              <time dateTime={point.date}>
                {new Intl.DateTimeFormat(language, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(new Date(`${point.date}T12:00:00`))}
              </time>
              <strong>
                {point.value.toLocaleString(language, {
                  maximumFractionDigits: 1,
                })}{" "}
                {unit}
              </strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
