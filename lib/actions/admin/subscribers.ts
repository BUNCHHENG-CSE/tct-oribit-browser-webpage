"use server";

import { prisma } from "@/lib/db";
import { isAuthenticatedAdmin } from "./auth";

/**
 * Sanitize cell content against CSV Formula Injection (DDE injection).
 * If a string begins with '=', '+', '-', '@', '\t', or '\r', prefix with an apostrophe.
 */
function sanitizeCsvCell(value: string): string {
  let cleaned = value.replace(/"/g, '""');
  if (/^[=+\-@\t\r]/.test(cleaned)) {
    cleaned = `'${cleaned}`;
  }
  return `"${cleaned}"`;
}

export async function exportSubscribersCsv(): Promise<string> {
  if (!(await isAuthenticatedAdmin())) {
    throw new Error("Unauthorized");
  }

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const header = "id,email,source,channel,createdAt\n";
  const rows = subscribers
    .map((s) => {
      const email = sanitizeCsvCell(s.email);
      const source = sanitizeCsvCell(s.source);
      const channel = s.channel ? sanitizeCsvCell(s.channel) : '""';
      const date = sanitizeCsvCell(s.createdAt.toISOString());
      return `${s.id},${email},${source},${channel},${date}`;
    })
    .join("\n");

  return header + rows;
}
