import { revalidatePath, revalidateTag, updateTag } from "next/cache";

/** Cache tags assigned (via cacheTag) inside the "use cache" query functions. */
export type CacheTagName = "posts" | "faqs" | "releases" | "stats";

/**
 * Executes Next.js revalidatePath defensively so mutations never crash
 * if invoked in environments without an active Next.js request context (tests, scripts).
 */
export function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Graceful no-op outside Next.js request store
  }
}

/**
 * Expire tagged "use cache" data so every page using it shows fresh content.
 * - Server Actions: updateTag (read-your-own-writes, no stale serve)
 * - Route Handlers / elsewhere: falls back to revalidateTag(tag, "max")
 */
export function safeUpdateTags(...tags: CacheTagName[]) {
  for (const tag of tags) {
    try {
      updateTag(tag);
    } catch {
      try {
        revalidateTag(tag, "max");
      } catch {
        // No request context (scripts/tests)
      }
    }
  }
}
