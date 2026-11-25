import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SpacesViz, CommandViz, SplitViz, ZenReaderViz } from "@/components/features/FeatureVisuals";

const CARDS = [
  {
    eyebrow: "Spaces",
    title: "A place for every part of your day.",
    desc: "Work, Research and Personal each get their own tabs, color and notes in a vertical sidebar.",
    href: "/features#spaces",
    visual: <SpacesViz />,
    span: "lg:col-span-3",
    glow: "oklch(0.65 0.18 255 / 0.35)",
  },
  {
    eyebrow: "Command Bar",
    title: "Everything, one shortcut away.",
    desc: "Press Ctrl/Cmd+K to open a URL, jump to a tab or run any action.",
    href: "/features#command-bar",
    visual: <CommandViz />,
    span: "lg:col-span-2",
    glow: "oklch(0.65 0.2 295 / 0.35)",
  },
  {
    eyebrow: "Split View",
    title: "Two pages, one window.",
    desc: "Docs beside code, research beside your draft. Drag to resize.",
    href: "/features#split-view",
    visual: <SplitViz />,
    span: "lg:col-span-2",
    glow: "oklch(0.7 0.15 165 / 0.35)",
  },
  {
    eyebrow: "Zen & Reader",
    title: "Just you and the page.",
    desc: "F11 hides every bar. F9 turns any article into clean, readable text.",
    href: "/features#zen-mode",
    visual: <ZenReaderViz />,
    span: "lg:col-span-3",
    glow: "oklch(0.75 0.14 70 / 0.35)",
  },
];

export function Showcase() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Built for deep work</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Everything you need. <span className="text-muted-foreground">Nothing in your way.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-5">
          {CARDS.map((c) => (
            <Link
              key={c.eyebrow}
              href={c.href}
              className={`reveal group relative isolate flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 sm:p-9 ${c.span}`}
            >
              <div
                aria-hidden
                className="absolute -right-24 -top-24 -z-10 size-72 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: c.glow }}
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary">{c.eyebrow}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{c.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <div className="mt-8 flex-1 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]">
                {c.visual}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
