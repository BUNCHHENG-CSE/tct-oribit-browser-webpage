"use server";

import { prisma } from "@/lib/db";
import { checkRateLimit, hashClientIdentifier } from "@/lib/rate-limit";
import { NewsletterSchema, WaitlistSchema } from "@/lib/validations";
import { headers } from "next/headers";
import { safeRevalidatePath } from "@/lib/safe-revalidate";

export type ActionResult = {
  success: boolean;
  message: string;
};

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

export async function subscribeNewsletterAction(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      email: formData.get("email"),
      honeypot: formData.get("hp_field") || "",
    };

    const parsed = NewsletterSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid input.",
      };
    }

    // Honeypot check
    if (parsed.data.honeypot) {
      return { success: true, message: "Thank you for subscribing!" }; // silent discard for bots
    }

    // Rate limiting check
    const ipHash = await getClientIpHash();
    const rateLimit = checkRateLimit(`newsletter-${ipHash}`, 5, 60000);
    if (!rateLimit.success) {
      return {
        success: false,
        message: "Too many subscription attempts. Please try again in a minute.",
      };
    }

    const email = parsed.data.email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return {
        success: true,
        message: "You're already on the list! Thank you for supporting TCT Orbit.",
      };
    }

    await prisma.subscriber.create({
      data: {
        email,
        source: "newsletter",
      },
    });

    safeRevalidatePath("/");
    return {
      success: true,
      message: "Welcome aboard! You're subscribed to Orbit updates.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}

export async function subscribeWaitlistAction(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      email: formData.get("email"),
      channel: formData.get("channel") || "NOVA",
      honeypot: formData.get("hp_field") || "",
    };

    const parsed = WaitlistSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid input.",
      };
    }

    if (parsed.data.honeypot) {
      return { success: true, message: "You have been added to the waitlist!" };
    }

    const ipHash = await getClientIpHash();
    const rateLimit = checkRateLimit(`waitlist-${ipHash}`, 5, 60000);
    if (!rateLimit.success) {
      return {
        success: false,
        message: "Too many waitlist attempts. Please wait a moment before trying again.",
      };
    }

    const email = parsed.data.email.toLowerCase().trim();

    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      // Update channel preference if needed
      await prisma.subscriber.update({
        where: { email },
        data: { channel: parsed.data.channel as any },
      });
      return {
        success: true,
        message: `You're already on the list! We updated your channel preference to ${parsed.data.channel}.`,
      };
    }

    await prisma.subscriber.create({
      data: {
        email,
        source: "waitlist",
        channel: parsed.data.channel as any,
      },
    });

    safeRevalidatePath("/channels");
    return {
      success: true,
      message: `You are on the ${parsed.data.channel} channel waitlist! We will notify you with the build.`,
    };
  } catch (error) {
    console.error("Waitlist subscription error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
