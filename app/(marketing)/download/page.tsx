import type { Metadata } from "next";
import { getLatestRelease } from "@/lib/queries/releases";
import { DownloadCards } from "@/components/sections/DownloadCards";
import { UnverifiedPublisherNotice } from "@/components/sections/UnverifiedPublisherNotice";
import { ShieldCheck, HardDrive, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Download TCT Orbit — Windows, macOS and Linux",
  description:
    "Download TCT Orbit for Windows 10/11 (x64), macOS 10.15+ (Apple Silicon) and Linux (x64). Built on Chromium 156 with zero telemetry and local-only data.",
};

export default async function DownloadPage() {
  const latestRelease = await getLatestRelease("STABLE");

  return (
    <div className="relative pt-12 pb-24 space-y-16">
      {/* Header */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-sm font-medium text-primary">Official stable release</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
          Download TCT Orbit <br />
          <span className="text-muted-foreground">
            {latestRelease?.version || "Latest version"}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Fast, private, and distraction-free desktop web browsing. Built in CI, zero telemetry, SHA-256 checksum for every file.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            Zero Telemetry
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <Cpu className="size-4 text-blue-600 dark:text-blue-400" />
            Chromium 156
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <HardDrive className="size-4 text-purple-600 dark:text-purple-400" />
            Local Data Only
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <UnverifiedPublisherNotice />
        <DownloadCards release={latestRelease} />
      </div>
    </div>
  );
}
