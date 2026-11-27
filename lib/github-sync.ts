import { prisma } from "@/lib/db";
import { Channel, Platform } from "@prisma/client";

export interface ParsedGitHubAsset {
  platform: Platform;
  arch: string;
  fileType: string;
  fileUrl: string;
  sha256: string;
  sizeBytes: number;
}

export interface GitHubSyncResult {
  success: boolean;
  message: string;
  version?: string;
  assetsCount?: number;
}

/**
 * Infer platform, architecture, and fileType from binary asset filename
 */
export function inferAssetMetadata(filename: string): {
  platform: Platform | null;
  arch: string;
  fileType: string;
} {
  const lower = filename.toLowerCase();

  let platform: Platform | null = null;
  let arch = "x64";
  let fileType = "bin";

  // Platform detection, by installer extension only. Releases also carry auto-update
  // metadata (latest-mac.yml, latest-linux.yml, *.blockmap) that is not a download.
  if (lower.endsWith(".exe") || lower.endsWith(".msi")) {
    platform = "WINDOWS";
    fileType = lower.endsWith(".msi") ? "msi" : "exe";
  } else if (lower.endsWith(".dmg") || lower.endsWith(".pkg")) {
    platform = "MACOS";
    fileType = lower.endsWith(".pkg") ? "pkg" : "dmg";
  } else if (lower.endsWith(".appimage")) {
    platform = "LINUX";
    fileType = "AppImage";
  } else if (lower.endsWith(".deb") || lower.endsWith(".rpm")) {
    platform = "LINUX";
    fileType = lower.endsWith(".deb") ? "deb" : "rpm";
  } else if (lower.endsWith(".tar.gz") && lower.includes("linux")) {
    platform = "LINUX";
    fileType = "tar.gz";
  }

  // Architecture detection
  if (lower.includes("arm64") || lower.includes("aarch64") || lower.includes("m1") || lower.includes("apple-silicon")) {
    arch = "arm64";
  } else if (lower.includes("x86_64") || lower.includes("x64") || lower.includes("amd64")) {
    arch = "x64";
  }

  return { platform, arch, fileType };
}

/**
 * Fetch and synchronize a GitHub release into the database
 */
export async function syncReleaseFromGitHub(
  repo: string = process.env.GITHUB_REPO || "arzurlab/tct-orbit-browser",
  channel: Channel = "STABLE",
  tag?: string
): Promise<GitHubSyncResult> {
  try {
    const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(cleanRepo)) {
      return { success: false, message: `Invalid repository "${cleanRepo}". Use the form owner/repo.` };
    }
    const endpoint = tag
      ? `https://api.github.com/repos/${cleanRepo}/releases/tags/${encodeURIComponent(tag)}`
      : `https://api.github.com/repos/${cleanRepo}/releases/latest`;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "TCT-Orbit-Release-Sync",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(endpoint, {
      headers,
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `GitHub API error: ${response.status} ${response.statusText} (${endpoint})`,
      };
    }

    const ghRelease = await response.json();
    const version = ghRelease.tag_name || tag || "v0.1.2";
    // GitHub names an untitled release after its tag; show the product name instead.
    const title = ghRelease.name && ghRelease.name !== version ? ghRelease.name : `TCT Orbit ${version}`;
    const notes =
      ghRelease.body ||
      `Official ${version} build produced and distributed via GitHub Actions CI/CD for Windows, macOS, and Linux.`;
    const publishedAt = ghRelease.published_at ? new Date(ghRelease.published_at) : new Date();

    // Look for sha256sums.txt if attached
    const checksumAsset = (ghRelease.assets || []).find((a: any) =>
      a.name.toLowerCase().includes("sha256")
    );
    const checksumMap = new Map<string, string>();

    if (checksumAsset?.browser_download_url) {
      try {
        const csRes = await fetch(checksumAsset.browser_download_url);
        if (csRes.ok) {
          const csText = await csRes.text();
          for (const line of csText.split("\n")) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2) {
              const hash = parts[0];
              const file = parts[1].replace(/^\*/, "").replace(/^dist\//, "");
              checksumMap.set(file.toLowerCase(), hash);
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch sha256sums.txt:", err);
      }
    }

    // Parse installer assets
    const parsedAssets: ParsedGitHubAsset[] = [];
    for (const asset of ghRelease.assets || []) {
      const { platform, arch, fileType } = inferAssetMetadata(asset.name);
      if (!platform) continue; // Skip non-binary assets like checksum txt or zips

      // Prefer sha256sums.txt, then GitHub's own asset digest. Never invent a hash.
      const digest = typeof asset.digest === "string" ? asset.digest.replace(/^sha256:/, "") : "";
      const candidate = checksumMap.get(asset.name.toLowerCase()) || digest;
      const sha = /^[a-f0-9]{64}$/i.test(candidate) ? candidate.toLowerCase() : "";

      parsedAssets.push({
        platform,
        arch,
        fileType,
        fileUrl: asset.browser_download_url,
        sha256: sha,
        sizeBytes: Number(asset.size) > 0 ? Number(asset.size) : 0,
      });
    }

    if (parsedAssets.length === 0) {
      return {
        success: false,
        message: `GitHub release ${version} found, but no Windows, macOS, or Linux binary assets (.exe, .dmg, .AppImage, .deb) were detected.`,
      };
    }

    // One transaction, so the site never shows a half-updated release. Existing files are
    // updated in place: deleting an asset would also delete its download statistics.
    await prisma.$transaction(
      async (tx) => {
        const existing = await tx.release.findFirst({
          where: { version, channel },
          include: { assets: { select: { id: true, fileUrl: true } } },
        });
        const release = existing
          ? await tx.release.update({ where: { id: existing.id }, data: { title, notes, publishedAt } })
          : await tx.release.create({ data: { version, channel, title, notes, publishedAt } });

        const urls = parsedAssets.map((a) => a.fileUrl);
        await tx.releaseAsset.deleteMany({ where: { releaseId: release.id, fileUrl: { notIn: urls } } });

        for (const { sizeBytes, ...asset } of parsedAssets) {
          const data = { ...asset, sizeBytes: BigInt(sizeBytes) };
          const current = existing?.assets.find((a) => a.fileUrl === asset.fileUrl);
          if (current) await tx.releaseAsset.update({ where: { id: current.id }, data });
          else await tx.releaseAsset.create({ data: { ...data, releaseId: release.id } });
        }
      },
      { timeout: 20000 }
    );

    return {
      success: true,
      message: `Successfully synchronized ${parsedAssets.length} OS binaries for ${version} (${channel}) from GitHub Actions!`,
      version,
      assetsCount: parsedAssets.length,
    };
  } catch (error: any) {
    console.error("GitHub Sync error:", error);
    return {
      success: false,
      message: error.message || "Failed to synchronize release from GitHub.",
    };
  }
}
