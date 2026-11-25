import type { Post } from "@prisma/client";

export type SerializedPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  published: boolean;
  publishedAt: string;
  readingTimeMinutes: number;
};

function calculateReadingTime(content: string): number {
  const text = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*_`>|:-]+/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Bump when the generated blog covers (scripts/generate-blog-covers.ts) change,
 * and update the matching `search` in next.config.ts → images.localPatterns.
 * A new URL makes browsers, CDNs and the Next image cache fetch the new file.
 */
export const BLOG_COVER_VERSION = "2";

function versionedCover(src: string): string {
  if (!src.startsWith("/screenshots/blog-")) return src;
  return `${src.split("?")[0]}?v=${BLOG_COVER_VERSION}`;
}

/** Convert a Prisma Post into a plain, client-safe object. */
export function serializePost(p: Post): SerializedPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    coverImage: versionedCover(p.coverImage),
    author: p.author,
    tags: p.tags,
    published: p.published,
    publishedAt: p.publishedAt.toISOString(),
    readingTimeMinutes: calculateReadingTime(p.content),
  };
}
