"use server";

import { prisma } from "@/lib/db";
import { checkRateLimit, hashClientIdentifier } from "@/lib/rate-limit";
import { FeedbackSchema } from "@/lib/validations";
import { headers } from "next/headers";
import { safeRevalidatePath } from "@/lib/safe-revalidate";
import type { ActionResult } from "./subscribe";

async function getClientIpHash(): Promise<string> {
  try {
    const reqHeaders = await headers();
    const forwarded = reqHeaders.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    return hashClientIdentifier(ip);
  } catch {
    return hashClientIdentifier("127.0.0.1");
  }
}

export async function submitFeedbackAction(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      email: formData.get("email") || "",
      category: formData.get("category"),
      message: formData.get("message"),
      honeypot: formData.get("hp_field") || "",
    };

    const parsed = FeedbackSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid feedback data.",
      };
    }

    if (parsed.data.honeypot) {
      return { success: true, message: "Thank you for your feedback!" };
    }

    const ipHash = await getClientIpHash();
    const rateLimit = checkRateLimit(`feedback-${ipHash}`, 3, 60000);
    if (!rateLimit.success) {
      return {
        success: false,
        message: "You are submitting messages too quickly. Please wait a minute.",
      };
    }

    await prisma.feedback.create({
      data: {
        email: parsed.data.email ? parsed.data.email.toLowerCase().trim() : null,
        category: parsed.data.category,
        message: parsed.data.message.trim(),
      },
    });

    safeRevalidatePath("/support");
    return {
      success: true,
      message: "Feedback sent directly to The Capy Team. Thank you!",
    };
  } catch (error) {
    console.error("Submit feedback error:", error);
    return {
      success: false,
      message: "Could not submit feedback. Please try again or email support@tctorbit.com.",
    };
  }
}
