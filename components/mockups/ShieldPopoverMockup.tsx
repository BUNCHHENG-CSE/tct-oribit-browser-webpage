"use client";

import * as React from "react";
import { Shield, Fingerprint, Lock, Globe, Zap, Check, type LucideIcon } from "lucide-react";

type Row = { key: string; icon: LucideIcon; iconClass: string; title: string; desc: string };

const ROWS: Row[] = [
  {
    key: "ads",
    icon: Zap,
    iconClass: "text-amber-500",
    title: "Ad & Tracker Blocking",
    desc: "Ghostery ad & tracker lists",
  },
  {
    key: "fp",
    icon: Fingerprint,
    iconClass: "text-violet-600 dark:text-violet-400",
    title: "Fingerprint Noise",
    desc: "Canvas, WebGL & audio",
  },
  {
    key: "cookies",
    icon: Lock,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    title: "Third-Party Cookie Blocking",
    desc: "Stops cross-site tracking cookies",
  },
];

/** Interactive replica of the Orbit Shield popover. Uses site theme tokens, so it follows light/dark. */
export function ShieldPopoverMockup() {
  const [on, setOn] = React.useState(true);
  const [rows, setRows] = React.useState<Record<string, boolean>>({ ads: true, fp: true, cookies: true });

  return (
    <div className="mx-auto w-full max-w-sm select-none rounded-2xl border border-border bg-popover p-5 text-popover-foreground shadow-2xl shadow-black/10 dark:shadow-black/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <Shield className="size-5" aria-hidden />
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              Orbit Shield
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ring-1 ring-inset ${
                  on
                    ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground ring-border"
                }`}
              >
                {on ? "ACTIVE" : "OFF"}
              </span>
            </p>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Globe className="size-3" aria-hidden />
              news-portal.io
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Orbit Shield"
          onClick={() => setOn(!on)}
          className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
            on ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        >
          <span
            className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
              on ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 py-4">
        <div className="space-y-1 rounded-xl bg-muted p-3">
          <div className="font-mono text-2xl font-bold text-primary">{on ? "34" : "0"}</div>
          <div className="text-[11px] leading-tight text-muted-foreground">Trackers & ads blocked on this page</div>
        </div>
        <div className="space-y-1 rounded-xl bg-muted p-3">
          <div className="font-mono text-2xl font-bold text-violet-600 dark:text-violet-400">{on ? "6" : "0"}</div>
          <div className="text-[11px] leading-tight text-muted-foreground">Fingerprinting attempts deflected</div>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 border-t border-border pt-4">
        {ROWS.map(({ key, icon: Icon, iconClass, title, desc }) => {
          const checked = rows[key] && on;
          return (
            <div key={key} className="flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="flex items-center gap-1.5 font-medium">
                  <Icon className={`size-3 ${iconClass}`} aria-hidden />
                  {title}
                </span>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                aria-label={title}
                onClick={() => setRows((r) => ({ ...r, [key]: !r[key] }))}
                className={`flex size-4 items-center justify-center rounded border transition-colors ${
                  checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                }`}
              >
                {checked && <Check className="size-3" strokeWidth={3} aria-hidden />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px] text-muted-foreground">
        <span>HTTPS-Only mode</span>
        <span className="text-primary">Settings</span>
      </div>
    </div>
  );
}
