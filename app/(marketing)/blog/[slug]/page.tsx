import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from "@/lib/queries/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/content/Markdown";
import { BlogCover } from "@/components/content/BlogCover";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tctorbit.com";

function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

/** Team bylines are organizations in structured data; anything else is a person. */
function authorSchema(name: string) {
  return { "@type": /team|tct/i.test(name) ? "Organization" : "Person", name };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PostPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = absoluteUrl(post.coverImage);

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...post.tags, "TCT Orbit", "private browser"],
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      siteName: "TCT Orbit",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      url,
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}

async function BlogPostContent(props: PostPageProps) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, 2);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: authorSchema(post.author),
      publisher: {
        "@type": "Organization",
        name: "The Capy Team (TCT)",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
      },
      image: absoluteUrl(post.coverImage),
      keywords: post.tags.join(", "),
      wordCount: post.content.trim().split(/\s+/).length,
      mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
      ],
    },
  ];

  return (
    <article className="relative pt-10 pb-24 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* Article Header */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <Button asChild variant="ghost" size="sm" className="rounded-full px-3 text-muted-foreground hover:text-foreground">
            <Link href="/blog" className="flex items-center gap-1.5 text-xs">
              <ArrowLeft className="size-3.5" />
              <span>Back to Journal</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {post.tags.map((t) => (
            <Badge key={t} variant="secondary" className="font-mono text-xs text-primary">
              #{t}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/50 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <User className="size-3.5 text-primary" />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {post.readingTimeMinutes} min read
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="size-3" />
              Zero telemetry
            </span>
          </div>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-muted border border-border/60 shadow-2xl">
          <BlogCover src={post.coverImage} priority sizes="(max-width: 1200px) 100vw, 1000px" />
        </div>
      </div>

      {/* Main Content Body */}
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Markdown>{post.content}</Markdown>

        {/* Share / Footer */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Published in the <strong>TCT Orbit Journal</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="ghost" className="rounded-full px-4">
              <Link href="/features">Explore features</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-4">
              <Link href="/download">Download TCT Orbit</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12 border-t border-border/40 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              Related Articles
            </h2>
            <Link href="/blog" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <span>View all</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((related) => (
              <Card
                key={related.id}
                className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl p-5 hover:border-primary/40 transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-primary">
                    #{related.tags[0]}
                  </div>
                  <h3 className="font-semibold text-base text-foreground leading-snug">
                    <Link href={`/blog/${related.slug}`} className="hover:text-primary transition-colors">
                      {related.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {related.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground mt-3">
                  <span>{related.author}</span>
                  <span>{related.readingTimeMinutes} min read</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function BlogPostSkeleton() {
  return (
    <article className="relative pt-10 pb-24 space-y-12 animate-pulse">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="h-8 w-32 bg-muted/60 rounded-full" />
        <div className="h-12 w-3/4 bg-muted/70 rounded-xl" />
        <div className="h-5 w-1/2 bg-muted/40 rounded-lg" />
        <div className="w-full aspect-[21/9] bg-muted/50 rounded-3xl" />
      </div>
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="h-4 w-full bg-muted/50 rounded" />
        <div className="h-4 w-5/6 bg-muted/40 rounded" />
        <div className="h-4 w-4/6 bg-muted/30 rounded" />
      </div>
    </article>
  );
}

export default function BlogPostPage(props: PostPageProps) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent params={props.params} />
    </Suspense>
  );
}
