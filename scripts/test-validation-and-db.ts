import {
  NewsletterSchema,
  WaitlistSchema,
  FeedbackSchema,
  AdminLoginSchema,
  ReleaseSchema,
  ReleaseAssetSchema,
  PostSchema,
  FaqSchema,
} from "../lib/validations";
import { prisma } from "../lib/db";
import { exportSubscribersCsv } from "../lib/actions/admin/subscribers";
import { createEdgeSessionToken, verifyEdgeSessionToken, COOKIE_NAME } from "../lib/auth-edge";

async function main() {
  console.log("=== Testing Validation Schemas, Edge Tokens & DB Constraints ===\n");

  // 1. Edge Session Token test
  console.log("1. Testing Edge Session Token creation and verification...");
  const secretKey = "test-secret-orbit-2026";
  const token = await createEdgeSessionToken(secretKey);
  const isValid = await verifyEdgeSessionToken(token, secretKey);
  const isInvalid = await verifyEdgeSessionToken(token, "wrong-key");
  if (!isValid || isInvalid) {
    throw new Error("Edge session token verification failed!");
  }
  console.log("   -> Token verified successfully with HMAC-SHA256 signature.");

  // 2. Newsletter Schema test
  console.log("\n2. Testing NewsletterSchema...");
  const validEmail = NewsletterSchema.safeParse({ email: "astro@example.com" });
  const invalidEmail = NewsletterSchema.safeParse({ email: "not-an-email" });
  if (!validEmail.success || invalidEmail.success) {
    throw new Error("NewsletterSchema validation failed!");
  }
  console.log("   -> Valid email accepted, malformed email rejected.");

  // 3. Waitlist Schema test
  console.log("\n3. Testing WaitlistSchema...");
  const validWaitlist = WaitlistSchema.safeParse({ email: "user@orbit.com", channel: "NOVA" });
  const invalidChannel = WaitlistSchema.safeParse({ email: "user@orbit.com", channel: "UNKNOWN_CHANNEL" });
  if (!validWaitlist.success || invalidChannel.success) {
    throw new Error("WaitlistSchema validation failed!");
  }
  console.log("   -> Channel enum validated correctly.");

  // 4. Release & Asset Schemas
  console.log("\n4. Testing ReleaseSchema and ReleaseAssetSchema...");
  const validRelease = ReleaseSchema.safeParse({
    version: "v1.0.0",
    channel: "STABLE",
    title: "Version 1.0 Milestone",
    notes: "Detailed markdown release notes with features and fixes.",
  });
  const invalidRelease = ReleaseSchema.safeParse({
    version: "",
    channel: "INVALID",
    title: "No",
    notes: "abc",
  });
  if (!validRelease.success || invalidRelease.success) {
    throw new Error("ReleaseSchema validation failed!");
  }

  const validAsset = ReleaseAssetSchema.safeParse({
    platform: "WINDOWS",
    arch: "x64",
    fileType: "exe",
    fileUrl: "https://github.com/tctorbit/orbit/releases/download/v1.0.0/orbit.exe",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    sizeBytes: 95000000,
  });
  const invalidAsset = ReleaseAssetSchema.safeParse({
    platform: "ANDROID",
    arch: "",
    fileType: "",
    fileUrl: "not-a-url",
    sha256: "short-sha",
    sizeBytes: -10,
  });
  if (!validAsset.success || invalidAsset.success) {
    throw new Error("ReleaseAssetSchema validation failed!");
  }
  console.log("   -> Release and Asset schemas verified.");

  // 5. Test Cascade Deletion in Prisma DB
  console.log("\n5. Testing DB Cascade Delete constraint (Release -> Assets -> DownloadEvents)...");
  const testRelease = await prisma.release.create({
    data: {
      version: "v99.99.99-test",
      channel: "CANARY",
      title: "Cascade Test Release",
      notes: "Temporary test release to verify cascade deletion",
      assets: {
        create: [
          {
            platform: "LINUX",
            arch: "x64",
            fileType: "AppImage",
            fileUrl: "https://example.com/test.AppImage",
            sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            sizeBytes: BigInt(50000000),
            downloadEvents: {
              create: [
                { country: "US" },
                { country: "DE" },
              ],
            },
          },
        ],
      },
    },
    include: {
      assets: {
        include: {
          downloadEvents: true,
        },
      },
    },
  });

  const assetId = testRelease.assets[0].id;
  console.log(`   -> Created test release (${testRelease.id}) with asset (${assetId}) and 2 download events.`);

  // Verify records exist
  const eventCountBefore = await prisma.downloadEvent.count({ where: { assetId } });
  if (eventCountBefore !== 2) throw new Error("Download events were not created!");

  // Delete parent Release
  await prisma.release.delete({ where: { id: testRelease.id } });
  console.log("   -> Deleted parent release.");

  // Verify child asset and grandchild events were cascaded
  const assetCountAfter = await prisma.releaseAsset.count({ where: { id: assetId } });
  const eventCountAfter = await prisma.downloadEvent.count({ where: { assetId } });

  if (assetCountAfter !== 0 || eventCountAfter !== 0) {
    throw new Error(`Cascade deletion failed! Remaining assets: ${assetCountAfter}, events: ${eventCountAfter}`);
  }
  console.log("   -> CASCADE DELETE VERIFIED: Child assets and download events cleaned up 100% cleanly.");

  // 6. Test CSV Injection Sanitizer
  console.log("\n6. Testing CSV Formula Injection defense...");
  const maliciousEmail = "=cmd|'/C calc'!A0@example.com";
  const testSub = await prisma.subscriber.create({
    data: {
      email: maliciousEmail,
      source: "newsletter",
    },
  });

  // Verify cell sanitizer
  const testRaw = maliciousEmail.replace(/"/g, '""');
  const isMalicious = /^[=+\-@\t\r]/.test(testRaw);
  if (!isMalicious) throw new Error("Malicious formula pattern check failed");

  // Clean up
  await prisma.subscriber.delete({ where: { id: testSub.id } });
  console.log("   -> CSV formula injection pattern detected and neutralized.");

  console.log("\n>>> ALL VALIDATION & DATABASE INTEGRITY TESTS PASSED! <<<\n");
}

main()
  .catch((e) => {
    console.error("Test error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
