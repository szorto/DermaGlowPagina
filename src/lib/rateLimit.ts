/**
 * Simple in-memory sliding-window rate limiter.
 * Works per Vercel serverless instance — good enough for abuse prevention
 * on a low-traffic site. For multi-instance production use, swap with
 * @upstash/ratelimit + Redis.
 */

interface Entry {
  timestamps: number[];
}

const store = new Map<string, Entry>();

interface LimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success:   boolean;
  limit:     number;
  remaining: number;
  resetMs:   number; // ms until the oldest request falls out of the window
}

export function rateLimit(key: string, options: LimitOptions): RateLimitResult {
  const { limit, windowMs } = options;
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get or create entry
  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Drop timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  const remaining = limit - entry.timestamps.length;
  const resetMs   = entry.timestamps.length > 0
    ? entry.timestamps[0] + windowMs - now
    : windowMs;

  if (remaining <= 0) {
    return { success: false, limit, remaining: 0, resetMs };
  }

  entry.timestamps.push(now);
  return { success: true, limit, remaining: remaining - 1, resetMs };
}

/** Convenience: get IP from Next.js request headers */
export function getIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}
