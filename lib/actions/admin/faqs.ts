"use server";

import { prisma } from "@/lib/db";
import { isAuthenticatedAdmin } from "./auth";
import { FaqSchema } from "@/lib/validations";
import { safeRevalidatePath, safeUpdateTags } from "@/lib/safe-revalidate";
import { getAdminPath } from "@/lib/admin-config";
import type { ActionResult } from "../subscribe";

export async function createFaqAction(formData: FormData): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const rawData = {
      question: formData.get("question"),
      answer: formData.get("answer"),
      category: formData.get("category"),
      order: formData.get("order"),
    };

    const parsed = FaqSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message || "Invalid FAQ data." };
    }

    await prisma.faq.create({
      data: {
        question: parsed.data.question,
        answer: parsed.data.answer,
        category: parsed.data.category,
        order: parsed.data.order,
      },
    });

    safeUpdateTags("faqs");

    safeRevalidatePath("/admin/faqs");
    safeRevalidatePath(getAdminPath("faqs"));
    safeRevalidatePath("/support");
    safeRevalidatePath("/");

    return { success: true, message: "FAQ created." };
  } catch (error) {
    console.error("Create FAQ error:", error);
    return { success: false, message: "Failed to create FAQ." };
  }
}

export async function updateFaqAction(id: string, formData: FormData): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    const rawData = {
      question: formData.get("question"),
      answer: formData.get("answer"),
      category: formData.get("category"),
      order: formData.get("order"),
    };

    const parsed = FaqSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message || "Invalid FAQ data." };
    }

    await prisma.faq.update({
      where: { id },
      data: {
        question: parsed.data.question,
        answer: parsed.data.answer,
        category: parsed.data.category,
        order: parsed.data.order,
      },
    });

    safeUpdateTags("faqs");

    safeRevalidatePath("/admin/faqs");
    safeRevalidatePath(getAdminPath("faqs"));
    safeRevalidatePath("/support");
    safeRevalidatePath("/");

    return { success: true, message: "FAQ updated." };
  } catch (error) {
    console.error("Update FAQ error:", error);
    return { success: false, message: "Failed to update FAQ." };
  }
}

export async function deleteFaqAction(id: string): Promise<ActionResult> {
  if (!(await isAuthenticatedAdmin())) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    await prisma.faq.delete({ where: { id } });
    safeUpdateTags("faqs");
    safeRevalidatePath("/admin/faqs");
    safeRevalidatePath(getAdminPath("faqs"));
    safeRevalidatePath("/support");
    safeRevalidatePath("/");
    return { success: true, message: "FAQ deleted." };
  } catch (error) {
    console.error("Delete FAQ error:", error);
    return { success: false, message: "Failed to delete FAQ." };
  }
}
