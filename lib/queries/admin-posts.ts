import { prisma } from "@/lib/db";
import { serializePost, type SerializedPost } from "./post-serialize";

/**
 * Admin-only: every post including drafts.
 * Intentionally NOT cached — the admin console must always show live data.
 * (Public pages use the cached, published-only queries in ./posts.)
 */
export async function getAllPostsForAdmin(): Promise<SerializedPost[]> {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });
  return posts.map(serializePost);
}
