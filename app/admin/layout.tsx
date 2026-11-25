import Link from "next/link";
import { isAuthenticatedAdmin, logoutAdminAction } from "@/lib/actions/admin/auth";
import { getAdminPath } from "@/lib/admin-config";
import { OrbitLogo } from "@/components/layout/OrbitLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAuthenticatedAdmin();

  if (!isAuth) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-card/90 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <OrbitLogo size={28} />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[10px] font-bold">
              <ShieldAlert className="size-3" />
              ADMIN CONSOLE
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href={getAdminPath("")}
              className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href={getAdminPath("releases")}
              className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Releases &amp; Assets
            </Link>
            <Link
              href={getAdminPath("posts")}
              className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Blog Posts
            </Link>
            <Link
              href={getAdminPath("faqs")}
              className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              FAQs
            </Link>
          </nav>

          {/* Actions right */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-xs">
              <Link href="/" target="_blank" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                <span>View Site</span>
                <ExternalLink className="size-3" />
              </Link>
            </Button>

            <form action={logoutAdminAction}>
              <Button type="submit" variant="outline" size="sm" className="rounded-xl text-xs flex items-center gap-1.5">
                <LogOut className="size-3.5" />
                <span>Logout</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Admin Viewport */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
