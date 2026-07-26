export type ProviderJob<T> = {
  id: string;
  run: (signal: AbortSignal) => Promise<T[]>;
};

export type ProviderFailure = {
  provider: string;
  reason: "timeout" | "unavailable";
};

export async function runProviders<T>(
  providers: readonly ProviderJob<T>[],
  options: { timeoutMs: number },
) {
  const started = performance.now();
  const settled = await Promise.all(
    providers.map(async (provider) => {
      const controller = new AbortController();
      let timer: ReturnType<typeof setTimeout> | undefined;
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new DOMException("Provider timeout", "TimeoutError"));
        }, options.timeoutMs);
      });

      try {
        const results = await Promise.race([
          provider.run(controller.signal),
          timeout,
        ]);
        return { provider: provider.id, results, failure: null };
      } catch (error) {
        return {
          provider: provider.id,
          results: [] as T[],
          failure: {
            provider: provider.id,
            reason:
              error instanceof DOMException && error.name === "TimeoutError"
                ? ("timeout" as const)
                : ("unavailable" as const),
          },
        };
      } finally {
        if (timer) clearTimeout(timer);
      }
    }),
  );

  return {
    results: settled.flatMap((entry) => entry.results),
    failures: settled.flatMap((entry) =>
      entry.failure ? [entry.failure] : [],
    ),
    elapsedMs: Math.round(performance.now() - started),
  };
}
