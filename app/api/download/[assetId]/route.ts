import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ assetId: string }> }
) {
  try {
    const { assetId } = await props.params;

    if (!assetId) {
      return NextResponse.redirect(new URL("/download", request.url), 302);
    }

    const asset = await prisma.releaseAsset.findUnique({
      where: { id: assetId },
      select: { id: true, fileUrl: true, release: { select: { version: true } } },
    });

    if (!asset) {
      return NextResponse.redirect(new URL("/download", request.url), 302);
    }

    // Extract country strictly from CDN geo headers (never raw IP or personal information)
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-country-code") ||
      null;

    // Asynchronously log the privacy-respecting download event
    await prisma.downloadEvent.create({
      data: {
        assetId: asset.id,
        country: country ? country.toUpperCase().slice(0, 2) : null,
      },
    });

    // Validate target URL protocol (guard against open redirect / malformed protocols)
    try {
      const parsedUrl = new URL(asset.fileUrl, request.url);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return NextResponse.redirect(new URL("/download", request.url), 302);
      }

      // If URL points to placeholder downloads.tctorbit.com (unconfigured DNS),
      // seamlessly reroute to official GitHub Releases so users never encounter an NXDOMAIN error
      if (parsedUrl.hostname === "downloads.tctorbit.com") {
        const filename = parsedUrl.pathname.split("/").pop();
        const repo = process.env.GITHUB_REPO || "arzurlab/tct-orbit-browser";
        const tag = encodeURIComponent(asset.release.version);
        const fallbackUrl = filename
          ? `https://github.com/${repo}/releases/download/${tag}/${encodeURIComponent(filename)}`
          : `https://github.com/${repo}/releases`;
        return NextResponse.redirect(fallbackUrl, 302);
      }

      // If the asset is hosted on GitHub Releases and a GITHUB_TOKEN is configured,
      // resolve private release assets directly via GitHub API into a pre-signed CDN download URL
      if (parsedUrl.hostname === "github.com" && process.env.GITHUB_TOKEN) {
        const ghMatch = parsedUrl.pathname.match(
          /^\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/(.+)$/
        );
        if (ghMatch) {
          const [, owner, repo, tag, encodedFilename] = ghMatch;
          const filename = decodeURIComponent(encodedFilename);

          try {
            // Fetch release tag metadata
            const tagRes = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                  Accept: "application/vnd.github.v3+json",
                  "User-Agent": "TCT-Orbit-Download-Gateway",
                },
                next: { revalidate: 300 }, // Cache release metadata for 5 minutes
              }
            );

            if (tagRes.ok) {
              const releaseData = await tagRes.json();
              const matchedAsset = (releaseData.assets || []).find(
                (a: any) => a.name === filename
              );

              if (matchedAsset?.id) {
                // Request the binary download redirect from GitHub API
                const assetDownloadRes = await fetch(
                  `https://api.github.com/repos/${owner}/${repo}/releases/assets/${matchedAsset.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                      Accept: "application/octet-stream",
                      "User-Agent": "TCT-Orbit-Download-Gateway",
                    },
                    redirect: "manual",
                  }
                );

                const s3Location = assetDownloadRes.headers.get("location");
                if (s3Location) {
                  return NextResponse.redirect(s3Location, 302);
                }
              }
            }
          } catch (ghErr) {
            console.warn("Private GitHub release proxy fallback:", ghErr);
          }
        }
      }

      return NextResponse.redirect(parsedUrl.toString(), 302);
    } catch {
      return NextResponse.redirect(new URL("/download", request.url), 302);
    }
  } catch (error) {
    console.error("Download route error:", error);
    return NextResponse.redirect(new URL("/download", request.url), 302);
  }
}
