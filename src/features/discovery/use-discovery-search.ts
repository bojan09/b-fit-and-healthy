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
  const [results, setResults] = useState<T[]>(localResults);
  const [status, setStatus] = useState<DiscoverySearchStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const requestId = useRef(0);
  const updateQuery = useCallback((value: string) => {
    requestId.current += 1;
    setQuery(value);
  }, []);
  const isSearchable = query.trim().length >= minLength;

  useEffect(() => {
    if (!isSearchable) return;

    const currentRequest = ++requestId.current;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("loading");
      setMessage(null);
      try {
        const separator = endpoint.includes("?") ? "&" : "?";
        const response = await fetch(
          `${endpoint}${separator}q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );
        const body = (await response.json()) as DiscoveryResponse<T>;
        if (requestId.current !== currentRequest) return;
        if (!response.ok) {
          setResults(localResults);
          setStatus("error");
          setMessage(body.message ?? "Search is temporarily unavailable.");
          return;
        }
        setResults(body.results ?? localResults);
        setStatus(body.partial ? "partial" : "success");
        setMessage(
          body.partial
            ? "Some sources are unavailable. Showing the results we could verify."
            : null,
        );
      } catch {
        if (controller.signal.aborted || requestId.current !== currentRequest) {
          return;
        }
        setResults(localResults);
        setStatus("error");
        setMessage("Live sources are unavailable. Local results remain available.");
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [delay, endpoint, isSearchable, localResults, query]);

  return {
    query,
    setQuery: updateQuery,
    results: isSearchable ? results : localResults,
    status: isSearchable ? status : ("idle" as const),
    message: isSearchable ? message : null,
  };
}
