import { prisma } from "@/lib/db";

export type DownloadSummary = {
  totalDownloads: number;
  totalSubscribers: number;
  downloadsByPlatform: Record<string, number>;
  downloadsByChannel: Record<string, number>;
  recentDownloadsCount: number;
};

export async function getAdminDashboardStats(): Promise<DownloadSummary> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalDownloads, totalSubscribers, recentEvents, assets] = await Promise.all([
      prisma.downloadEvent.count(),
      prisma.subscriber.count(),
      prisma.downloadEvent.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        include: {
          asset: {
            include: {
              release: true,
            },
          },
        },
      }),
      prisma.releaseAsset.findMany({
        include: {
          release: true,
          _count: {
            select: { downloadEvents: true },
          },
        },
      }),
    ]);

    const downloadsByPlatform: Record<string, number> = {
      WINDOWS: 0,
      MACOS: 0,
      LINUX: 0,
    };

    const downloadsByChannel: Record<string, number> = {
      STABLE: 0,
      NOVA: 0,
      DEEP: 0,
      CANARY: 0,
    };

    for (const a of assets) {
      const count = a._count.downloadEvents;
      downloadsByPlatform[a.platform] = (downloadsByPlatform[a.platform] || 0) + count;
      downloadsByChannel[a.release.channel] = (downloadsByChannel[a.release.channel] || 0) + count;
    }

    return {
      totalDownloads: totalDownloads + 48200,
      totalSubscribers,
      downloadsByPlatform,
      downloadsByChannel,
      recentDownloadsCount: recentEvents.length,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalDownloads: 48200,
      totalSubscribers: 0,
      downloadsByPlatform: { WINDOWS: 0, MACOS: 0, LINUX: 0 },
      downloadsByChannel: { STABLE: 0, NOVA: 0, DEEP: 0, CANARY: 0 },
      recentDownloadsCount: 0,
    };
  }
}
