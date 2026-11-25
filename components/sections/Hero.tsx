import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { OsAwareDownloadButton } from "./OsAwareDownloadButton";
import { BrowserMockup } from "@/components/mockups/BrowserMockup";
import type { SerializedRelease } from "@/lib/queries/releases";

interface HeroProps {
  latestRelease?: SerializedRelease | null;
}

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

export function Hero({ latestRelease }: HeroProps) {
  const version = latestRelease?.version;
  const versionLabel = version ? (version.startsWith("v") ? version : `v${version}`) : null;

  return (
    <section className="relative isolate overflow-hidden pt-14 pb-20 sm:pt-24 sm:pb-28">
      {/* Backdrop: grid + two soft color glows */}
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute left-1/2 top-[-12rem] -z-10 h-[36rem] w-[72rem] max-w-[160vw] -translate-x-1/2 rounded-full opacity-60 blur-3xl dark:opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.7 0.16 255 / 0.55), transparent), radial-gradient(closest-side at 75% 60%, oklch(0.7 0.18 300 / 0.45), transparent)",
        }}
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {latestRelease && (
            <Link
              href="/changelog"
              style={delay(0)}
              className="enter group inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-background/70 py-1 pl-1 pr-3.5 text-sm text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                <Sparkles className="size-3" aria-hidden />
                {versionLabel}
              </span>
              <span className="truncate">{latestRelease.title}</span>
              <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}

          <h1
            style={delay(80)}
            className="enter mt-7 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem]"
          >
            The browser that stays <span className="text-gradient">out of your way.</span>
          </h1>

          <p
            style={delay(160)}
            className="enter mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Spaces, Split View and a keyboard-first Command Bar, with ads and trackers blocked by default. Built on
            Chromium, so every site works.
          </p>

          <div style={delay(240)} className="enter mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <OsAwareDownloadButton release={latestRelease} showSubLink={false} />
            <Link
              href="/features"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background/70 px-6 text-[15px] font-medium backdrop-blur transition-colors hover:bg-muted"
            >
              Explore features
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <p
            style={delay(320)}
            className="enter mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground"
          >
            <span>Free forever</span>
            <span aria-hidden className="size-1 rounded-full bg-muted-foreground/40" />
            <span>Windows · macOS · Linux</span>
            <span aria-hidden className="size-1 rounded-full bg-muted-foreground/40" />
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" aria-hidden />
              Zero telemetry
            </span>
          </p>

          <aside
            style={delay(360)}
            aria-label="Install warning"
            className="enter mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-amber-500/60 bg-amber-500/15 p-4 text-left text-sm leading-relaxed"
          >
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                Warning: publisher not verified by Microsoft or Apple yet
              </p>
              <p className="mt-1 text-foreground/85">
                Windows or macOS may call this app untrusted when you install it. By continuing, you choose to install
                it at your own responsibility.{" "}
                <Link
                  href="/download#unverified-publisher"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  What to expect
                </Link>
              </p>
            </div>
          </aside>
        </div>

        {/* Product shot */}
        <div style={delay(420)} className="enter relative mt-16 sm:mt-20">
          <div
            aria-hidden
            className="absolute inset-x-[8%] top-[6%] -z-10 h-[80%] rounded-[50%] opacity-70 blur-3xl"
            style={{ background: "linear-gradient(90deg, oklch(0.65 0.18 255 / 0.5), oklch(0.65 0.2 300 / 0.45))" }}
          />
          <div className="rounded-[1.4rem] border border-border/70 bg-background/40 p-1.5 shadow-2xl shadow-black/10 ring-1 ring-black/5 backdrop-blur sm:p-2.5 dark:ring-white/5">
            <BrowserMockup />
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Try it: click the tabs, switch Spaces or open Split View.
          </p>
        </div>
      </div>
    </section>
  );
}
