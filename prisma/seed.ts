import "dotenv/config";
import { prisma } from "../lib/db";
import { STABLE_RELEASE, POSTS, FAQS } from "./content";

async function main() {
  console.log("Seeding TCT Orbit database...");

  // Clean existing data for clean idempotent seed
  await prisma.downloadEvent.deleteMany();
  await prisma.releaseAsset.deleteMany();
  await prisma.release.deleteMany();
  await prisma.post.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.feedback.deleteMany();

  // 1. RELEASES & ASSETS
  // Only the real Stable release. Nova / Deep / Canary show "Coming soon" until
  // real builds are published. Checksums and sizes are filled by the GitHub sync
  // (/admin/releases → "Sync GitHub Actions"); we never invent them.
  const { assets, ...release } = STABLE_RELEASE;
  await prisma.release.create({
    data: {
      ...release,
      assets: {
        create: assets.map((a) => ({ ...a, sha256: "", sizeBytes: BigInt(0) })),
      },
    },
  });

  // No sample download events: the public counter must only show real downloads.

  // 2. BLOG POSTS
  await prisma.post.createMany({ data: POSTS });

  // 3. FAQS
  await prisma.faq.createMany({ data: FAQS });

  // 4. SUBSCRIBERS
  await prisma.subscriber.createMany({
    data: [
      { email: "alex.tech@example.com", source: "newsletter" },
      { email: "sarah.design@example.org", source: "waitlist", channel: "NOVA" },
      { email: "elena.security@example.net", source: "waitlist", channel: "DEEP" },
    ],
  });

  // 5. FEEDBACK
  await prisma.feedback.createMany({
    data: [
      {
        email: "jordan@example.com",
        category: "feature",
        message: "Would love a built-in markdown preview toggle for the Notes Drawer!",
      },
      {
        email: "kai@developer.io",
        category: "bug",
        message: "On Wayland Linux with scaling 1.5x, context menu had slight offset. Fixed in v0.1.2?",
      },
      {
        email: "morgan@agency.co",
        category: "question",
        message: "Any plans for team workspace templates for agencies?",
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
