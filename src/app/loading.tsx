export default function Loading() {
  // The root layout is static (no cookie read), so the status text names both languages.
  return (
    <main className="centered-state" aria-live="polite" aria-busy="true">
      <div className="loading-mark" aria-hidden="true" />
      <p>B Fit &amp; Healthy…</p>
      <span className="sr-only">Loading… / Се вчитува…</span>
    </main>
  );
}
