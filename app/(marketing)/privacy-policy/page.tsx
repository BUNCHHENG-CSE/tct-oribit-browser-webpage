import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Zero Telemetry Commitment",
  description: "TCT Orbit's privacy policy and sovereign data guarantees. No trackers, no ad networks, no cloud surveillance.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative pt-12 pb-24 space-y-12">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-4">
        <p className="text-sm font-medium text-primary">Legal &amp; privacy compliance</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground">
          Last updated: November 23, 2026 • Effective Version: 1.3
        </p>
      </div>

      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="prose prose-orbit prose-base max-w-none text-foreground/90 leading-relaxed space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Our Fundamental Privacy Thesis</h2>
            <p className="text-sm text-muted-foreground">
              TCT Orbit (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;the Browser&rdquo;), engineered by the members of The Capy Team (TCT), was designed under a simple paradigm: your software should work for you, not for an advertising conglomerate. We believe that privacy cannot exist when remote servers collect telemetry. Consequently, TCT Orbit is designed with an uncompromising zero-telemetry architecture.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Data We Do NOT Collect</h2>
            <p className="text-sm text-muted-foreground">
              By technical design, the desktop browser application does NOT transmit any of the following to our servers or third parties:
            </p>
            <ul className="text-xs sm:text-sm text-muted-foreground list-disc pl-5 space-y-1.5">
              <li>Your browsing history, visited URLs, or query parameters</li>
              <li>Keystrokes, autocomplete entries, or address bar typing</li>
              <li>Tabs, Spaces configurations, or saved bookmarks</li>
              <li>Notes you write in Space notes</li>
              <li>Passwords, cookies, or local form submissions</li>
              <li>Hardware serial numbers or persistent advertising identifiers</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Information Collected via the Website (tctorbit.com)</h2>
            <p className="text-sm text-muted-foreground">
              When visiting this website, we collect only the minimal data necessary to deliver downloads and manage email communications:
            </p>
            <ul className="text-xs sm:text-sm text-muted-foreground list-disc pl-5 space-y-1.5">
              <li>
                <strong>Download Counts:</strong> When downloading Orbit, our server logs an anonymous counter increment and the two-letter ISO country code supplied by cloud CDN headers (e.g., &ldquo;US&rdquo;, &ldquo;DE&rdquo;). We do NOT store or log your IP address.
              </li>
              <li>
                <strong>Newsletter &amp; Waitlist:</strong> If you explicitly subscribe, we store your email address solely to deliver release announcements and beta builds. You can unsubscribe at any time with one click.
              </li>
              <li>
                <strong>Feedback Submissions:</strong> If you submit feedback through our support form, we store your message and optional contact email to address your issue.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Local Data Security on Your Device</h2>
            <p className="text-sm text-muted-foreground">
              All browser data (history, bookmarks, Spaces, notes and settings) is stored as local JSON files in your operating system&apos;s standard application data folder. Cookies are encrypted on disk. If you turn on sync, Orbit writes an encrypted backup file to a cloud folder you choose (such as OneDrive, Dropbox or iCloud); we never receive it. We recommend full-disk encryption (BitLocker, FileVault or LUKS) for extra protection.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Contact Information</h2>
            <p className="text-sm text-muted-foreground">
              For security disclosures or inquiries regarding our data handling, please contact:
              <br />
              <strong className="text-foreground">The Capy Team (TCT) — Security &amp; Privacy Group</strong>
              <br />
              Email: <a href="mailto:support@tctorbit.com" className="text-primary hover:underline">support@tctorbit.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
