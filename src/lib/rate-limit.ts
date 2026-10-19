export type RateLimitConfig = { limit: number; windowMs: number };
export type RateLimitResult = { allowed: true; remaining: number } | { allowed: false; retryAfter: number };

type Bucket = { startedAt: number; count: number };

const buckets = new Map<string, Bucket>();

/** Per-process limiter; deploy one application instance or add a shared Appwrite Function for distributed enforcement. */
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

/** Per-process fallback. Use Appwrite's platform limits on public routes as a second layer. */
export async function enforceRateLimit(
  _appwrite: unknown,
  scope: string,
  userId: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  return consumeLocalLimit(scope, userId, config);
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
