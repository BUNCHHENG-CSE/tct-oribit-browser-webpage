"use server";

import { prisma } from "@/lib/db";
import { isAuthenticatedAdmin } from "./auth";
import { ReleaseSchema, ReleaseAssetSchema } from "@/lib/validations";
import { safeRevalidatePath, safeUpdateTags } from "@/lib/safe-revalidate";
import { getAdminPath } from "@/lib/admin-config";
import { syncReleaseFromGitHub } from "@/lib/github-sync";
import type { ActionResult } from "../subscribe";

export async function createReleaseAction(formData: FormData): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const rawData = {
      version: formData.get("version"),
      channel: formData.get("channel"),
      title: formData.get("title"),
      notes: formData.get("notes"),
    };

    const parsed = ReleaseSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message || "Invalid release data." };
    }

    await prisma.release.create({
      data: {
        version: parsed.data.version,
        channel: parsed.data.channel as any,
        title: parsed.data.title,
        notes: parsed.data.notes,
        publishedAt: new Date(),
      },
    });

    safeUpdateTags("releases");

    safeRevalidatePath("/admin/releases");
    safeRevalidatePath(getAdminPath("releases"));
    safeRevalidatePath("/download");
    safeRevalidatePath("/channels");
    safeRevalidatePath("/changelog");
    safeRevalidatePath("/");

    return { success: true, message: `Release ${parsed.data.version} created.` };
  } catch (error) {
    console.error("Create release error:", error);
    return { success: false, message: "Failed to create release." };
  }
}

export async function updateReleaseAction(id: string, formData: FormData): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const rawData = {
      version: formData.get("version"),
      channel: formData.get("channel"),
      title: formData.get("title"),
      notes: formData.get("notes"),
    };

    const parsed = ReleaseSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message || "Invalid data." };
    }

    await prisma.release.update({
      where: { id },
      data: {
        version: parsed.data.version,
        channel: parsed.data.channel as any,
        title: parsed.data.title,
        notes: parsed.data.notes,
      },
    });

    safeUpdateTags("releases");

    safeRevalidatePath("/admin/releases");
    safeRevalidatePath(getAdminPath("releases"));
    safeRevalidatePath("/download");
    safeRevalidatePath("/channels");
    safeRevalidatePath("/changelog");

    return { success: true, message: "Release updated successfully." };
  } catch (error) {
    console.error("Update release error:", error);
    return { success: false, message: "Failed to update release." };
  }
}

export async function deleteReleaseAction(id: string): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    await prisma.release.delete({ where: { id } });
    safeUpdateTags("releases");
    safeRevalidatePath("/admin/releases");
    safeRevalidatePath(getAdminPath("releases"));
    safeRevalidatePath("/download");
    safeRevalidatePath("/channels");
    safeRevalidatePath("/changelog");
    return { success: true, message: "Release deleted." };
  } catch (error) {
    console.error("Delete release error:", error);
    return { success: false, message: "Failed to delete release." };
  }
}

export async function addReleaseAssetAction(releaseId: string, formData: FormData): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const rawData = {
      platform: formData.get("platform"),
      arch: formData.get("arch"),
      fileType: formData.get("fileType"),
      fileUrl: formData.get("fileUrl"),
      sha256: formData.get("sha256"),
      sizeBytes: formData.get("sizeBytes"),
    };

    const parsed = ReleaseAssetSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message || "Invalid asset data." };
    }

    await prisma.releaseAsset.create({
      data: {
        releaseId,
        platform: parsed.data.platform as any,
        arch: parsed.data.arch,
        fileType: parsed.data.fileType,
        fileUrl: parsed.data.fileUrl,
        sha256: parsed.data.sha256,
        sizeBytes: BigInt(parsed.data.sizeBytes),
      },
    });

    safeUpdateTags("releases");

    safeRevalidatePath("/admin/releases");
    safeRevalidatePath(getAdminPath("releases"));
    safeRevalidatePath("/download");
    return { success: true, message: "Asset added." };
  } catch (error) {
    console.error("Add asset error:", error);
    return { success: false, message: "Failed to add asset." };
  }
}

export async function deleteReleaseAssetAction(assetId: string): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    await prisma.releaseAsset.delete({ where: { id: assetId } });
    safeUpdateTags("releases");
    safeRevalidatePath("/admin/releases");
    safeRevalidatePath(getAdminPath("releases"));
    safeRevalidatePath("/download");
    return { success: true, message: "Asset deleted." };
  } catch (error) {
    console.error("Delete asset error:", error);
    return { success: false, message: "Failed to delete asset." };
  }
}

export async function syncGitHubReleaseAction(formData: FormData): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const repo =
      (formData.get("repo") as string) ||
      process.env.GITHUB_REPO ||
      "arzurlab/tct-orbit-browser";
    const channel = (formData.get("channel") as any) || "STABLE";
    const tag = (formData.get("tag") as string) || undefined;

    const result = await syncReleaseFromGitHub(repo, channel, tag);

    if (result.success) {
      safeUpdateTags("releases");
      safeRevalidatePath("/admin/releases");
      safeRevalidatePath(getAdminPath("releases"));
      safeRevalidatePath("/download");
      safeRevalidatePath("/channels");
      safeRevalidatePath("/changelog");
      safeRevalidatePath("/");
    }

    return { success: result.success, message: result.message };
  } catch (error) {
    console.error("Sync GitHub Release error:", error);
    return { success: false, message: "Failed to synchronize from GitHub." };
  }
}
