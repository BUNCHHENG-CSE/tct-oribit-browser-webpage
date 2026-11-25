"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginAdminAction } from "@/lib/actions/admin/auth";
import { OrbitLogo } from "@/components/layout/OrbitLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Lock, Loader2, KeyRound } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Derive the admin base from the current URL (".../<slug>/login") so the
  // secret slug never has to be shipped in the client bundle.
  const pathname = usePathname();
  const adminBase = pathname.replace(/\/login\/?$/, "") || "/";
  const [loading, setLoading] = React.useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      const res = await loginAdminAction(formData);
      if (res.success) {
        toast.success(res.message);
        const from = searchParams.get("from");
        // Only allow redirects back into the admin area (blocks "//evil.com" and "/\evil.com")
        const isSafe =
          !!from &&
          !from.includes("\\") &&
          !from.startsWith("//") &&
          (from === adminBase || from.startsWith(`${adminBase}/`));
        const destination = isSafe ? from : adminBase;
        router.push(destination);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">

      <Card className="w-full max-w-md rounded-3xl border-border/60 bg-card/85 backdrop-blur-2xl shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-3 pb-4">
          <div className="flex justify-center mb-1">
            <OrbitLogo size={36} />
          </div>
          <CardTitle className="text-2xl font-heading font-bold text-foreground">
            Orbit Console Authentication
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Enter the master administrator key to manage releases, content, and subscriber registries.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <KeyRound className="size-3 text-primary" />
                <span>Admin Password</span>
              </label>
              <Input
                type="password"
                name="password"
                required
                autoFocus
                placeholder="••••••••••••••••"
                className="h-11 rounded-xl bg-background border-border/60"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Lock className="size-4 mr-2" />
              )}
              <span>Unlock Admin Console</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </React.Suspense>
  );
}
