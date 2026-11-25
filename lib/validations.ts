import { z } from "zod";

export const NewsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  honeypot: z.string().max(0, "Bot detected").optional().default(""),
});

export const WaitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  channel: z.enum(["STABLE", "NOVA", "DEEP", "CANARY"]).default("NOVA"),
  honeypot: z.string().max(0, "Bot detected").optional().default(""),
});

export const FeedbackSchema = z.object({
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),
  category: z.enum(["bug", "feature", "question", "other"]),
  message: z.string().min(10, "Message must be at least 10 characters long.").max(2000),
  honeypot: z.string().max(0, "Bot detected").optional().default(""),
});

export const AdminLoginSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

export const ReleaseAssetSchema = z.object({
  platform: z.enum(["WINDOWS", "MACOS", "LINUX"]),
  arch: z.string().min(1, "Arch is required (e.g. x64, arm64)"),
  fileType: z.string().min(1, "File type is required (e.g. exe, dmg, AppImage, deb)"),
  fileUrl: z.string().url("Must be a valid URL"),
  sha256: z.string().length(64, "SHA-256 hash must be 64 characters"),
  sizeBytes: z.coerce.number().positive("Size must be positive"),
});

export const ReleaseSchema = z.object({
  version: z.string().min(1, "Version is required (e.g. v0.1.2)"),
  channel: z.enum(["STABLE", "NOVA", "DEEP", "CANARY"]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  notes: z.string().min(5, "Release notes required"),
});

export const PostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase alphanumeric and dashes"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string().min(1, "Cover image path or URL required"),
  author: z.string().min(2, "Author is required"),
  tags: z.string().min(1, "Comma-separated tags required"),
  published: z.boolean().default(true),
});

export const FaqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  order: z.coerce.number().default(0),
});
