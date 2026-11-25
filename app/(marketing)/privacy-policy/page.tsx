import type { Metadata } from "next";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What TCT Orbit stores on your device, which services it connects to, and what this website collects.",
};

function SupportEmail() {
  return (
    <a href={`mailto:${SUPPORT_EMAIL}`} className="break-all text-primary hover:underline">
      {SUPPORT_EMAIL}
    </a>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="relative pt-12 pb-24 space-y-12">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-4">
        <p className="text-sm font-medium text-primary">Legal</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: November 25, 2026</p>
        <p className="text-base leading-relaxed text-muted-foreground">TCT Orbit keeps your browsing data on your device and includes no analytics. This policy covers the browser and this website.</p>
      </div>

      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-none space-y-10 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Who we are</h2>
            <p>TCT Orbit is made by The Capy Team (TCT), called &ldquo;we&rdquo; here. We do not have a company email address yet, so messages go to a team member&rsquo;s personal email: <SupportEmail />.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. What the browser does not send us</h2>
            <p>The browser has no user accounts, analytics, advertising or crash reporting. We do not receive your browsing history, tabs, Spaces, bookmarks, notes, saved passwords, cookies or form entries, so we cannot see, sell or share them.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. What the browser stores on your device</h2>
            <p>To work, the browser keeps data on your computer. This includes your Spaces, tabs, settings, history, bookmarks, notes, download list, site permissions, and the cookies and cache of sites you visit.</p>
            <p>Saved passwords and addresses are encrypted with your operating system account, and cookies are encrypted on disk. Other browser data is stored as ordinary local files, so we recommend full-disk encryption. Exported password files (.csv) and plain backups (.json) are not encrypted.</p>
            <p>If you turn on the encrypted sync file, it is encrypted on your computer with your passphrase and saved where you choose. We never receive the file or the passphrase.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Connections the browser makes</h2>
            <p>Apart from the sites you open, the browser may contact these services. They can see your IP address and handle requests under their own policies:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Search:</strong> searches go to the search engine you choose (DuckDuckGo by default). When search suggestions are on, what you type is also sent to that search engine. Suggestions are not used in private tabs.</li>
              <li><strong>Encrypted DNS:</strong> when on (the default), the names of sites you visit are looked up through the provider you choose (Cloudflare by default).</li>
              <li><strong>Updates:</strong> installed versions that support updating check GitHub Releases every few hours and download new versions. This is on by default and can be turned off.</li>
              <li><strong>Protection lists:</strong> ad and tracker lists are downloaded from GitHub, and phishing and malware lists from GitLab. The phishing and malware check happens on your computer.</li>
              <li><strong>Spelling dictionaries:</strong> downloaded from Google when spell checking is on, except on macOS. Your text is checked on your computer.</li>
              <li><strong>Site icons:</strong> may be requested from the sites they belong to.</li>
              <li><strong>Extensions:</strong> installing one contacts the store it comes from, such as Google&rsquo;s or Microsoft&rsquo;s.</li>
              <li><strong>Only when you choose them:</strong> Google Translate receives the page address or selected text, api.qrserver.com receives the address used for a QR code, and check.torproject.org is contacted by &ldquo;Check my IP&rdquo;. A proxy or Tor connection is used only if you set one up.</li>
              <li><strong>Ask this page:</strong> sends the page text to an Ollama model on your own computer.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. What this website collects</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Downloads:</strong> we record which file was requested, the time, and a two-letter country code supplied by our host. We do not store your IP address in our database. The file itself comes from GitHub, which receives your IP address.</li>
              <li><strong>Newsletter and waitlists:</strong> if you join, we store your email address, where you signed up, the release channel you chose, and the date. We use them only to send release news.</li>
              <li><strong>Support form:</strong> we store your message, its category, the date and your email address if you give one.</li>
              <li><strong>Email:</strong> if you email us, your message is received in a personal Gmail account operated by Google. Please do not send passwords or other sensitive information.</li>
              <li><strong>Abuse prevention:</strong> forms use a salted hash of your IP address, kept temporarily in server memory, to limit repeated submissions.</li>
              <li><strong>Cookies and local storage:</strong> we use no advertising or analytics cookies. Your light or dark theme choice is saved in your browser. A sign-in cookie is set only for site administrators.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Services that run this website</h2>
            <p>The website is hosted by Vercel and its database by Neon. Vercel processes technical data such as IP addresses to deliver and protect the site and may keep logs under its own policy. Installers are hosted by GitHub. These companies may process data outside your country. We do not sell personal information.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. How long we keep it and how to remove it</h2>
            <p>We keep newsletter, waitlist and support information until it is no longer needed or you ask us to delete it. To unsubscribe, or to see, correct or delete your information, email <SupportEmail /> from the address you used. There is no automatic unsubscribe link yet, so we handle requests by hand. We may need to confirm that the address is yours.</p>
            <p>Depending on where you live, you may have further rights under data-protection law, including the right to complain to your local authority. Data stored by the browser is on your device, where you can clear or export it in Settings.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Children</h2>
            <p>TCT Orbit is a general-purpose browser and is not directed at children. We do not knowingly collect children&rsquo;s personal information.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Security</h2>
            <p>We take reasonable steps to protect information, but no software or website is completely secure. Our installers are not yet code-signed by a Microsoft-trusted certificate or notarized by Apple. Download only from this site or our GitHub Releases, and keep TCT Orbit up to date.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">10. Changes to this policy</h2>
            <p>If our practices change, we will update this page and the date above.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">11. Contact</h2>
            <p>Privacy questions and security reports: <SupportEmail />.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
