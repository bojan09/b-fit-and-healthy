import type { MediaFallbackKind } from "@/features/media/catalogue-media";

type CatalogueImageFallbackProps = {
  kind: MediaFallbackKind;
  className?: string;
};

export function CatalogueImageFallback({ kind, className }: CatalogueImageFallbackProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      data-fallback-kind={kind}
      data-testid="catalogue-image-fallback"
      role="presentation"
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, var(--surface, #edf2eb), var(--muted, #d6e0d3))",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <svg aria-hidden="true" fill="none" height="56" viewBox="0 0 64 64" width="56">
        <circle cx="32" cy="32" fill="currentColor" fillOpacity="0.12" r="28" />
        <path d="M18 42 29 30l8 8 9-12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <circle cx="25" cy="23" fill="currentColor" r="4" />
      </svg>
    </div>
  );
}
