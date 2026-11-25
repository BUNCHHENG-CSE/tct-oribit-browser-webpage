// Centralized configuration for the stealth administrator portal.
// SERVER-ONLY: never import this from a "use client" component — the slug must
// not end up in the client bundle (that is what makes the path "secret").
export const DEFAULT_ADMIN_SLUG = "orbit-mission-ctrl-8x92";

export function getAdminSlug(): string {
  const raw =
    process.env.ADMIN_SECRET_PATH ||
    // Legacy fallback; prefer ADMIN_SECRET_PATH (NEXT_PUBLIC_* is inlined into client JS)
    process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH ||
    DEFAULT_ADMIN_SLUG;
  return raw.replace(/^\/+|\/+$/g, "");
}

export function getAdminPath(subpath: string = ""): string {
  const slug = getAdminSlug();
  const cleanSub = subpath.replace(/^\/+/, "");
  if (!cleanSub) return `/${slug}`;
  return `/${slug}/${cleanSub}`;
}

/**
 * The secret used to sign admin session cookies.
 * Returns null when ADMIN_PASSWORD is not configured — callers must then
 * treat every session as invalid (no hard-coded fallback key that anyone
 * reading the source could use to forge a cookie).
 */
export function getAdminSessionSecret(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  return secret && secret.length > 0 ? secret : null;
}
