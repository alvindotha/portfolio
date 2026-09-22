import 'server-only';
import { headers } from 'next/headers';

/**
 * Best-effort client IP, used to key one-view/one-like per visitor.
 * Nginx sets X-Forwarded-For; `npm run dev` has no proxy, so fall back to a
 * constant that keeps counters working locally.
 */
export function getClientIp(): string {
  const h = headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return h.get('x-real-ip') ?? 'unknown';
}
