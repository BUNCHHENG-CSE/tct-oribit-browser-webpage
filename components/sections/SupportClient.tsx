"use client";

import * as React from "react";
import { toast } from "sonner";
import { submitFeedbackAction } from "@/lib/actions/feedback";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  Search,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  Bug,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import type { FaqItem } from "@/lib/queries/faqs";

const FEEDBACK_TYPES = [
  { value: "question", label: "Question", icon: HelpCircle, placeholder: "What would you like to know?" },
  {
    value: "bug",
    label: "Bug",
    icon: Bug,
    placeholder: "What happened, and what did you expect? Include your OS and the steps to reproduce it.",
  },
  { value: "feature", label: "Idea", icon: Lightbulb, placeholder: "What would you like Orbit to do, and why?" },
  { value: "other", label: "Other", icon: MessageSquare, placeholder: "Tell us what's on your mind." },
] as const;

interface SupportClientProps {
  initialFaqs: FaqItem[];
}

export function SupportClient({ initialFaqs }: SupportClientProps) {
  const hpId = React.useId();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [feedbackLoading, setFeedbackLoading] = React.useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = React.useState(false);
  const [category, setCategory] = React.useState<string>("question");
  const [message, setMessage] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  // Extract distinct categories
  const categories = ["All", ...Array.from(new Set(initialFaqs.map((f) => f.category)))];

  // Client-side search and category filtering
  const filteredFaqs = initialFaqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  async function handleFeedbackSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedbackLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.set("category", category);

    try {
      const res = await submitFeedbackAction(formData);
      if (res.success) {
        toast.success(res.message);
        setFeedbackSuccess(true);
        setMessage("");
        formRef.current?.reset();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to send message. Please email support@tctorbit.com.");
    } finally {
      setFeedbackLoading(false);
    }
  }

  return (
    <div className="space-y-20">
      {/* Search and FAQ Section */}
      <div className="space-y-8">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search FAQs (e.g., telemetry, chromium, spaces, sync)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-11 pr-4 rounded-2xl bg-card/80 border-border/60 text-sm shadow-md"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtered FAQs Accordion */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-border/60 bg-card/70 backdrop-blur-xl p-6 sm:p-10 shadow-xl space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground space-y-2">
              <p>No matching answers found for &ldquo;{searchQuery}&rdquo;.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-primary hover:underline font-semibold text-xs"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <Accordion className="w-full space-y-3">
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b border-border/40 pb-2 last:border-b-0 last:pb-0"
                >
                  <AccordionTrigger className="text-left font-heading text-base font-semibold text-foreground hover:text-primary transition-colors py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 text-left">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0 self-start">
                        {faq.category}
                      </span>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-2 pb-3 pl-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>

      {/* Contact */}
      <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-5xl scroll-mt-24">
        <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl shadow-black/5 md:grid-cols-5">
          {/* Info panel */}
          <div
            className="relative isolate flex flex-col justify-between gap-10 p-8 text-white sm:p-10 md:col-span-2"
            style={{
              background:
                "radial-gradient(120% 90% at 0% 0%, oklch(0.6 0.2 258) 0%, transparent 60%), radial-gradient(120% 90% at 100% 100%, oklch(0.5 0.2 300) 0%, transparent 60%), oklch(0.28 0.1 270)",
            }}
          >
            <div>
              <h2 id="contact-title" className="text-3xl font-semibold tracking-tight">
                Get in touch
              </h2>
              <p className="mt-3 leading-relaxed text-white/75">
                Found a bug, have an idea, or stuck on something? We read every message.
              </p>
            </div>

            <ul className="space-y-5 text-sm">
              <li className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-inset ring-white/15">
                  <Mail className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-white/60">Email us</p>
                  <a href="mailto:support@tctorbit.com" className="font-medium hover:underline">
                    support@tctorbit.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-inset ring-white/15">
                  <ShieldCheck className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-white/60">Reporting a bug?</p>
                  <p className="font-medium">
                    Orbit sends no crash reports, so include your OS and the steps to reproduce it.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="p-8 sm:p-10 md:col-span-3">
            {feedbackSuccess ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="size-7" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-semibold">Message sent</h3>
                <p className="mt-2 max-w-xs text-muted-foreground">
                  Thanks for helping make Orbit better. If you left your email, we&apos;ll reply there.
                </p>
                <Button variant="outline" onClick={() => setFeedbackSuccess(false)} className="mt-6 rounded-full px-5">
                  Send another message
                </Button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleFeedbackSubmit} className="space-y-6">
                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor={hpId}>Do not fill</label>
                  <input type="text" id={hpId} name="hp_field" tabIndex={-1} autoComplete="off" />
                </div>

                <fieldset>
                  <legend className="mb-3 text-sm font-medium">What&apos;s this about?</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {FEEDBACK_TYPES.map(({ value, label, icon: Icon }) => {
                      const active = category === value;
                      return (
                        <label
                          key={value}
                          className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border px-3 py-3.5 text-sm transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                            active
                              ? "border-primary bg-primary/10 font-medium text-primary"
                              : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                          }`}
                        >
                          <input
                            type="radio"
                            name="category-choice"
                            value={value}
                            checked={active}
                            onChange={() => setCategory(value)}
                            className="sr-only"
                          />
                          <Icon className="size-5" aria-hidden />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor={`${hpId}-message`} className="mb-2 block text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id={`${hpId}-message`}
                    name="message"
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={FEEDBACK_TYPES.find((t) => t.value === category)?.placeholder}
                    className="min-h-32 resize-y rounded-2xl bg-background px-4 py-3 text-[15px] leading-relaxed"
                  />
                  <p className="mt-1.5 text-right text-xs text-muted-foreground">{message.length} / 2000</p>
                </div>

                <div>
                  <label htmlFor={`${hpId}-email`} className="mb-2 block text-sm font-medium">
                    Email <span className="font-normal text-muted-foreground">(optional, if you&apos;d like a reply)</span>
                  </label>
                  <Input
                    id={`${hpId}-email`}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-11 rounded-2xl bg-background px-4 text-[15px]"
                  />
                </div>

                <Button type="submit" disabled={feedbackLoading} className="h-12 w-full rounded-full text-[15px] font-medium">
                  {feedbackLoading ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Send className="size-4" aria-hidden />
                  )}
                  {feedbackLoading ? "Sending..." : "Send message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
