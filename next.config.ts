import type { NextConfig } from "next";

const adminSlug = (
  process.env.ADMIN_SECRET_PATH ||
  process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH ||
  "orbit-mission-ctrl-8x92"
).replace(/^\/+|\/+$/g, "");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    localPatterns: [
      // Blog covers carry a version query for cache-busting (BLOG_COVER_VERSION
      // in lib/queries/post-serialize.ts). Keep the two values in sync.
      { pathname: "/screenshots/**", search: "?v=2" },
      // Every other local image: no query string allowed.
      { pathname: "/**", search: "" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: `/${adminSlug}`,
        destination: "/admin",
      },
      {
        source: `/${adminSlug}/:path*`,
        destination: "/admin/:path*",
      },
    ];
  },
};

export default nextConfig;
