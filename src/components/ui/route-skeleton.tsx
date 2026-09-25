"use client";

import { useOptionalLocale } from "@/components/providers/locale-provider";
import type { Locale } from "@/lib/i18n/config";

export type RouteSkeletonVariant =
  | "today"
  | "nutrition"
  | "recipes"
  | "training"
  | "progress"
  | "assistant";

const labels: Record<Locale, Record<RouteSkeletonVariant, string>> = {
  en: {
    today: "Loading today…",
    nutrition: "Loading nutrition…",
    recipes: "Loading recipes…",
    training: "Loading training…",
    progress: "Loading progress…",
    assistant: "Loading coach…",
  },
  mk: {
    today: "Се вчитува денес…",
    nutrition: "Се вчитува исхраната…",
    recipes: "Се вчитуваат рецептите…",
    training: "Се вчитува тренингот…",
    progress: "Се вчитува напредокот…",
    assistant: "Се вчитува тренерот…",
  },
};

export function RouteSkeleton({
  variant,
}: {
  variant: RouteSkeletonVariant;
}) {
  const locale = useOptionalLocale();
  return (
    <main
      className="route-skeleton product-page"
      id="main-content"
      tabIndex={-1}
      aria-busy="true"
      aria-live="polite"
      data-skeleton-variant={variant}
    >
      <p className="sr-only">{labels[locale][variant]}</p>
      <header className="skeleton-heading">
        <span className="skeleton-line short" />
        <span className="skeleton-line title" />
        <span className="skeleton-line medium" />
      </header>
      <div className="skeleton-layout">
        <section className="skeleton-panel skeleton-panel-primary">
          <span className="skeleton-line short" />
          <span className="skeleton-line title" />
          <span className="skeleton-line wide" />
        </section>
        <aside className="skeleton-panel">
          <span className="skeleton-line medium" />
          <span className="skeleton-line wide" />
        </aside>
        <section className="skeleton-panel skeleton-panel-list">
          <span className="skeleton-line medium" />
          <span className="skeleton-line wide" />
          <span className="skeleton-line wide" />
        </section>
      </div>
    </main>
  );
}
