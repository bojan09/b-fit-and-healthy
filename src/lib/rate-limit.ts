export type RateLimitConfig = { limit: number; windowMs: number };
export type RateLimitResult = { allowed: true; remaining: number } | { allowed: false; retryAfter: number };

type Bucket = { startedAt: number; count: number };

const buckets = new Map<string, Bucket>();

/** Per-instance limiter. Fast and dependency-free; the shared store below layers on top of it. */
export function consumeLocalLimit(scope: string, key: string, config: RateLimitConfig, now = Date.now()): RateLimitResult {
  const id = `${scope}:${key}`;
  let bucket = buckets.get(id);
  if (!bucket || now - bucket.startedAt >= config.windowMs) {
    bucket = { startedAt: now, count: 0 };
    buckets.set(id, bucket);
  }
  if (bucket.count >= config.limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.startedAt + config.windowMs - now) / 1000)) };
  }
  bucket.count += 1;
  if (buckets.size > 5_000) {
    for (const [bucketKey, value] of buckets) if (now - value.startedAt >= config.windowMs) buckets.delete(bucketKey);
  }
  return { allowed: true, remaining: config.limit - bucket.count };
}

export function resetLocalLimits() {
  buckets.clear();
}

type RpcClient = {
  rpc: (fn: string, args: Record<string, unknown>) => PromiseLike<{ data: unknown; error: unknown }>;
};

/**
 * Shared limiter backed by the `consume_rate_limit` Postgres function, so the
 * budget holds across serverless instances. The function derives the user from
 * auth.uid(). If the migration is not applied or the call fails, the per-instance
 * limiter still applies, so a database hiccup never opens the gate fully.
 */
export async function enforceRateLimit(
  supabase: unknown,
  scope: string,
  userId: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const local = consumeLocalLimit(scope, userId, config);
  if (!local.allowed) return local;
  try {
    const { data, error } = await (supabase as RpcClient).rpc("consume_rate_limit", {
      p_scope: scope,
      p_limit: config.limit,
      p_window_seconds: Math.ceil(config.windowMs / 1000),
    });
    if (error || !Array.isArray(data) || data.length === 0) return local;
    const row = data[0] as { allowed?: boolean; retry_after?: number };
    if (row.allowed === false) return { allowed: false, retryAfter: Math.max(1, Number(row.retry_after) || 1) };
  } catch {
    // Shared store unavailable: keep the per-instance decision.
  }
  return local;
}

export const rateLimits = {
  assistant: { limit: 10, windowMs: 60_000 },
  discovery: { limit: 30, windowMs: 60_000 },
} satisfies Record<string, RateLimitConfig>;

export function rateLimitedResponse(retryAfter: number, body: Record<string, unknown> = {}) {
  return Response.json(
    { error: "RATE_LIMITED", retryAfter, ...body },
    { status: 429, headers: { "Retry-After": String(retryAfter), "Cache-Control": "no-store" } },
  );
}
