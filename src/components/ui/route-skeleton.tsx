export type RouteSkeletonVariant =
  | "today"
  | "nutrition"
  | "recipes"
  | "training"
  | "progress"
  | "assistant";

const labels: Record<RouteSkeletonVariant, string> = {
  today: "Loading today…",
  nutrition: "Loading nutrition…",
  recipes: "Loading recipes…",
  training: "Loading training…",
  progress: "Loading progress…",
  assistant: "Loading coach…",
};

export function RouteSkeleton({
  variant,
}: {
  variant: RouteSkeletonVariant;
}) {
  return (
    <main
      className="route-skeleton product-page"
      id="main-content"
      tabIndex={-1}
      aria-busy="true"
      aria-live="polite"
      data-skeleton-variant={variant}
    >
      <p className="sr-only">{labels[variant]}</p>
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
