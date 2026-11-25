import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAdminPath } from "@/lib/admin-config";
import {
  Lock,
  ShieldAlert,
  Home,
  KeyRound,
  HelpCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function UnauthorizedView() {
  const loginUrl = getAdminPath("login");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden text-foreground">
      {/* Background Starfield and Amber/Crimson Lockdown Aura */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-rose-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full text-center space-y-8 py-12">
        {/* Logo and Lock Emblem */}
        <div className="relative inline-flex items-center justify-center">
          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/25 shadow-xl shadow-amber-500/10">
            <Lock className="size-10 text-amber-400" />
          </div>
        </div>

        {/* Security Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold shadow-xs">
          <ShieldAlert className="size-4 text-amber-400" />
          <span>ACCESS RESTRICTED • HTTP 401 UNAUTHORIZED</span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-foreground">
            Restricted Sector
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            This sector is protected by cryptographic mission control authorization. Your current session does not possess valid credentials or clearance tokens.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-6 shadow-md shadow-amber-500/20">
            <Link href={loginUrl} className="flex items-center gap-2">
              <KeyRound className="size-4" />
              <span>Mission Control Login</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="rounded-full px-6 border-border/80 hover:bg-muted/50">
            <Link href="/" className="flex items-center gap-2">
              <Home className="size-4" />
              <span>Return to Public Space</span>
            </Link>
          </Button>

          <Button asChild variant="ghost" className="rounded-full px-5 text-muted-foreground hover:text-foreground">
            <Link href="/support" className="flex items-center gap-2">
              <HelpCircle className="size-4" />
              <span>Contact Clearance</span>
            </Link>
          </Button>
        </div>

        {/* Security Disclosure Card */}
        <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl text-left text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
            <span>Zero Telemetry Security Notice</span>
          </div>
          <p className="leading-relaxed">
            All unauthorized access attempts are rate-limited and logged cryptographically via salted SHA-256 hashes. We do not store raw IP addresses, user fingerprints, or personal telemetry.
          </p>
        </div>

        {/* Public Sector Links */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/features" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Sparkles className="size-3 text-primary" />
            <span>Features</span>
          </Link>
          <span>•</span>
          <Link href="/privacy-features" className="hover:text-foreground transition-colors">
            Privacy Model
          </Link>
          <span>•</span>
          <Link href="/download" className="hover:text-foreground transition-colors">
            Download Orbit
          </Link>
          <span>•</span>
          <Link href="/changelog" className="hover:text-foreground transition-colors">
            Changelog
          </Link>
        </div>
      </div>
    </div>
  );
}
