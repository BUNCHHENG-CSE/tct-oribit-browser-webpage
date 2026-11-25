import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { Channel } from "@prisma/client";
import { timingSafeEqualStr } from "@/lib/auth-edge";
import { getAdminPath } from "@/lib/admin-config";
import { syncReleaseFromGitHub } from "@/lib/github-sync";

/**
 * Called by the browser repo's build workflow once every installer of a release is uploaded.
 * Body: { "tag": "v0.1.5", "channel"?: "STABLE" }
 *
 * The caller only names a tag. Files, sizes and checksums are read from GITHUB_REPO on GitHub,
 * so a request can never point visitors at some other download.
 */
const VALID_CHANNELS = new Set<string>(["STABLE", "NOVA", "DEEP", "CANARY"]);
const TAG_PATTERN = /^v\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;

export async function POST(request: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.error("GITHUB_WEBHOOK_SECRET is not configured; refusing webhook.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  if (!timingSafeEqualStr(request.headers.get("x-orbit-webhook-secret") || "", secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { tag?: unknown; channel?: unknown } | null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const tag = body?.tag;
  if (typeof tag !== "string" || !TAG_PATTERN.test(tag)) {
    return NextResponse.json({ error: "Expected a version tag such as v0.1.5" }, { status: 400 });
  }
  const channel = String(body?.channel ?? "STABLE").toUpperCase();
  if (!VALID_CHANNELS.has(channel)) {
    return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
  }

  const result = await syncReleaseFromGitHub(undefined, channel as Channel, tag);
  if (!result.success) {
    console.error("Release webhook sync failed:", result.message);
    return NextResponse.json({ error: result.message }, { status: 502 });
  }

  // Expire now: visitors should not get the previous version after a release.
  revalidateTag("releases", { expire: 0 });
  for (const path of ["/", "/download", "/channels", "/changelog", getAdminPath("releases")]) {
    revalidatePath(path);
  }

  return NextResponse.json(result);
}
