import { NextResponse } from "next/server";
import type { ProviderFailure } from "@/features/discovery/provider-runner";
import type { DiscoveryItem } from "@/features/discovery/types";

export function discoveryResponse(
  query: string,
  results: DiscoveryItem[],
  failures: ProviderFailure[],
) {
  const response = NextResponse.json({
    query,
    results,
    failures,
    partial: failures.length > 0,
    freshness: "live" as const,
  });
  response.headers.set(
    "Cache-Control",
    "private, max-age=30, stale-while-revalidate=120",
  );
  return response;
}

export function logDiscoveryProviders(
  operation: string,
  failures: ProviderFailure[],
  elapsedMs: number,
) {
  const correlationId = crypto.randomUUID();
  console.info("discovery.providers", {
    correlationId,
    operation,
    status: failures.length ? "partial" : "success",
    failures: failures.map((failure) => ({
      provider: failure.provider,
      reason: failure.reason,
    })),
    elapsedMs,
  });
}
