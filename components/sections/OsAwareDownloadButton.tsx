"use client";

import * as React from "react";
import Link from "next/link";
import { getClientOS, getOSLabel, type DetectedOS } from "@/lib/os-detect";
import { Download, TriangleAlert } from "lucide-react";
import type { SerializedRelease } from "@/lib/queries/releases";

interface OsAwareDownloadButtonProps {
  release?: SerializedRelease | null;
  className?: string;
  /** Show the "Other platforms" link under the button */
  showSubLink?: boolean;
  /** "light" = white button for use on colored/dark panels */
  variant?: "primary" | "light";
}

/**
 * One clear call to action: download for the visitor's OS.
 * Falls back to /download when no matching build exists.
 */
export function OsAwareDownloadButton({
  release,
  className = "",
  showSubLink = true,
  variant = "primary",
}: OsAwareDownloadButtonProps) {
  const [os, setOs] = React.useState<DetectedOS | null>(null);

  React.useEffect(() => {
    setOs(getClientOS());
  }, []);

  const asset = os ? release?.assets?.find((a) => a.platform === os) : undefined;
  const href = asset ? `/api/download/${asset.id}` : "/download";
  const version = release?.version;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <a
        href={href}
        className={`inline-flex h-12 items-center gap-2.5 rounded-full px-7 text-[15px] font-medium transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
          variant === "light"
            ? "bg-white text-neutral-900 shadow-lg shadow-black/20 hover:bg-white/90"
            : "bg-primary text-primary-foreground shadow-[0_8px_24px_-6px_color-mix(in_oklch,var(--primary)_60%,transparent)] hover:bg-primary/90"
        }`}
      >
        <Download className="size-4" aria-hidden />
        {os ? `Download for ${getOSLabel(os)}` : "Download TCT Orbit"}
      </a>
      {showSubLink && (
        <p className={`text-sm ${variant === "light" ? "text-white/75" : "text-muted-foreground"}`}>
          Free{version ? ` · ${version.startsWith("v") ? version : `v${version}`}` : ""} ·{" "}
          <Link
            href="/download"
            className={`underline underline-offset-4 ${variant === "light" ? "hover:text-white" : "hover:text-foreground"}`}
          >
            Other platforms
          </Link>
        </p>
      )}
      {showSubLink && os !== "LINUX" && (
        <p className="max-w-md rounded-xl border border-amber-500/60 bg-amber-100 px-4 py-2.5 text-center text-sm text-amber-950">
          <TriangleAlert className="mr-1.5 inline size-4 align-[-3px]" aria-hidden />
          Publisher not verified by Microsoft or Apple yet. Install at your own responsibility.{" "}
          <Link
            href="/download#unverified-publisher"
            className="font-medium underline underline-offset-4"
          >
            What to expect
          </Link>
        </p>
      )}
    </div>
  );
}
