// Lightweight in-memory sliding-window rate limiter. Not a substitute for a
// shared store like Upstash/Redis under real distributed load -- a
// serverless function can scale to multiple instances, each with its own
// memory -- but it's a real, meaningful speed bump against simple scripted
// abuse (login brute-forcing, form spam) with zero new infrastructure or
// env vars required, which is the right tradeoff for this site's traffic
// level today. Revisit with a shared store if abuse patterns show this
// isn't enough.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Prevent unbounded memory growth from one-off/spoofed IPs -- prune
// expired entries occasionally rather than on every call.
let lastPrune = Date.now();
function pruneIfNeeded() {
  const now = Date.now();
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds?: number } {
  pruneIfNeeded();
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count++;
  return { allowed: true };
}

export function clientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}
