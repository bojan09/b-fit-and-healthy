type Bucket = { startedAt: number; count: number };
type LimitResult = { allowed: true; remaining: number } | { allowed: false; retryAfter: number };

const WINDOW_MS = 60_000;
const REQUESTS_PER_WINDOW = 10;
const buckets = new Map<string, Bucket>();

export function consumeAssistantLimit(key: string, now = Date.now()): LimitResult {
  let bucket = buckets.get(key);
  if (!bucket || now - bucket.startedAt >= WINDOW_MS) {
    bucket = { startedAt: now, count: 0 };
    buckets.set(key, bucket);
  }
  if (bucket.count >= REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.startedAt + WINDOW_MS - now) / 1000)) };
  }
  bucket.count += 1;
  if (buckets.size > 5_000) {
    for (const [bucketKey, value] of buckets) if (now - value.startedAt >= WINDOW_MS) buckets.delete(bucketKey);
  }
  return { allowed: true, remaining: REQUESTS_PER_WINDOW - bucket.count };
}

export function resetAssistantLimits() {
  buckets.clear();
}

