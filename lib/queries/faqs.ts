import { prisma } from "@/lib/db";
import { cacheLife, cacheTag } from "next/cache";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
};

export async function getAllFaqs(): Promise<FaqItem[]> {
  "use cache";
  cacheTag("faqs");
  cacheLife("hours");
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    return faqs;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export async function getFaqsByCategory(): Promise<Record<string, FaqItem[]>> {
  const faqs = await getAllFaqs();
  const grouped: Record<string, FaqItem[]> = {};
  for (const faq of faqs) {
    if (!grouped[faq.category]) {
      grouped[faq.category] = [];
    }
    grouped[faq.category].push(faq);
  }
  return grouped;
}
