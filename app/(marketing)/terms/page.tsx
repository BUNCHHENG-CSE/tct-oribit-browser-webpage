import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — TCT Orbit",
  description: "Terms of Service for TCT Orbit desktop web browser and tctorbit.com website.",
};

export default function TermsOfServicePage() {
  return (
    <div className="relative pt-12 pb-24 space-y-12">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-4">
        <p className="text-sm font-medium text-primary">Terms &amp; conditions</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground">
          Last updated: November 23, 2026 • Version 1.2
        </p>
      </div>

      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="prose prose-orbit prose-base max-w-none text-foreground/90 leading-relaxed space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-sm text-muted-foreground">
              By downloading, installing, or using the TCT Orbit desktop browser or accessing tctorbit.com, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, do not install or use the software.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Software License &amp; Chromium Foundations</h2>
            <p className="text-sm text-muted-foreground">
              TCT Orbit is proprietary software developed and maintained by The Capy Team (TCT). We grant you a free, personal, non-exclusive, non-transferable license to download, install and use TCT Orbit on devices you own or control. You may not sell, sublicense, modify, reverse engineer or redistribute the software except where applicable law expressly allows it. All rights not expressly granted are reserved by The Capy Team. TCT Orbit includes open-source components, including Electron and Chromium, which remain under their own licenses (MIT and BSD-style, respectively); the notices for these components are included with the software.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. User Responsibilities &amp; Acceptable Use</h2>
            <p className="text-sm text-muted-foreground">
              You agree not to use the browser to conduct unauthorized network penetration testing, distributed denial-of-service (DDoS) attacks, or violate applicable local and international laws. Because TCT Orbit does not monitor your browsing traffic, you maintain complete and sole responsibility for your network activity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Disclaimer of Warranties</h2>
            <p className="text-sm text-muted-foreground">
              THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. EXPERIMENTAL BUILDS (NOVA, DEEP, CANARY) ARE PROVIDED STRICTLY FOR TESTING AND MAY CAUSE CRASHES OR LOSS OF UNCOMMITTED DATA.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground">
              IN NO EVENT SHALL TCT ORBIT, ITS AUTHORS, OR AFFILIATES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OF OR INABILITY TO USE THE BROWSER.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Modifications to Service</h2>
            <p className="text-sm text-muted-foreground">
              We reserve the right to modify or discontinue features in future releases. Continued use of TCT Orbit following updates constitutes acceptance of modified terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
