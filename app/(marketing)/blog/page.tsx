import type { Metadata } from "next";
import { BlogCover } from "@/components/content/BlogCover";
import Link from "next/link";
import { Suspense } from "react";
import { getPublishedPosts } from "@/lib/queries/posts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Privacy, Product & Productivity Guides",
  description:
    "News, privacy deep dives and how-to guides for TCT Orbit, the free, private browser from The Capy Team.",
  alternates: { canonical: "/blog" },
};

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default function BlogPage(props: BlogPageProps) {
  return (
    <div className="relative pt-12 pb-24 space-y-12">
      {/* Static App Shell Header (Instant) */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-sm font-medium text-primary">The orbit journal</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
          Engineering &amp; Privacy Insights
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          How Orbit keeps your data on your device, what&apos;s new, and guides to browsing with less clutter.
        </p>
      </div>

      {/* Dynamic Filter & Posts wrapped in Suspense for Instant Shell Navigation */}
      <Suspense fallback={<BlogGridSkeleton />}>
        <BlogList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function BlogList({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const [posts, allPosts] = await Promise.all([
    getPublishedPosts(tag),
    getPublishedPosts(),
  ]);

  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags)));

  return (
    <div className="space-y-12">
      {/* Tag Filters */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/blog"
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              !tag
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Articles ({allPosts.length})
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                tag === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              #{t}
            </Link>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl border border-dashed border-border/60 text-muted-foreground text-sm">
            No posts found under tag &ldquo;{tag}&rdquo;.{" "}
            <Link href="/blog" className="text-primary hover:underline font-semibold ml-1">
              View all posts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-xl flex flex-col justify-between shadow-xl hover:-translate-y-1.5 transition-all duration-300 hover:border-primary/40 group overflow-hidden"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative w-full aspect-[16/10] bg-muted overflow-hidden">
                    <BlogCover
                      src={post.coverImage}
                      className="group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <CardHeader className="space-y-3 pb-2 pt-6">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      <h2>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardContent>
                </div>

                <CardFooter className="pt-4 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="size-3 text-muted-foreground" />
                    <span className="truncate">{post.author}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {post.readingTimeMinutes} min read
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BlogGridSkeleton() {
  return (
    <div className="space-y-12">
      {/* Filter skeleton */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="h-6 w-24 rounded-full bg-muted/60 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-muted/60 animate-pulse" />
          <div className="h-6 w-28 rounded-full bg-muted/60 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-muted/60 animate-pulse" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-border/60 bg-card/40 overflow-hidden space-y-4 pb-6"
            >
              <div className="w-full aspect-[16/10] bg-muted/40 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-16 bg-muted/60 rounded-full animate-pulse" />
                <div className="h-6 w-3/4 bg-muted/70 rounded-md animate-pulse" />
                <div className="h-4 w-full bg-muted/40 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
