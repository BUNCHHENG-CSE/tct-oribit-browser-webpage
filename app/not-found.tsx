import Link from "next/link";
import { OrbitLogo } from "@/components/layout/OrbitLogo";
import { Button } from "@/components/ui/button";

const LINKS = [
  { label: "Features", href: "/features" },
  { label: "Download", href: "/download" },
  { label: "Blog", href: "/blog" },
  { label: "Support", href: "/support" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center text-foreground">
      <OrbitLogo size={40} showText={false} />
      <p className="mt-8 text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Button asChild className="mt-8 rounded-full px-6">
        <Link href="/">Back to home</Link>
      </Button>
      <nav aria-label="Popular pages" className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="text-muted-foreground hover:text-foreground">
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
