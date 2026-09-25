import type { FitnessCopy } from "@/features/fitness/content";

/** Renders the `?error=` code that fitness actions redirect with. */
export function ActionErrorNotice({ error, c }: { error?: string; c: FitnessCopy }) {
  if (error !== "invalid" && error !== "storage") return null;
  return (
    <p className="inline-notice warning" role="alert">
      {error === "invalid" ? c.errorInvalid : c.errorStorage}
    </p>
  );
}
