import Link from "next/link";
import { OrbitLogo } from "./OrbitLogo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Privacy", href: "/privacy-features" },
      { label: "Download", href: "/download" },
      { label: "Release notes", href: "/changelog" },
      { label: "Release channels", href: "/channels" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Support & FAQ", href: "/support" },
      { label: "Contact", href: "mailto:support@tctorbit.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 space-y-4">
            <OrbitLogo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A fast, private, focused browser for Windows, macOS and Linux. Free forever.
            </p>
            <div className="max-w-xs pt-2">
              <p className="mb-2 text-sm font-medium">Get release updates</p>
              <NewsletterForm />
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-3 text-sm font-medium tracking-normal">{col.title}</h2>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => {
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>© 2026 The Capy Team. All rights reserved.</p>
          <p>Made with care for focused people.</p>
        </div>
      </div>
    </footer>
  );
}
