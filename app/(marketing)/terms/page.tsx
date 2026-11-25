import type { Metadata } from "next";
import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for the TCT Orbit desktop browser and website.",
};

function SupportEmail() {
  return (
    <a href={`mailto:${SUPPORT_EMAIL}`} className="break-all text-primary hover:underline">
      {SUPPORT_EMAIL}
    </a>
  );
}

export default function TermsOfServicePage() {
  return (
    <div className="relative pt-12 pb-24 space-y-12">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-4">
        <p className="text-sm font-medium text-primary">Legal</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: November 25, 2026</p>
        <p className="text-base leading-relaxed text-muted-foreground">These terms apply to the TCT Orbit browser and this website, provided by The Capy Team (TCT).</p>
      </div>

      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-none space-y-10 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Accepting these terms</h2>
            <p>By downloading, installing or using TCT Orbit, or using this website, you agree to these terms. If you do not agree, please do not use them. How we handle information is described in our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. License</h2>
            <p>TCT Orbit is free to download, install and use. The license file included in our source repository governs your rights to the code it covers, and nothing in these terms limits those rights.</p>
            <p>TCT Orbit includes third-party open-source components, including Chromium, Electron and the Ghostery ad-blocking engine, which remain under their own licenses. The TCT Orbit name and logo may not be used in a way that suggests a modified version is official.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Unverified publisher and installation</h2>
            <p>TCT Orbit is not yet signed with a Microsoft-trusted certificate or notarized by Apple. Windows or macOS may warn that the publisher is unknown or the app is untrusted. You decide whether to install it and do so at your own responsibility, subject to section 9 and your legal rights.</p>
            <p>Download installers only from this website or our GitHub Releases, and check the published SHA-256 checksum. A matching checksum shows that the file is the one we published. It does not replace a verified publisher.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Using TCT Orbit</h2>
            <p>You agree not to use TCT Orbit or this website to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>break the law or infringe other people&rsquo;s rights;</li>
              <li>gain unauthorized access to computers, accounts or networks, or disrupt them;</li>
              <li>distribute malware, or carry out fraud, harassment or abuse.</li>
            </ul>
            <p>You are responsible for the sites you visit and the content you download.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Other websites and services</h2>
            <p>Websites, search engines, extensions and other third-party services are not under our control and have their own terms. Blocking ads, trackers or scripts may affect how some sites work.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Privacy and security features</h2>
            <p>Tracker blocking, private tabs, encrypted DNS, and proxy or Tor routing reduce tracking but do not make you anonymous or protect against every threat. If your safety depends on anonymity, use tools designed for that purpose.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Updates, test builds and your data</h2>
            <p>Some installed versions download updates automatically unless you turn this off. We may change or stop developing TCT Orbit or any feature.</p>
            <p>Test builds (Nova, Deep and Canary), if offered, may crash or lose data. You are responsible for backing up your data, and we cannot recover a lost sync passphrase.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. No warranty</h2>
            <p>To the fullest extent permitted by law, TCT Orbit and this website are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose and non-infringement.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Limitation of liability</h2>
            <p>To the fullest extent permitted by law, The Capy Team and contributors to TCT Orbit are not liable for indirect, incidental, special, consequential or punitive damages, or for loss of data, profits or goodwill, arising from TCT Orbit or this website.</p>
            <p>Some places do not allow these limits. Nothing in these terms limits liability that cannot legally be limited, or your rights as a consumer.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">10. Changes to these terms</h2>
            <p>We may update these terms. The date above shows the latest version. If you keep using TCT Orbit after a change takes effect, the updated terms apply to that use where the law allows.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">11. Contact</h2>
            <p>Questions about these terms: <SupportEmail />. This is currently a team member&rsquo;s personal email address.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
