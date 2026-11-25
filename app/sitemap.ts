import { SITE_URL } from "@/lib/site";
import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_URL;

  const staticRoutes = [
    "",
    "/features",
    "/privacy-features",
    "/download",
    "/channels",
    "/changelog",
    "/blog",
    "/support",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-01-01T00:00:00Z"),
    changeFrequency: (route === "" ? "daily" : "weekly") as
      | "daily"
      | "weekly"
      | "always"
      | "hourly"
      | "monthly"
      | "yearly"
      | "never",
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, publishedAt: true },
    });

    const postRoutes = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...postRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
