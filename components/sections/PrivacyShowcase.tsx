import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ShieldPopoverMockup } from "@/components/mockups/ShieldPopoverMockup";

const PROTECTIONS = [
  "Ad & tracker blocking",
  "Fingerprint noise",
  "Third-party cookie blocking",
  "HTTPS-Only mode",
  "DNS-over-HTTPS",
  "WebRTC IP leak protection",
  "Tracking-parameter stripping",
  "Cookie-banner blocking",
];

export function PrivacyShowcase() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal relative isolate overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-7 py-14 text-foreground sm:px-14 sm:py-20 dark:border-white/5 dark:from-[#0a0c12] dark:via-[#0a0c12] dark:to-[#0a0c12]">
          {/* Glows */}
          <div
            aria-hidden
            className="absolute -left-32 -top-32 -z-10 size-[28rem] rounded-full opacity-20 blur-3xl dark:opacity-50"
            style={{ background: "oklch(0.55 0.2 258)" }}
          />
          <div
            aria-hidden
            className="absolute -bottom-40 right-0 -z-10 size-[26rem] rounded-full opacity-20 blur-3xl dark:opacity-30"
            style={{ background: "oklch(0.6 0.17 165)" }}
          />

          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Privacy Shield</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Private by default.
                <br />
                <span className="text-muted-foreground">Nothing to set up.</span>
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                Orbit blocks the tracking web out of the box, sends zero telemetry, and keeps your history, bookmarks and
                settings in local files on your device.
              </p>

              <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {PROTECTIONS.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-foreground/85">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <Link
                href="/privacy-features"
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-foreground/5 px-5 py-2.5 text-sm font-medium ring-1 ring-inset ring-foreground/10 transition-colors hover:bg-foreground/10"
              >
                How Orbit protects you
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm rotate-[-2deg] transition-transform duration-500 hover:rotate-0">
                <ShieldPopoverMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
