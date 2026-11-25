"use server";

import { cookies, headers } from "next/headers";
import { AdminLoginSchema } from "@/lib/validations";
import { COOKIE_NAME, createEdgeSessionToken, verifyEdgeSessionToken } from "@/lib/auth-edge";
import { getAdminPath, getAdminSessionSecret } from "@/lib/admin-config";
import { redirect } from "next/navigation";
import { createHash, timingSafeEqual } from "crypto";
import { checkRateLimit, hashClientIdentifier } from "@/lib/rate-limit";
import type { ActionResult } from "../subscribe";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Constant-time password check (hash first so lengths always match). */
function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const secret = getAdminSessionSecret();
    if (!secret) return false;
    return await verifyEdgeSessionToken(token, secret);
  } catch {
    return false;
  }
}

export async function loginAdminAction(formData: FormData): Promise<ActionResult> {
  try {
    let ip = "127.0.0.1";
    try {
      const headerStore = await headers();
      const forwardedFor = headerStore.get("x-forwarded-for");
      const realIp = headerStore.get("x-real-ip");
      ip = forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1";
    } catch {
      ip = "127.0.0.1";
    }
    const hashedIp = hashClientIdentifier(ip);

    // Rate limiting: max 5 login attempts per 15 minutes
    const limit = checkRateLimit(hashedIp, 5, 15 * 60 * 1000);
    if (!limit.success) {
      return {
        success: false,
        message: "Too many authentication attempts. Terminal locked for 15 minutes.",
      };
    }

    const password = formData.get("password");
    const parsed = AdminLoginSchema.safeParse({ password });
    if (!parsed.success) {
      return { success: false, message: "Password is required." };
    }

    const expectedPassword = getAdminSessionSecret();

    // Mitigation against timing analysis attacks
    await new Promise((r) => setTimeout(r, 250));

    if (!expectedPassword || !passwordMatches(parsed.data.password, expectedPassword)) {
      return { success: false, message: "Invalid administrator credentials." };
    }

    const token = await createEdgeSessionToken(expectedPassword);
    try {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
    } catch {
      // Handled gracefully when invoked outside request store (e.g. test environments)
    }

    return { success: true, message: "Terminal unlocked. Welcome, Administrator." };
  } catch (error) {
    console.error("Admin login error:", error);
    return { success: false, message: "An error occurred during authentication." };
  }
}

export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect(getAdminPath("login"));
}
