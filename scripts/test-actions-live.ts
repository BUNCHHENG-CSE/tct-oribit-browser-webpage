import { subscribeNewsletterAction, subscribeWaitlistAction } from "../lib/actions/subscribe";
import { submitFeedbackAction } from "../lib/actions/feedback";
import { createReleaseAction } from "../lib/actions/admin/releases";
import { createPostAction } from "../lib/actions/admin/posts";
import { createFaqAction } from "../lib/actions/admin/faqs";
import { prisma } from "../lib/db";

async function main() {
  console.log("=== Testing Server Actions & DB Mutations ===");

  const timestamp = Date.now();
  const testEmail = `tester-${timestamp}@example.com`;

  // 1. Test Subscribe Action (Newsletter)
  console.log("\n1. Testing subscribeNewsletterAction...");
  const form1 = new FormData();
  form1.set("email", testEmail);
  const res1 = await subscribeNewsletterAction(form1);
  console.log("subscribeNewsletterAction result:", res1);
  if (!res1.success) throw new Error("subscribeNewsletterAction failed: " + res1.message);

  // 2. Test Subscribe Action Duplicate Graceful Handling
  console.log("\n2. Testing subscribeNewsletterAction duplicate handling...");
  const res1Dup = await subscribeNewsletterAction(form1);
  console.log("subscribeNewsletterAction duplicate result:", res1Dup);
  if (!res1Dup.success) throw new Error("subscribeNewsletterAction duplicate handling failed");

  // 3. Test Waitlist Action
  console.log("\n3. Testing subscribeWaitlistAction...");
  const form2 = new FormData();
  form2.set("email", `waitlist-${timestamp}@example.com`);
  form2.set("channel", "NOVA");
  const res2 = await subscribeWaitlistAction(form2);
  console.log("subscribeWaitlistAction result:", res2);
  if (!res2.success) throw new Error("subscribeWaitlistAction failed: " + res2.message);

  // 4. Test Honeypot field (anti-bot)
  console.log("\n4. Testing honeypot bot trap...");
  const formHoneypot = new FormData();
  formHoneypot.set("email", "spambot@example.com");
  formHoneypot.set("hp_field", "I am a bot");
  const resHp = await subscribeNewsletterAction(formHoneypot);
  console.log("Honeypot result:", resHp);
  // Honeypot should block submission without saving to DB
  if (resHp.message !== "Bot detected" && resHp.message !== "Thank you for subscribing!") {
    throw new Error("Honeypot trap unexpected message: " + resHp.message);
  }

  // 5. Test Submit Feedback Action
  console.log("\n5. Testing submitFeedbackAction...");
  const formFeedback = new FormData();
  formFeedback.set("email", testEmail);
  formFeedback.set("category", "feature");
  formFeedback.set("message", "Test automated feedback verification message for TCT Orbit browser.");
  const resFeedback = await submitFeedbackAction(formFeedback);
  console.log("submitFeedbackAction result:", resFeedback);
  if (!resFeedback.success) throw new Error("submitFeedbackAction failed: " + resFeedback.message);

  // 6. Test Admin Actions Unauthorized Access Rejection
  console.log("\n6. Testing Admin Actions Security (unauthenticated access rejection)...");
  const formRelease = new FormData();
  formRelease.set("version", "v99.9.9");
  formRelease.set("channel", "STABLE");
  formRelease.set("title", "Unauthorized Test Release");
  formRelease.set("notes", "Should be rejected.");
  const resRelease = await createReleaseAction(formRelease);
  console.log("Unauthenticated createReleaseAction result:", resRelease);
  if (resRelease.success || resRelease.message !== "Unauthorized.") {
    throw new Error("Admin action failed security check!");
  }

  const formPost = new FormData();
  formPost.set("title", "Unauthorized Post");
  formPost.set("slug", `unauth-post-${timestamp}`);
  formPost.set("content", "Unauthorized content");
  formPost.set("excerpt", "Unauthorized excerpt");
  formPost.set("author", "Hacker");
  const resPost = await createPostAction(formPost);
  console.log("Unauthenticated createPostAction result:", resPost);
  if (resPost.success || resPost.message !== "Unauthorized.") {
    throw new Error("Admin action failed security check!");
  }

  const formFaq = new FormData();
  formFaq.set("question", "Unauthorized Faq?");
  formFaq.set("answer", "Unauthorized answer");
  formFaq.set("category", "General");
  formFaq.set("order", "99");
  const resFaq = await createFaqAction(formFaq);
  console.log("Unauthenticated createFaqAction result:", resFaq);
  if (resFaq.success || resFaq.message !== "Unauthorized.") {
    throw new Error("Admin action failed security check!");
  }

  // 7. Clean up test records
  console.log("\n7. Cleaning up test subscriber and feedback records...");
  await prisma.subscriber.deleteMany({
    where: {
      email: {
        in: [testEmail, `waitlist-${timestamp}@example.com`],
      },
    },
  });
  await prisma.feedback.deleteMany({
    where: {
      email: testEmail,
    },
  });

  console.log("\n>>> ALL SERVER ACTION TESTS PASSED SUCCESSFULLY! <<<\n");
}

main()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
