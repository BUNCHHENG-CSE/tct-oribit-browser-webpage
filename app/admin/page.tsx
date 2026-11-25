import { isAuthenticatedAdmin } from "@/lib/actions/admin/auth";
import { UnauthorizedView } from "@/components/errors/UnauthorizedView";
import { getAdminDashboardStats } from "@/lib/queries/stats";
import { connection } from "next/server";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Suspense } from "react";
import { getAdminPath } from "@/lib/admin-config";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Users,
  ShieldCheck,
  Activity,
  MessageSquare,
  FileSpreadsheet,
  ArrowRight,
  Monitor,
  Apple,
  Terminal,
} from "lucide-react";

export const instant = false;

async function DashboardContent() {
  await connection();
  if (!(await isAuthenticatedAdmin())) return <UnauthorizedView />;
  const [stats, recentFeedback] = await Promise.all([
    getAdminDashboardStats(),
    prisma.feedback.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-10">
      {/* Top Banner & Quick Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">
            Administrative Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Operational metrics, release distribution, feedback pipeline, and subscriber logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl text-xs gap-2">
            <a href="/api/admin/export-subscribers">
              <FileSpreadsheet className="size-4 text-emerald-400" />
              <span>Export Subscribers CSV</span>
            </a>
          </Button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Downloads
            </CardTitle>
            <Download className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold text-foreground">
              {stats.totalDownloads.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              +{stats.recentDownloadsCount} recorded in past 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Subscribers
            </CardTitle>
            <Users className="size-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold text-foreground">
              {stats.totalSubscribers.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Newsletter &amp; Channel Waitlist opt-ins
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Downloads · 30 days
            </CardTitle>
            <ShieldCheck className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold text-purple-400">
              {stats.recentDownloadsCount.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Counted anonymously at the download link
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Activity
            </CardTitle>
            <Activity className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold text-foreground">
              {stats.recentDownloadsCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Downloads logged in the last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Downloads by Platform and Channel Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Platform Breakdown */}
        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base font-heading">Downloads by Operating System</CardTitle>
            <CardDescription className="text-xs">Aggregated across all releases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-2">
                  <Monitor className="size-4 text-blue-500" />
                  <span>Windows</span>
                </span>
                <span className="font-mono">{stats.downloadsByPlatform.WINDOWS || 0}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${Math.min(100, ((stats.downloadsByPlatform.WINDOWS || 1) / (stats.totalDownloads || 1)) * 100 * 25)}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-2">
                  <Apple className="size-4 text-purple-400" />
                  <span>macOS</span>
                </span>
                <span className="font-mono">{stats.downloadsByPlatform.MACOS || 0}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{
                    width: `${Math.min(100, ((stats.downloadsByPlatform.MACOS || 1) / (stats.totalDownloads || 1)) * 100 * 25)}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-2">
                  <Terminal className="size-4 text-emerald-400" />
                  <span>Linux</span>
                </span>
                <span className="font-mono">{stats.downloadsByPlatform.LINUX || 0}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{
                    width: `${Math.min(100, ((stats.downloadsByPlatform.LINUX || 1) / (stats.totalDownloads || 1)) * 100 * 25)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channel Breakdown */}
        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base font-heading">Downloads by Release Channel</CardTitle>
            <CardDescription className="text-xs">Distribution across stability tiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["STABLE", "NOVA", "DEEP", "CANARY"].map((ch) => (
              <div
                key={ch}
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <span className="font-semibold">{ch}</span>
                </div>
                <span className="font-mono text-muted-foreground">
                  {stats.downloadsByChannel[ch] || 0} downloads
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback Submissions */}
      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-heading">Recent User Feedback</CardTitle>
            <CardDescription className="text-xs">Direct submissions from the /support form</CardDescription>
          </div>
          <MessageSquare className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {recentFeedback.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground">
              No feedback messages recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3.5 rounded-xl bg-muted/30 border border-border/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="uppercase font-mono text-[10px]">
                      {fb.category}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(fb.createdAt).toLocaleDateString()} {new Date(fb.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-foreground/90 leading-relaxed font-sans">{fb.message}</p>
                  {fb.email && (
                    <div className="text-[10px] text-muted-foreground">From: {fb.email}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Link href={getAdminPath("releases")} className="group">
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl p-5 hover:border-primary/40 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  Manage Releases
                </h4>
                <p className="text-xs text-muted-foreground">Create releases, publish assets, notes</p>
              </div>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </Card>
        </Link>

        <Link href={getAdminPath("posts")} className="group">
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl p-5 hover:border-primary/40 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  Manage Blog Posts
                </h4>
                <p className="text-xs text-muted-foreground">Draft and publish technical articles</p>
              </div>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </Card>
        </Link>

        <Link href={getAdminPath("faqs")} className="group">
          <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl p-5 hover:border-primary/40 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  Manage FAQs
                </h4>
                <p className="text-xs text-muted-foreground">Maintain categories and answer content</p>
              </div>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse p-2">
      <div className="flex items-center justify-between pb-6 border-b border-border/40">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted/60 rounded-xl" />
          <div className="h-4 w-96 bg-muted/40 rounded-lg" />
        </div>
        <div className="h-10 w-44 bg-muted/50 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-card/60 border border-border/40 rounded-3xl p-6 space-y-3">
            <div className="h-4 w-24 bg-muted/50 rounded" />
            <div className="h-8 w-16 bg-muted/70 rounded" />
          </div>
        ))}
      </div>

      <div className="h-80 bg-card/60 border border-border/40 rounded-3xl p-6" />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
