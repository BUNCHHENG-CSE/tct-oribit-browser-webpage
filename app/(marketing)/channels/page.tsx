import type { Metadata } from "next";
import { getChannelReleases } from "@/lib/queries/releases";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Zap,
  Flame,
  AlertTriangle,
  Download,
  HardDrive,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Release Channels — Stable, Nova, Deep & Canary",
  description:
    "TCT Orbit release channels: Stable is available now. Nova (beta), Deep (nightly) and Canary (experimental) are coming soon.",
};

export default async function ChannelsPage() {
  const channelData = await getChannelReleases();

  const channels = [
    {
      id: "STABLE",
      name: "TCT Orbit Stable",
      subtitle: "For everyday browsing",
      version: channelData.STABLE?.version || "Latest",
      description: "The recommended build for daily use.",
      badge: "STABLE",
      badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/30",
      buttonColor: "bg-blue-600 hover:bg-blue-500 text-white",
      icon: ShieldCheck,
      stability: "Recommended",
      asset: channelData.STABLE?.assets?.[0],
      // Stable always links somewhere useful: its asset or the download page.
      available: true,
    },
    {
      id: "NOVA",
      name: "TCT Orbit Nova",
      subtitle: "Public beta",
      version: channelData.NOVA?.version,
      description: "Try new features before they reach Stable.",
      badge: "BETA",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      buttonColor: "bg-purple-600 hover:bg-purple-500 text-white",
      icon: Zap,
      stability: "Beta",
      asset: channelData.NOVA?.assets?.[0],
      available: Boolean(channelData.NOVA?.assets?.length),
    },
    {
      id: "DEEP",
      name: "TCT Orbit Deep",
      subtitle: "Nightly builds",
      version: channelData.DEEP?.version,
      description: "Built from the main development branch. Expect rough edges.",
      badge: "NIGHTLY",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      buttonColor: "bg-emerald-600 hover:bg-emerald-500 text-white",
      icon: Flame,
      stability: "Unstable",
      asset: channelData.DEEP?.assets?.[0],
      available: Boolean(channelData.DEEP?.assets?.length),
    },
    {
      id: "CANARY",
      name: "TCT Orbit Canary",
      subtitle: "Experimental builds",
      version: channelData.CANARY?.version,
      description: "For testing experiments. May break or crash.",
      badge: "CANARY",
      badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
      buttonColor: "bg-amber-600 hover:bg-amber-500 text-white",
      icon: AlertTriangle,
      stability: "Experimental",
      asset: channelData.CANARY?.assets?.[0],
      available: Boolean(channelData.CANARY?.assets?.length),
    },
  ];

  return (
    <div className="relative pt-12 pb-24 space-y-20">
      {/* Header */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-sm font-medium text-primary">Release velocity</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
          Choose your Orbit. <br />
          <span className="text-muted-foreground">
            Stable now. More channels soon.
          </span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Stable is ready for everyday use. Nova (beta), Deep (nightly) and Canary (experimental) builds aren&apos;t available yet. Join the waitlist below to hear when they launch.
        </p>

        {/* Side-by-side reassurance banner */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 max-w-xl mx-auto flex items-center justify-center gap-3 text-xs text-foreground/90 font-medium">
          <HardDrive className="size-4 text-primary shrink-0" />
          <span>All channels keep your data in local files on your device.</span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map((c) => {
            const Icon = c.icon;
            const downloadHref = c.asset
              ? `/api/download/${c.asset.id}`
              : `/download`;

            return (
              <Card
                key={c.id}
                className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-xl flex flex-col justify-between shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="size-11 rounded-2xl bg-muted flex items-center justify-center">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="outline" className={`font-mono text-[10px] ${c.badgeColor}`}>
                      {c.badge}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">{c.name}</CardTitle>
                    <div className="text-xs font-mono font-medium text-primary mt-1">
                      {c.available ? c.version : "Coming soon"}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground mt-1">
                      {c.subtitle}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Stability:</span>
                      <span className="font-medium text-foreground">{c.stability}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  {c.available ? (
                    <Button asChild className={`w-full rounded-xl font-semibold text-xs shadow-md ${c.buttonColor}`}>
                      <a href={downloadHref} className="flex items-center justify-center gap-1.5">
                        <Download className="size-3.5" />
                        <span>Download {c.badge}</span>
                      </a>
                    </Button>
                  ) : (
                    <Button disabled variant="outline" className="w-full rounded-xl font-semibold text-xs">
                      Coming soon
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Beta Waitlist Form Section */}
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-b from-card/90 to-card/50 backdrop-blur-xl p-8 sm:p-12 shadow-2xl text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Join the Beta &amp; Nightly Waitlist
            </h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Get an email when the Nova, Deep and Canary channels launch.
            </p>
          </div>

          <WaitlistForm />
        </div>
      </div>
    </div>
  );
}
