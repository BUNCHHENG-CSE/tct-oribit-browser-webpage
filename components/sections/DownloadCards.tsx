"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Monitor,
  Apple,
  Terminal,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import type { SerializedRelease } from "@/lib/queries/releases";

const RELEASES_URL = "https://github.com/arzurlab/tct-orbit-browser/releases";

/** SHA-256 of an empty file — older seed/webhook data used it as a placeholder. */
const EMPTY_FILE_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

function hasRealChecksum(sha: string) {
  return /^[a-f0-9]{64}$/i.test(sha) && sha.toLowerCase() !== EMPTY_FILE_SHA256;
}

interface DownloadCardsProps {
  release: SerializedRelease | null;
}

function ShaRow({ sha, copied, onCopy }: { sha: string; copied: boolean; onCopy: (sha: string) => void }) {
  if (!hasRealChecksum(sha)) {
    return (
      <div className="p-1.5 rounded-lg bg-background/80 border border-border/50 text-[10px] text-muted-foreground">
        Checksum not published for this build yet.
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-background/80 border border-border/50 text-[10px] font-mono text-muted-foreground min-w-0">
      <span className="truncate min-w-0" title={sha}>SHA256: {sha}</span>
      <button
        type="button"
        onClick={() => onCopy(sha)}
        className="shrink-0 p-1 hover:text-foreground transition-colors cursor-pointer"
        title="Copy SHA-256"
        aria-label="Copy SHA-256 checksum"
      >
        {copied ? <Check className="size-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-3" />}
      </button>
    </div>
  );
}

export function DownloadCards({ release }: DownloadCardsProps) {
  const [copiedSha, setCopiedSha] = React.useState<string | null>(null);

  const copyToClipboard = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedSha(hash);
      toast.success("SHA-256 hash copied to clipboard!");
      setTimeout(() => setCopiedSha(null), 2500);
    } catch {
      toast.error("Couldn't access the clipboard. Select the hash and copy it manually.");
    }
  };

  const formatSize = (bytes: number) => {
    return bytes > 0 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : "";
  };

  // Group assets by platform
  const windowsAssets = release?.assets.filter((a) => a.platform === "WINDOWS") || [];
  const macAssets = release?.assets.filter((a) => a.platform === "MACOS") || [];
  const linuxAssets = release?.assets.filter((a) => a.platform === "LINUX") || [];

  // Real file names for the install guide
  const fileName = (type: string, fallback: string) => {
    const url = release?.assets.find((a) => a.fileType === type)?.fileUrl;
    return url ? decodeURIComponent(url.split("/").pop() || fallback) : fallback;
  };
  const exeName = fileName("exe", "tct-orbit-setup.exe");
  const dmgName = fileName("dmg", "tct-orbit.dmg");
  const appImageName = fileName("AppImage", "tct-orbit.AppImage");
  const debName = fileName("deb", "tct-orbit.deb");

  return (
    <div className="space-y-10">
      {/* GitHub Actions CI/CD Verification Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl text-xs text-muted-foreground shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm">Built by GitHub Actions</div>
            <div>Every installer is built and published by our public CI. Builds are not code-signed yet, and there is no auto-update yet: check the changelog for new versions.</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 h-9 w-full sm:w-auto">
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5"
            >
              <span>GitHub Actions &amp; Releases</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>
          </Button>
        </div>
      </div>

      {/* 3 Main Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Windows Card */}
        <Card className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-xl flex flex-col justify-between shadow-xl hover:border-blue-500/40 transition-all hover:-translate-y-1">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                <Monitor className="size-6" />
              </div>
              <Badge variant="secondary" className="font-mono text-xs">
                {release?.version || "Latest"}
              </Badge>
            </div>
            <div>
              <CardTitle className="text-2xl font-heading font-bold">Windows</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Windows 10 / 11 (x64)
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2 text-xs">
              {windowsAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-2"
                >
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <span>
                      {asset.arch.toUpperCase()} Installer (.{asset.fileType})
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {formatSize(asset.sizeBytes)}
                    </span>
                  </div>

                  {/* SHA-256 with copy */}
                  <ShaRow sha={asset.sha256} copied={copiedSha === asset.sha256} onCopy={copyToClipboard} />

                  <Button asChild size="sm" className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs">
                    <a href={`/api/download/${asset.id}`} className="flex items-center justify-center gap-1.5">
                      <Download className="size-3.5" />
                      <span>Download .{asset.fileType}</span>
                    </a>
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">System Requirements:</div>
              <div>• Windows 10 or 11</div>
              <div>• 64-bit (x64) Intel or AMD processor</div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
            Not code-signed yet. If SmartScreen warns you, choose More info → Run anyway.
          </CardFooter>
        </Card>

        {/* macOS Card */}
        <Card className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-xl flex flex-col justify-between shadow-xl hover:border-purple-500/40 transition-all hover:-translate-y-1">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Apple className="size-6" />
              </div>
              <Badge variant="secondary" className="font-mono text-xs">
                {release?.version || "Latest"}
              </Badge>
            </div>
            <div>
              <CardTitle className="text-2xl font-heading font-bold">macOS</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                macOS 10.15 or newer (Apple Silicon)
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2 text-xs">
              {macAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-2"
                >
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <span>
                      {asset.arch === "arm64" ? "Apple Silicon" : asset.arch} (.{asset.fileType})
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {formatSize(asset.sizeBytes)}
                    </span>
                  </div>

                  <ShaRow sha={asset.sha256} copied={copiedSha === asset.sha256} onCopy={copyToClipboard} />

                  <Button asChild size="sm" className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs">
                    <a href={`/api/download/${asset.id}`} className="flex items-center justify-center gap-1.5">
                      <Download className="size-3.5" />
                      <span>Download .{asset.fileType}</span>
                    </a>
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">System Requirements:</div>
              <div>• macOS 10.15 or newer</div>
              <div>• Apple Silicon Mac (no Intel build yet)</div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
            Not notarized yet. If macOS blocks it, go to System Settings → Privacy &amp; Security → Open Anyway.
          </CardFooter>
        </Card>

        {/* Linux Card */}
        <Card className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-xl flex flex-col justify-between shadow-xl hover:border-emerald-500/40 transition-all hover:-translate-y-1">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Terminal className="size-6" />
              </div>
              <Badge variant="secondary" className="font-mono text-xs">
                {release?.version || "Latest"}
              </Badge>
            </div>
            <div>
              <CardTitle className="text-2xl font-heading font-bold">Linux</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                64-bit (x64): AppImage and .deb
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2 text-xs">
              {linuxAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-2"
                >
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <span>
                      Package: .{asset.fileType} ({asset.arch})
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {formatSize(asset.sizeBytes)}
                    </span>
                  </div>

                  <ShaRow sha={asset.sha256} copied={copiedSha === asset.sha256} onCopy={copyToClipboard} />

                  <Button asChild size="sm" className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs">
                    <a href={`/api/download/${asset.id}`} className="flex items-center justify-center gap-1.5">
                      <Download className="size-3.5" />
                      <span>Download .{asset.fileType}</span>
                    </a>
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">System Requirements:</div>
              <div>• 64-bit (x64) Linux</div>
              <div>• AppImage runs on most distributions</div>
              <div>• .deb for Debian, Ubuntu and derivatives</div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
            Verify downloads with the SHA-256 checksums above.
          </CardFooter>
        </Card>
      </div>

      {/* Installation steps per OS in Tabs */}
      <div className="rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl p-8 sm:p-10 space-y-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-heading font-bold text-foreground">
            Installation &amp; Verification Guide
          </h3>
          <p className="text-xs text-muted-foreground">
            Quick setup guide for every supported operating system
          </p>
        </div>

        <Tabs defaultValue="windows" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="windows" className="text-xs">Windows</TabsTrigger>
            <TabsTrigger value="macos" className="text-xs">macOS</TabsTrigger>
            <TabsTrigger value="linux" className="text-xs">Linux</TabsTrigger>
          </TabsList>

          <TabsContent value="windows" className="pt-4 space-y-3 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <span>Download the x64 <code>.exe</code> installer.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <span>Double-click to run the setup wizard. The installer isn&apos;t code-signed yet, so if SmartScreen appears, choose <strong>More info → Run anyway</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <span>Optional SHA-256 check via PowerShell: <br />
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded block mt-1">{`Get-FileHash .\\${exeName} -Algorithm SHA256`}</code>
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="macos" className="pt-4 space-y-3 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <span>Download the Apple Silicon <code>.dmg</code> file.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <span>Open the DMG and drag <strong>TCT Orbit.app</strong> into Applications. The app isn&apos;t notarized yet, so if macOS blocks it, go to <strong>System Settings → Privacy &amp; Security → Open Anyway</strong> (macOS 14 or older: right-click it and choose <strong>Open</strong>).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <span>Optional terminal checksum verification: <br />
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded block mt-1">{`shasum -a 256 ~/Downloads/${dmgName}`}</code>
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="linux" className="pt-4 space-y-3 text-sm text-muted-foreground">
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">AppImage (Universal):</strong>
                <pre className="p-3 rounded-xl border border-border bg-muted font-mono text-xs text-foreground mt-1 overflow-x-auto">
                  {`chmod +x ./${appImageName}\n./${appImageName}`}
                </pre>
              </div>
              <div>
                <strong className="text-foreground">Debian / Ubuntu (.deb):</strong>
                <pre className="p-3 rounded-xl border border-border bg-muted font-mono text-xs text-foreground mt-1 overflow-x-auto">
                  {`sudo dpkg -i ./${debName}\nsudo apt-get install -f`}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
