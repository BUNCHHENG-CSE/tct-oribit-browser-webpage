"use client";

import * as React from "react";
import { toast } from "sonner";
import { subscribeNewsletterAction } from "@/lib/actions/subscribe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const hpId = React.useId();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      const res = await subscribeNewsletterAction(formData);
      if (res.success) {
        toast.success(res.message);
        setSuccess(true);
        formRef.current?.reset();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-500 font-medium p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 className="size-4 shrink-0" />
        <span>You are subscribed to Orbit updates!</span>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-2">
      {/* Honeypot field (hidden from real users, bots fill it) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={hpId}>Do not fill this</label>
        <input type="text" id={hpId} name="hp_field" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="relative flex items-center max-w-md">
        <Input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="h-10 pr-20 rounded-full bg-background text-sm"
          aria-label="Your email address"
        />
        <Button
          type="submit"
          size="sm"
          disabled={loading}
          className="absolute right-1 h-8 rounded-full px-3 font-medium text-xs"
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <span className="flex items-center gap-1">
              Join <ArrowRight className="size-3" />
            </span>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
    </form>
  );
}
