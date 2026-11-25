"use server";

import { prisma } from "@/lib/db";
import { isAuthenticatedAdmin } from "./auth";
import { PostSchema } from "@/lib/validations";
import { safeRevalidatePath, safeUpdateTags } from "@/lib/safe-revalidate";
import { getAdminPath } from "@/lib/admin-config";
import type { ActionResult } from "../subscribe";

export async function createPostAction(formData: FormData): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const rawTags = (formData.get("tags") as string) || "";
    const tags = rawTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const rawData = {
      title: formData.get("title"),
      slug: (formData.get("slug") as string)?.toLowerCase().trim(),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      coverImage: formData.get("coverImage"),
      author: formData.get("author"),
      tags: rawTags,
      published: formData.get("published") === "true",
    };

    const parsed = PostSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message || "Invalid post data." };
    }

    const existing = await prisma.post.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (existing) {
      return { success: false, message: "A post with this slug already exists." };
    }

    await prisma.post.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage,
        author: parsed.data.author,
        tags,
        published: parsed.data.published,
      },
    });

    safeUpdateTags("posts");

    safeRevalidatePath("/admin/posts");
    safeRevalidatePath(getAdminPath("posts"));
    safeRevalidatePath("/blog");
    safeRevalidatePath(`/blog/${parsed.data.slug}`);

    return { success: true, message: "Blog post published." };
  } catch (error) {
    console.error("Create post error:", error);
    return { success: false, message: "Failed to create post." };
  }
}

export async function updatePostAction(id: string, formData: FormData): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const rawTags = (formData.get("tags") as string) || "";
    const tags = rawTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const rawData = {
      title: formData.get("title"),
      slug: (formData.get("slug") as string)?.toLowerCase().trim(),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      coverImage: formData.get("coverImage"),
      author: formData.get("author"),
      tags: rawTags,
      published: formData.get("published") === "true",
    };

    const parsed = PostSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message || "Invalid post data." };
    }

    await prisma.post.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage,
        author: parsed.data.author,
        tags,
        published: parsed.data.published,
      },
    });

    safeUpdateTags("posts");

    safeRevalidatePath("/admin/posts");
    safeRevalidatePath(getAdminPath("posts"));
    safeRevalidatePath("/blog");
    safeRevalidatePath(`/blog/${parsed.data.slug}`);

    return { success: true, message: "Post updated." };
  } catch (error) {
    console.error("Update post error:", error);
    return { success: false, message: "Failed to update post." };
  }
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    await prisma.post.delete({ where: { id } });
    safeUpdateTags("posts");
    safeRevalidatePath("/admin/posts");
    safeRevalidatePath(getAdminPath("posts"));
    safeRevalidatePath("/blog");
    return { success: true, message: "Post deleted." };
  } catch (error) {
    console.error("Delete post error:", error);
    return { success: false, message: "Failed to delete post." };
  }
}
