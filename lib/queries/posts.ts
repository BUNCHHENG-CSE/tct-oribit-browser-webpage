import { prisma } from "@/lib/db";
import { cacheLife, cacheTag } from "next/cache";

import { serializePost, type SerializedPost } from "./post-serialize";

export type { SerializedPost };

export async function getPublishedPosts(tag?: string): Promise<SerializedPost[]> {
  "use cache";
  cacheTag("posts");
  cacheLife("hours");
  try {
    const where: any = { published: true };
    if (tag) {
      where.tags = { has: tag };
    }
    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    });
    return posts.map(serializePost);
  } catch (error) {
    console.error("Error fetching published posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<SerializedPost | null> {
  "use cache";
  cacheTag("posts");
  cacheLife("hours");
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
    });
    if (!post || !post.published) return null;
    return serializePost(post);
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  "use cache";
  cacheTag("posts");
  cacheLife("hours");
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return posts.map((p) => p.slug);
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }
}

export async function getRelatedPosts(currentSlug: string, limit: number = 2): Promise<SerializedPost[]> {
  "use cache";
  cacheTag("posts");
  cacheLife("hours");
  try {
    const [current, others] = await Promise.all([
      prisma.post.findUnique({ where: { slug: currentSlug }, select: { tags: true } }),
      prisma.post.findMany({
        where: { published: true, slug: { not: currentSlug } },
        orderBy: { publishedAt: "desc" },
      }),
    ]);
    // Most shared tags first; ties keep newest-first order (sort is stable).
    const tags = new Set(current?.tags ?? []);
    const shared = (p: { tags: string[] }) => p.tags.filter((t) => tags.has(t)).length;
    return [...others]
      .sort((a, b) => shared(b) - shared(a))
      .slice(0, limit)
      .map(serializePost);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}
