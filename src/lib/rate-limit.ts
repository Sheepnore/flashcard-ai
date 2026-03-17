const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;  // per IP per window

// ip → timestamps of requests within current window
const store = new Map<string, number[]>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const timestamps = (store.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0];
    const retryAfterMs = WINDOW_MS - (now - oldest);
    store.set(ip, timestamps);
    return { allowed: false, retryAfterMs };
  }

  timestamps.push(now);
  store.set(ip, timestamps);
  return { allowed: true, retryAfterMs: 0 };
}
