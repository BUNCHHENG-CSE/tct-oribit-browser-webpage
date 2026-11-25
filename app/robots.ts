import { SITE_URL } from "@/lib/site";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
