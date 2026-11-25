/**
 * Bring an EXISTING database in line with prisma/content.ts without wiping it.
 * (prisma/seed.ts deletes everything, including subscribers and feedback; this does not.)
 *
 *   bun scripts/fix-content.ts                     # dry run: prints what would change
 *   bun scripts/fix-content.ts --apply             # apply the changes
 *   bun scripts/fix-content.ts --apply --reset-downloads
 *        # also delete ALL download events (use if the counter only holds seeded fake data)
 *
 * What it does:
 *  - Rewrites the three blog posts (matched by slug) and replaces all FAQs.
 *  - Updates the Stable v0.1.2 title/notes, removes assets for builds CI doesn't
 *    produce (Windows ARM64, macOS Intel), and clears the old placeholder checksums/sizes.
 *  - Deletes the placeholder Nova / Deep / Canary releases from the old seed.
 *
 * Afterwards, use /admin/releases → "Sync GitHub Actions" to load real checksums and sizes.
 */
import "dotenv/config";
import { prisma } from "../lib/db";
import { STABLE_RELEASE, POSTS, FAQS } from "../prisma/content";

const APPLY = process.argv.includes("--apply");
const RESET_DOWNLOADS = process.argv.includes("--reset-downloads");

/** Placeholder versions created by the old seed — not real builds. */
const FAKE_CHANNEL_RELEASES = [
  { channel: "NOVA" as const, version: "v0.2.0-beta" },
  { channel: "DEEP" as const, version: "v0.3.0-nightly.20261122" },
  { channel: "CANARY" as const, version: "v0.4.0-canary.20261123" },
];

/** Checksums the old seed invented for v0.1.2 (none of them are real). */
const FAKE_SHA256 = new Set([
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2",
  "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
  "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
  "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
  "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
]);

function log(msg: string) {
  console.log(`${APPLY ? "" : "[dry run] "}${msg}`);
}

async function main() {
  // --- Blog posts ---
  for (const post of POSTS) {
    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    log(`${existing ? "Update" : "Create"} post "${post.slug}"`);
    if (APPLY) {
      await prisma.post.upsert({
        where: { slug: post.slug },
        // Keep the original publish date / published flag if the post already exists.
        update: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          tags: post.tags,
          coverImage: post.coverImage,
        },
        create: post,
      });
    }
  }

  // --- FAQs ---
  const faqCount = await prisma.faq.count();
  log(`Replace ${faqCount} FAQs with ${FAQS.length} corrected FAQs`);
  if (APPLY) {
    await prisma.$transaction([prisma.faq.deleteMany(), prisma.faq.createMany({ data: FAQS })]);
  }

  // --- Stable release ---
  const stable = await prisma.release.findFirst({
    where: { channel: "STABLE", version: STABLE_RELEASE.version },
    include: { assets: true },
  });
  if (!stable) {
    console.log(`Stable ${STABLE_RELEASE.version} not found. Use /admin/releases → "Sync GitHub Actions" to create it.`);
  } else {
    log(`Update title/notes of Stable ${stable.version}`);
    if (APPLY) {
      await prisma.release.update({
        where: { id: stable.id },
        data: { title: STABLE_RELEASE.title, notes: STABLE_RELEASE.notes },
      });
    }

    for (const asset of stable.assets) {
      const unsupported =
        (asset.platform === "WINDOWS" && asset.arch !== "x64") ||
        (asset.platform === "MACOS" && asset.arch !== "arm64") ||
        (asset.platform === "LINUX" && asset.arch !== "x64");
      if (unsupported) {
        log(`Delete asset ${asset.platform} ${asset.arch} .${asset.fileType} (no CI build)`);
        if (APPLY) await prisma.releaseAsset.delete({ where: { id: asset.id } });
      } else if (FAKE_SHA256.has(asset.sha256.toLowerCase())) {
        log(`Clear placeholder checksum/size on ${asset.platform} ${asset.arch} .${asset.fileType}`);
        if (APPLY) {
          await prisma.releaseAsset.update({
            where: { id: asset.id },
            data: { sha256: "", sizeBytes: BigInt(0) },
          });
        }
      }
    }
  }

  // --- Placeholder channel releases ---
  for (const fake of FAKE_CHANNEL_RELEASES) {
    const found = await prisma.release.findMany({ where: fake, select: { id: true } });
    if (found.length) {
      log(`Delete placeholder ${fake.channel} release ${fake.version}`);
      if (APPLY) await prisma.release.deleteMany({ where: fake });
    }
  }

  // --- Download counter ---
  if (RESET_DOWNLOADS) {
    const n = await prisma.downloadEvent.count();
    log(`Delete all ${n} download events`);
    if (APPLY) await prisma.downloadEvent.deleteMany();
  }

  console.log(APPLY ? "Done. Cached pages refresh within a few minutes." : "Dry run complete. Re-run with --apply to write.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
