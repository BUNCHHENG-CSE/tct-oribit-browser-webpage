import Link from "next/link";
import { TriangleAlert } from "lucide-react";

/** Shown until the builds are code-signed (Windows) and notarized (macOS). */
export function UnverifiedPublisherNotice() {
  return (
    <aside
      id="unverified-publisher"
      aria-labelledby="unverified-publisher-title"
      className="scroll-mt-28 rounded-2xl border border-amber-500/60 bg-amber-500/15 p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <TriangleAlert className="mt-0.5 size-6 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
        <div className="min-w-0 space-y-4">
          <div className="space-y-1.5">
            <h2 id="unverified-publisher-title" className="text-lg font-semibold text-foreground">
              Windows and macOS may warn you when you install
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              TCT Orbit doesn&apos;t have a Microsoft-trusted code-signing certificate or Apple notarization yet, so
              your system can&apos;t verify the publisher and may call the app untrusted. Only install it if you
              downloaded it from this site or our GitHub Releases, and check its SHA-256 checksum when one is listed.
            </p>
          </div>
          <p className="text-sm font-medium leading-relaxed text-amber-800 dark:text-amber-300">
            By downloading, you choose to install TCT Orbit at your own responsibility. See our{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms
            </Link>
            .
          </p>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-foreground">Windows: &ldquo;Unknown publisher&rdquo;</dt>
              <dd className="mt-1 text-foreground/80">
                If SmartScreen appears, choose <strong>More info</strong>, then <strong>Run anyway</strong>.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">macOS: app can&apos;t be verified</dt>
              <dd className="mt-1 text-foreground/80">
                Try to open the app once, then go to <strong>System Settings → Privacy &amp; Security</strong> and choose{" "}
                <strong>Open Anyway</strong>. On macOS 14 or older, you can right-click the app and choose{" "}
                <strong>Open</strong>.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </aside>
  );
}
