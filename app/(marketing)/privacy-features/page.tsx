import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ServerOff,
  Database,
  Fingerprint,
  Sliders,
  Download,
  Lock,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Architecture — Zero-Cloud Telemetry Guarantee",
  description:
    "How TCT Orbit keeps your data on your device: local JSON storage, zero telemetry, fingerprint noise, per-site permissions, app hardening, and a complete list of the browser's own network connections.",
};

export default function PrivacyFeaturesPage() {
  return (
    <div className="relative pt-12 pb-24 space-y-24">
      {/* Header */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-sm font-medium text-primary">Zero-cloud telemetry</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
          Your computer. <br />
          <span className="text-muted-foreground">
            Your data. No servers.
          </span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Privacy isn&apos;t a setting in TCT Orbit, it&apos;s how it&apos;s built. Orbit sends zero telemetry and keeps your history, bookmarks and settings in local files on your device.
        </p>
      </div>

      {/* Inline SVG Architecture Diagram: "Where your data lives" */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold text-foreground">
              Data Locality Architecture: TCT Orbit vs. Traditional Browsers
            </h3>
            <p className="text-xs text-muted-foreground">
              Technical topological diagram showing outbound network boundaries
            </p>
          </div>

          {/* Mobile swipe hint */}
          <div className="sm:hidden px-3.5 py-2 rounded-xl bg-muted/40 border border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Swipe horizontally to view architecture topology</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">⇄</span>
          </div>

          <div className="w-full overflow-x-auto touch-pan-x py-2">
            <svg
              viewBox="0 0 1000 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full min-w-[700px] h-auto select-none"
            >
              {/* Device Boundary (Left Box) */}
              <rect
                x="40"
                y="40"
                width="420"
                height="400"
                rx="20"
                fill="rgba(16, 185, 129, 0.05)"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <text x="70" y="75" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="bold" className="fill-emerald-600 dark:fill-emerald-400">
                YOUR HARDWARE / CLIENT DEVICE (ENCLAVE)
              </text>

              {/* Local Storage Entities */}
              <g transform="translate(70, 105)">
                <rect width="360" height="60" rx="12" className="fill-card stroke-border" />
                <circle cx="30" cy="30" r="14" fill="rgba(16, 185, 129, 0.2)" />
                <path d="M25 30 L29 34 L36 26" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
                <text x="60" y="27" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="bold" className="fill-foreground">
                  Local JSON Files
                </text>
                <text x="60" y="44" fontFamily="system-ui, sans-serif" fontSize="11" className="fill-muted-foreground">
                  History, Spaces, bookmarks, notes (on your device)
                </text>
              </g>

              <g transform="translate(70, 180)">
                <rect width="360" height="60" rx="12" className="fill-card stroke-border" />
                <circle cx="30" cy="30" r="14" fill="rgba(59, 130, 246, 0.2)" />
                <path d="M25 30 L29 34 L36 26" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round" />
                <text x="60" y="27" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="bold" className="fill-foreground">
                  Privacy Shield
                </text>
                <text x="60" y="44" fontFamily="system-ui, sans-serif" fontSize="11" className="fill-muted-foreground">
                  Ghostery ad &amp; tracker lists
                </text>
              </g>

              <g transform="translate(70, 255)">
                <rect width="360" height="60" rx="12" className="fill-card stroke-border" />
                <circle cx="30" cy="30" r="14" fill="rgba(168, 85, 247, 0.2)" />
                <path d="M25 30 L29 34 L36 26" stroke="#c084fc" strokeWidth="2" fill="none" strokeLinecap="round" />
                <text x="60" y="27" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="bold" className="fill-foreground">
                  Fingerprint Noise
                </text>
                <text x="60" y="44" fontFamily="system-ui, sans-serif" fontSize="11" className="fill-muted-foreground">
                  Canvas, WebGL &amp; audio
                </text>
              </g>

              <g transform="translate(70, 330)">
                <rect width="360" height="60" rx="12" className="fill-card stroke-border" />
                <circle cx="30" cy="30" r="14" fill="rgba(245, 158, 11, 0.2)" />
                <path d="M25 30 L29 34 L36 26" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinecap="round" />
                <text x="60" y="27" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="bold" className="fill-foreground">
                  Third-Party Cookie Blocking
                </text>
                <text x="60" y="44" fontFamily="system-ui, sans-serif" fontSize="11" className="fill-muted-foreground">
                  Blocks cross-site tracking cookies
                </text>
              </g>

              {/* Middle: Severed Connection Wire */}
              <g transform="translate(480, 210)">
                {/* Blocked Connection to Cloud */}
                <line x1="10" y1="30" x2="65" y2="30" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 6" />
                <circle cx="40" cy="30" r="16" fill="#ef4444" />
                <path d="M33 23 L47 37 M47 23 L33 37" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                <text x="40" y="65" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" fill="#ef4444">
                  0 BYTES TELEMETRY
                </text>
              </g>

              {/* Cloud Boundary (Right Box) */}
              <rect
                x="570"
                y="40"
                width="390"
                height="400"
                rx="20"
                fill="rgba(239, 68, 68, 0.04)"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.8"
              />
              <text x="600" y="75" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="bold" className="fill-red-600 dark:fill-red-400">
                THE CLOUD / AD TECH NETWORKS (BLOCKED)
              </text>

              <g transform="translate(600, 110)">
                <rect width="330" height="55" rx="10" className="fill-red-500/[0.04] stroke-red-500/20" />
                <circle cx="28" cy="28" r="12" fill="rgba(239, 68, 68, 0.2)" />
                <path d="M22 22 L34 34 M34 22 L22 34" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <text x="52" y="27" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="600" className="fill-red-600 dark:fill-red-400">
                  Cloud Analytics Relays
                </text>
                <text x="52" y="42" fontFamily="system-ui, sans-serif" fontSize="10" className="fill-muted-foreground">
                  Google Analytics, Mixpanel, Segment (BLOCKED)
                </text>
              </g>

              <g transform="translate(600, 185)">
                <rect width="330" height="55" rx="10" className="fill-red-500/[0.04] stroke-red-500/20" />
                <circle cx="28" cy="28" r="12" fill="rgba(239, 68, 68, 0.2)" />
                <path d="M22 22 L34 34 M34 22 L22 34" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <text x="52" y="27" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="600" className="fill-red-600 dark:fill-red-400">
                  Keystroke Telemetry Collectors
                </text>
                <text x="52" y="42" fontFamily="system-ui, sans-serif" fontSize="10" className="fill-muted-foreground">
                  Omnibox predictive suggestions (SEVERED)
                </text>
              </g>

              <g transform="translate(600, 260)">
                <rect width="330" height="55" rx="10" className="fill-red-500/[0.04] stroke-red-500/20" />
                <circle cx="28" cy="28" r="12" fill="rgba(239, 68, 68, 0.2)" />
                <path d="M22 22 L34 34 M34 22 L22 34" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <text x="52" y="27" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="600" className="fill-red-600 dark:fill-red-400">
                  Commercial Profile Graphs
                </text>
                <text x="52" y="42" fontFamily="system-ui, sans-serif" fontSize="10" className="fill-muted-foreground">
                  Ad networks &amp; data brokers (DEFLECTED)
                </text>
              </g>

              <g transform="translate(600, 335)">
                <rect width="330" height="55" rx="10" className="fill-red-500/[0.04] stroke-red-500/20" />
                <circle cx="28" cy="28" r="12" fill="rgba(239, 68, 68, 0.2)" />
                <path d="M22 22 L34 34 M34 22 L22 34" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <text x="52" y="27" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="600" className="fill-red-600 dark:fill-red-400">
                  Vendor Sync Servers
                </text>
                <text x="52" y="42" fontFamily="system-ui, sans-serif" fontSize="10" className="fill-muted-foreground">
                  No accounts. Optional sync via your own cloud folder.
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* 5 Architectural Tenets */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-semibold text-foreground">
            The Five Pillars of Orbit Privacy
          </h2>
          <p className="text-sm text-muted-foreground">
            Concrete technical implementations, not vague marketing promises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl space-y-3">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Database className="size-5" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              1. Local JSON Storage
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your history, bookmarks, Spaces, notes and settings are saved as local JSON files on your device. Orbit has no cloud database that could be subpoenaed, leaked or breached. For extra protection, turn on full-disk encryption (BitLocker, FileVault or LUKS).
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl space-y-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ServerOff className="size-5" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              2. Zero Telemetry
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When you launch TCT Orbit, your network card does not communicate with any corporate analytics endpoint. We do not track which features you use, how many tabs you keep open, or what you type into the omnibox.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl space-y-3">
            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Fingerprint className="size-5" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              3. Fingerprint Noise
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ad networks read canvas pixels, WebGL details and audio output to identify your device. Orbit adds small amounts of noise to these readings so sites can&apos;t build a stable fingerprint of your hardware.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl space-y-3">
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Shield className="size-5" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              4. Clean User-Agent
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Orbit is built on Electron, but it strips the Electron signature from its User-Agent. Sites see a standard Chromium browser, so you blend in with everyone else.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl space-y-3 md:col-span-2">
            <div className="size-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Sliders className="size-5" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              5. Per-Site Permissions
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No website can use your camera, microphone, location, notifications, clipboard (read) or MIDI devices without your permission, and you can revoke any permission per site at any time.
            </p>
          </div>
        </div>

        {/* App security */}
        <div id="architecture" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Lock className="size-5" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">App Security</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <li className="p-3 rounded-xl bg-muted/30 border border-border/40">Web pages run in sandboxed, isolated windows</li>
            <li className="p-3 rounded-xl bg-muted/30 border border-border/40">Cookies are encrypted on disk</li>
            <li className="p-3 rounded-xl bg-muted/30 border border-border/40">Runs only its own bundled code, with tamper checks</li>
            <li className="p-3 rounded-xl bg-muted/30 border border-border/40">Debug launch options are disabled</li>
          </ul>
        </div>

        {/* Network connections */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Globe className="size-5" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Every connection Orbit makes on its own</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Apart from the sites you visit, these are the only network connections the browser makes by itself. None of them carry analytics or usage data.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="p-3 rounded-xl bg-muted/30 border border-border/40">
              <strong className="text-foreground">Ad-blocker lists:</strong> downloads the Ghostery ad &amp; tracker lists.
            </li>
            <li className="p-3 rounded-xl bg-muted/30 border border-border/40">
              <strong className="text-foreground">DNS-over-HTTPS:</strong> the provider you choose (Mullvad, Cloudflare, Quad9 or AdGuard).
            </li>
            <li className="p-3 rounded-xl bg-muted/30 border border-border/40">
              <strong className="text-foreground">Tor check:</strong> only in Tor mode, to confirm your connection goes through Tor.
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="pt-8 text-center space-y-4">
          <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground px-8 font-semibold shadow-lg">
            <Link href="/download" className="flex items-center gap-2">
              <Download className="size-5" />
              <span>Download TCT Orbit</span>
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Free forever • Windows, macOS, Linux • Zero telemetry
          </p>
        </div>
      </div>
    </div>
  );
}
