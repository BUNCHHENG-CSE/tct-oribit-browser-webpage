import crypto from "crypto";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Hash IP with server salt so raw IPs are NEVER stored or logged.
 */
export function hashClientIdentifier(ip: string): string {
  const salt = process.env.ADMIN_PASSWORD || "orbit-salt-key";
  return crypto.createHash("sha256").update(`${ip}-${salt}`).digest("hex");
}

/**
 * In-memory rate limiter per hashed IP.
 * @param hashedIp SHA256 hashed client identity
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds (default 1 minute)
 */
export function checkRateLimit(
  hashedIp: string,
  limit: number = 5,
  windowMs: number = 60000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(hashedIp);

  // Clean expired records periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetAt) {
        rateLimitMap.delete(key);
      }
    }
    // Hard cap against flood attacks
    if (rateLimitMap.size > 5000) {
      const keysToDelete = Array.from(rateLimitMap.keys()).slice(0, 2500);
      for (const k of keysToDelete) {
        rateLimitMap.delete(k);
      }
    }
  }

  if (!record || now > record.resetAt) {
    rateLimitMap.set(hashedIp, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}
