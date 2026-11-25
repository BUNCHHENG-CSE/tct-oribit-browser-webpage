"use client";

import * as React from "react";
import { toast } from "sonner";
import { subscribeWaitlistAction } from "@/lib/actions/subscribe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";

export function WaitlistForm() {
  const hpId = React.useId();
  const [loading, setLoading] = React.useState(false);
  const [channel, setChannel] = React.useState("NOVA");
  const [submitted, setSubmitted] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.set("channel", channel);

    try {
      const res = await subscribeWaitlistAction(formData);
      if (res.success) {
        toast.success(res.message);
        setSubmitted(true);
        formRef.current?.reset();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Could not join waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
        <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
        <h4 className="text-base font-semibold text-foreground">You are on the preview waitlist!</h4>
        <p className="text-xs text-muted-foreground">
          We will notify your email directly when new builds for the selected channel drop.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto text-left">
      {/* Honeypot field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={hpId}>Do not fill this</label>
        <input type="text" id={hpId} name="hp_field" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-foreground mb-1 block">Work Email</label>
          <Input
            type="email"
            name="email"
            required
            placeholder="developer@company.com"
            className="rounded-xl h-11 bg-background border-border/60"
          />
        </div>

        <div className="w-full sm:w-44">
          <label className="text-xs font-medium text-foreground mb-1 block">Target Channel</label>
          <Select value={channel} onValueChange={(val) => setChannel(val || "NOVA")}>
            <SelectTrigger className="rounded-xl h-11 bg-background border-border/60">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NOVA">Nova (Beta)</SelectItem>
              <SelectItem value="DEEP">Deep (Nightly)</SelectItem>
              <SelectItem value="CANARY">Canary (Preview)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin mr-2" />
        ) : (
          <Sparkles className="size-4 mr-2" />
        )}
        <span>Join Early Access Waitlist</span>
      </Button>

      <p className="text-[11px] text-center text-muted-foreground">
        Zero marketing spam. Only early access release notifications.
      </p>
    </form>
  );
}
