import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, NotebookPen } from "lucide-react";
import { getAllReleases } from "@/lib/queries/releases";
import { Markdown } from "@/components/content/Markdown";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Release Notes",
  description: "What's new in each TCT Orbit release: new features, fixes and improvements.",
  alternates: { canonical: "/changelog" },
};

const withV = (v: string) => (v.startsWith("v") ? v : `v${v}`);

export default async function ChangelogPage() {
  // Only Stable is public today; beta/nightly/canary entries stay out of the public history.
  const releases = (await getAllReleases()).filter((r) => r.channel === "STABLE");

  return (
    <div className="pb-24 pt-14 sm:pt-20">
      <header className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="text-sm font-medium text-primary">Release notes</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">What&apos;s new in Orbit</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          New features, fixes and improvements in every release.
        </p>
      </header>

      <div className="mx-auto mt-16 max-w-4xl px-5 sm:px-8">
        {releases.length === 0 ? (
          <EmptyState />
        ) : (
          <ol className="relative space-y-14 border-l border-border pl-8 sm:ml-40 sm:pl-12">
            {releases.map((release, i) => {
              const anchor = release.version.replace(/[^a-zA-Z0-9-]/g, "");
              const date = new Date(release.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              });
              const hasNotes = release.notes.trim().length > 20;

              return (
                <li key={release.id} id={anchor} className="reveal relative scroll-mt-28">
                  {/* Timeline dot */}
                  <span
                    aria-hidden
                    className={`absolute -left-[37px] top-1.5 size-3 rounded-full ring-4 ring-background sm:-left-[53px] ${
                      i === 0 ? "bg-primary" : "bg-border"
                    }`}
                  />

                  {/* Date + version: left rail on desktop, inline on mobile */}
                  <div className="mb-3 flex items-center gap-3 sm:absolute sm:-left-52 sm:top-0 sm:mb-0 sm:w-36 sm:flex-col sm:items-end sm:gap-1.5 sm:text-right">
                    <a
                      href={`#${anchor}`}
                      className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-xs font-medium hover:text-primary"
                    >
                      {withV(release.version)}
                    </a>
                    <time dateTime={release.publishedAt} className="text-sm text-muted-foreground">
                      {date}
                    </time>
                  </div>

                  <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-semibold tracking-tight">{release.title}</h2>
                      {i === 0 && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          Latest
                        </span>
                      )}
                    </div>

                    <div className="mt-5">
                      {hasNotes ? (
                        <Markdown size="sm">{release.notes}</Markdown>
                      ) : (
                        <p className="text-muted-foreground">Detailed notes for this release are coming soon.</p>
                      )}
                    </div>

                    {i === 0 && (
                      <Link
                        href="/download"
                        className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                      >
                        <Download className="size-4" aria-hidden />
                        Download {withV(release.version)}
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-border px-8 py-16 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <NotebookPen className="size-6" aria-hidden />
      </span>
      <h2 className="mt-5 text-xl font-semibold">Release notes are on the way</h2>
      <p className="mt-2 text-muted-foreground">
        We&apos;re writing up what&apos;s in each version. Meanwhile, the latest build is ready to download.
      </p>
      <Button asChild className="mt-7 rounded-full px-6">
        <Link href="/download">Download TCT Orbit</Link>
      </Button>
    </div>
  );
}
