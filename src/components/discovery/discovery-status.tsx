import { CircleAlert, LoaderCircle } from "lucide-react";
import type { DiscoverySearchStatus } from "@/features/discovery/use-discovery-search";

export function DiscoveryStatus({
  status,
  message,
}: {
  status: DiscoverySearchStatus;
  message: string | null;
}) {
  if (status === "loading") {
    return (
      <p className="discovery-status" role="status">
        <LoaderCircle className="is-spinning" aria-hidden="true" />
        Checking trusted sources…
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
    </p>
  );
}
