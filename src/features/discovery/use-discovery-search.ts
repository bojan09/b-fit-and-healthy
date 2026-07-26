"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DiscoverySearchStatus =
  | "idle"
  | "loading"
  | "success"
  | "partial"
  | "error";

type DiscoveryResponse<T> = {
  results?: T[];
  partial?: boolean;
  message?: string;
};

type DiscoveryResponseState<T> = {
  key: string | null;
  results: T[];
  status: DiscoverySearchStatus;
  message: string | null;
};

export function useDiscoverySearch<T>({
  endpoint,
  localResults,
  minLength = 2,
  delay = 275,
}: {
  endpoint: string;
  localResults: T[];
  minLength?: number;
  delay?: number;
}) {
  const [query, setQuery] = useState("");
  const [responseState, setResponseState] = useState<
    DiscoveryResponseState<T>
  >({
    key: null,
    results: localResults,
    status: "idle",
    message: null,
  });
  const [retryGeneration, setRetryGeneration] = useState(0);
  const requestId = useRef(0);
  const updateQuery = useCallback((value: string) => {
    requestId.current += 1;
    setQuery(value);
  }, []);
  const trimmedQuery = query.trim();
  const isSearchable = trimmedQuery.length >= minLength;
  const requestKey = isSearchable
    ? `${endpoint}\u0000${trimmedQuery}`
    : null;
  const retry = useCallback(() => {
    if (isSearchable) {
      setRetryGeneration((generation) => generation + 1);
    }
  }, [isSearchable]);

  useEffect(() => {
    if (!isSearchable || requestKey === null) return;

    const currentRequest = ++requestId.current;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setResponseState((current) => ({
        key: requestKey,
        results: current.key === requestKey
          ? current.results
          : localResults,
        status: "loading",
        message: null,
      }));
      try {
        const separator = endpoint.includes("?") ? "&" : "?";
        const response = await fetch(
          `${endpoint}${separator}q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );
        const body = (await response.json()) as DiscoveryResponse<T>;
        if (requestId.current !== currentRequest) return;
        if (!response.ok) {
          setResponseState({
            key: requestKey,
            results: localResults,
            status: "error",
            message: body.message ?? "Search is temporarily unavailable.",
          });
          return;
        }
        setResponseState({
          key: requestKey,
          results: body.results ?? localResults,
          status: body.partial ? "partial" : "success",
          message: body.partial
            ? "Some sources are unavailable. Showing the results we could verify."
            : null,
        });
      } catch {
        if (controller.signal.aborted || requestId.current !== currentRequest) {
          return;
        }
        setResponseState({
          key: requestKey,
          results: localResults,
          status: "error",
          message: "Live sources are unavailable. Local results remain available.",
        });
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [
    delay,
    endpoint,
    isSearchable,
    localResults,
    requestKey,
    retryGeneration,
    trimmedQuery,
  ]);

  const currentResponse = requestKey !== null
    && responseState.key === requestKey
    ? responseState
    : null;

  return {
    query,
    setQuery: updateQuery,
    results: currentResponse?.results ?? localResults,
    status: currentResponse?.status ?? ("idle" as const),
    message: currentResponse?.message ?? null,
    retry,
  };
}
