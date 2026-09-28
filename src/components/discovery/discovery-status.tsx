"use client";

import { CircleAlert, LoaderCircle } from "lucide-react";
import { useOptionalLocale } from "@/components/providers/locale-provider";
import type { DiscoverySearchStatus } from "@/features/discovery/use-discovery-search";

export function DiscoveryStatus({
  status,
  message,
  onRetry,
}: {
  status: DiscoverySearchStatus;
  message: string | null;
  onRetry?: () => void;
}) {
  const mk = useOptionalLocale() === "mk";
  if (status === "loading") {
    return (
      <p className="discovery-status" role="status">
        <LoaderCircle className="is-spinning" aria-hidden="true" />
        {mk ? "Се проверуваат доверливи извори…" : "Checking trusted sources…"}
      </p>
    );
  }
  if (!message) return null;
  return (
    <p
      className={`discovery-status discovery-status-${status}`}
      role={status === "error" ? "alert" : "status"}
    >
      <CircleAlert aria-hidden="true" />
      {message}
      {(status === "partial" || status === "error") && onRetry ? (
        <button type="button" className="discovery-retry" onClick={onRetry}>
          {mk ? "Обиди се пак" : "Try again"}
        </button>
      ) : null}
    </p>
  );
}
