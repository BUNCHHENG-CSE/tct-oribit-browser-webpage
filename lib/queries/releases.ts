import { prisma } from "@/lib/db";
import { Channel } from "@prisma/client";
import { cacheLife, cacheTag } from "next/cache";

export type SerializedReleaseAsset = {
  id: string;
  releaseId: string;
  platform: "WINDOWS" | "MACOS" | "LINUX";
  arch: string;
  fileType: string;
  fileUrl: string;
  sha256: string;
  sizeBytes: number;
};

export type SerializedRelease = {
  id: string;
  version: string;
  channel: Channel;
  title: string;
  notes: string;
  publishedAt: string;
  createdAt: string;
  assets: SerializedReleaseAsset[];
};

const FILE_ORDER = ["exe", "msi", "dmg", "pkg", "AppImage", "deb", "rpm", "tar.gz"];

function serializeRelease(r: any): SerializedRelease {
  return {
    id: r.id,
    version: r.version,
    channel: r.channel,
    title: r.title,
    notes: r.notes,
    publishedAt: r.publishedAt.toISOString(),
    createdAt: r.createdAt.toISOString(),
    assets: (r.assets || []).map((a: any) => ({
      id: a.id,
      releaseId: a.releaseId,
      platform: a.platform,
      arch: a.arch,
      fileType: a.fileType,
      fileUrl: a.fileUrl,
      sha256: a.sha256,
      sizeBytes: Number(a.sizeBytes),
    })).sort(
      (a: SerializedReleaseAsset, b: SerializedReleaseAsset) =>
        FILE_ORDER.indexOf(a.fileType) - FILE_ORDER.indexOf(b.fileType)
    ),
  };
}

export async function getLatestRelease(channel: Channel = "STABLE"): Promise<SerializedRelease | null> {
  "use cache";
  cacheTag("releases");
  cacheLife("minutes");
  try {
    const release = await prisma.release.findFirst({
      where: { channel },
      orderBy: { publishedAt: "desc" },
      include: { assets: true },
    });
    return release ? serializeRelease(release) : null;
  } catch (error) {
    console.error("Error fetching latest release:", error);
    return null;
  }
}

export async function getAllReleases(): Promise<SerializedRelease[]> {
  "use cache";
  cacheTag("releases");
  cacheLife("minutes");
  try {
    const releases = await prisma.release.findMany({
      orderBy: { publishedAt: "desc" },
      include: { assets: true },
    });
    return releases.map(serializeRelease);
  } catch (error) {
    console.error("Error fetching all releases:", error);
    return [];
  }
}

export async function getChannelReleases(): Promise<Record<Channel, SerializedRelease | null>> {
  const channels: Channel[] = ["STABLE", "NOVA", "DEEP", "CANARY"];
  const result: Record<Channel, SerializedRelease | null> = {
    STABLE: null,
    NOVA: null,
    DEEP: null,
    CANARY: null,
  };

  await Promise.all(
    channels.map(async (c) => {
      result[c] = await getLatestRelease(c);
    })
  );

  return result;
}
