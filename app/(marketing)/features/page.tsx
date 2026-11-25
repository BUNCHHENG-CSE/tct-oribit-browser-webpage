import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Command,
  Split,
  Eye,
  BookOpen,
  Search,
  Camera,
  Code2,
  Palette,
  ArrowDownToLine,
  Sliders,
  CheckCircle2,
  Download,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  SpacesViz,
  CommandViz,
  SplitViz,
  ZenReaderViz,
  NotesPomodoroViz,
  TabsViz,
} from "@/components/features/FeatureVisuals";

export const metadata: Metadata = {
  title: "Features — Spaces, Split View, Command Bar & More",
  description:
    "Everything built into TCT Orbit: vertical tabs and Spaces, Split View, Command Bar, Zen and Reader modes, Space notes, Pomodoro timer, tab search, and keyboard shortcuts.",
  alternates: { canonical: "/features" },
};

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

type Highlight = {
  id: string;
  icon: LucideIcon;
  title: string;
  keys: string[];
  copy: string;
  points: string[];
  visual: React.ReactNode;
};

const ORGANIZE: Highlight[] = [
  {
    id: "spaces",
    icon: Layers,
    title: "Vertical sidebar & Spaces",
    keys: ["Ctrl/⌘", "S"],
    copy: "Your tabs live in a vertical sidebar, split into Spaces like Work, Research and Personal. Each Space keeps its own tabs, so switching tasks never means hunting through one giant row.",
    points: [
      "Separate tab lists for every Space",
      "Switch from the sidebar or the Command Bar",
      "Hide the sidebar with Ctrl/Cmd+S",
      "Notes attached to each Space",
    ],
    visual: <SpacesViz />,
  },
  {
    id: "command-bar",
    icon: Command,
    title: "Command Bar",
    keys: ["Ctrl/⌘", "K"],
    copy: "One shortcut opens a launcher for everything: type a URL, jump to any open tab, or run a browser action without touching the mouse.",
    points: [
      "Jump to any tab by title or URL",
      "Run browser actions by name",
      "Nothing you type is sent to us",
    ],
    visual: <CommandViz />,
  },
  {
    id: "tab-management",
    icon: Search,
    title: "Tab Search, Tab Tidy & Task Manager",
    keys: ["Ctrl/⌘", "⇧", "A"],
    copy: "Find any open tab across every Space in seconds, clean up a crowded sidebar in one click, and see which tabs are using your memory and CPU.",
    points: [
      "Search all tabs with Ctrl/Cmd+Shift+A",
      "Tab Tidy organizes the sidebar",
      "Task Manager with Shift+Esc",
    ],
    visual: <TabsViz />,
  },
];

const FOCUS: Highlight[] = [
  {
    id: "split-view",
    icon: Split,
    title: "Split View",
    keys: ["Ctrl/⌘", "\\"],
    copy: "Show two tabs side by side in one window: docs next to code, research next to your draft. Drag the divider to set the split you want.",
    points: [
      "Each pane scrolls and navigates on its own",
      "Resize by dragging the divider",
      "Smoother Split View in v0.1.2",
    ],
    visual: <SplitViz />,
  },
  {
    id: "zen-mode",
    icon: Eye,
    title: "Zen Mode & Reader Mode",
    keys: ["F11", "F9"],
    copy: "Zen Mode hides the sidebar and toolbars so only the page is left. Reader Mode strips ads, banners and clutter from articles and leaves clean, readable text.",
    points: ["F11: hide all browser UI", "F9: clean article text", "Press again to return"],
    visual: <ZenReaderViz />,
  },
  {
    id: "notes-pomodoro",
    icon: BookOpen,
    title: "Space notes & Pomodoro timer",
    keys: ["Ctrl/⌘", "⇧", "N"],
    copy: "Keep notes next to the tabs they belong to, and work in focused 25-minute blocks with 5-minute breaks, with optional background sounds.",
    points: [
      "Notes saved as local files on your device",
      "25/5 Pomodoro timer",
      "Rain, white-noise and café soundscapes",
    ],
    visual: <NotesPomodoroViz />,
  },
];

const TOOLS: Array<{ id: string; icon: LucideIcon; title: string; copy: string; points: string[] }> = [
  {
    id: "smart-tools",
    icon: Camera,
    title: "Smart context menu",
    copy: "Right-click for the everyday tools you'd otherwise need extensions for.",
    points: ["QR code for the current page", "Screenshot (Ctrl/Cmd+Shift+S)", "Copy link without tracking parameters", "Picture-in-picture (Ctrl/Cmd+Shift+P)"],
  },
  {
    id: "import-backup",
    icon: ArrowDownToLine,
    title: "Import & encrypted backup",
    copy: "Bring your bookmarks and history, and sync through a cloud folder you already use.",
    points: [
      "Chrome, Edge, Brave, Vivaldi, Opera, Firefox",
      "Bookmarks HTML files",
      "Encrypted backup in OneDrive, Dropbox or iCloud",
      "No Orbit server · passwords not imported",
    ],
  },
  {
    id: "site-settings",
    icon: Sliders,
    title: "Per-site permissions",
    copy: "Sites must ask first, and you can revoke access per site at any time.",
    points: ["Camera & microphone", "Location & notifications", "Clipboard read", "MIDI devices"],
  },
  {
    id: "devtools",
    icon: Code2,
    title: "Docked DevTools",
    copy: "Chromium DevTools, docked beside the page you're working on.",
    points: ["Standard Chromium DevTools", "Toggle with F12"],
  },
  {
    id: "themes",
    icon: Palette,
    title: "6 accent themes",
    copy: "Pick the highlight color you like in Settings (Ctrl/Cmd+,).",
    points: ["Six built-in accent colors", "Better dark-mode contrast in v0.1.2"],
  },
];

const SHORTCUT_GROUPS: Array<{ title: string; items: Array<[string, string]> }> = [
  {
    title: "Navigate",
    items: [
      ["New tab", "Ctrl/Cmd+T"],
      ["Command bar", "Ctrl/Cmd+K"],
      ["Address bar", "Ctrl/Cmd+L"],
      ["Search all tabs", "Ctrl/Cmd+Shift+A"],
      ["Toggle sidebar", "Ctrl/Cmd+S"],
      ["Private tab", "Alt+Shift+N"],
    ],
  },
  {
    title: "Focus",
    items: [
      ["Split view", "Ctrl/Cmd+\\"],
      ["Zen mode", "F11"],
      ["Reader mode", "F9"],
      ["Space notes", "Ctrl/Cmd+Shift+N"],
      ["Picture-in-picture", "Ctrl/Cmd+Shift+P"],
    ],
  },
  {
    title: "Tools",
    items: [
      ["Screenshot", "Ctrl/Cmd+Shift+S"],
      ["Task manager", "Shift+Esc"],
      ["DevTools", "F12"],
      ["Settings", "Ctrl/Cmd+,"],
      ["Shortcut list", "Ctrl/Cmd+/ or ?"],
    ],
  },
];

const NAV = [
  { href: "#organize", label: "Organize" },
  { href: "#focus", label: "Focus" },
  { href: "#tools", label: "Tools & control" },
  { href: "#keyboard", label: "Shortcuts" },
];

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function Keys({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((k) => (
        <kbd key={k} className="px-2 py-0.5 text-xs">
          {k}
        </kbd>
      ))}
    </span>
  );
}

function SectionHeader({ id, eyebrow, title, desc }: { id: string; eyebrow: string; title: string; desc: string }) {
  return (
    <div id={id} className="scroll-mt-32 max-w-2xl space-y-3 mb-14">
      <p className="text-sm font-semibold text-primary">{eyebrow}</p>
      <h2 className="font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight">{title}</h2>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function HighlightRow({ f, flip }: { f: Highlight; flip: boolean }) {
  const Icon = f.icon;
  return (
    <section
      id={f.id}
      aria-labelledby={`${f.id}-title`}
      className="reveal scroll-mt-32 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
    >
      <div className={`lg:col-span-5 space-y-5 ${flip ? "lg:order-2" : ""}`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          <Keys keys={f.keys} />
        </div>
        <h3 id={`${f.id}-title`} className="font-semibold text-2xl sm:text-3xl tracking-tight">
          {f.title}
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed">{f.copy}</p>
        <ul className="space-y-2.5 text-sm">
          {f.points.map((p) => (
            <li key={p} className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-primary" />
              <span className="text-foreground/90">{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`lg:col-span-7 relative ${flip ? "lg:order-1" : ""}`}>
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[110%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
        />
        {f.visual}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function FeaturesPage() {
  return (
    <div className="relative pb-24">
      {/* Hero */}
      <header className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center space-y-6">
        <p className="text-sm font-semibold text-primary">Features</p>
        <h1 className="font-semibold text-4xl sm:text-6xl tracking-tighter leading-[1.02] text-balance">
          Everything you need to focus.
          <br />
          <span className="text-muted-foreground">Nothing you don&apos;t.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Spaces, Split View, a Command Bar and focus tools, all built in. No extensions to install, no account, and no
          data leaving your device.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild size="lg" className="rounded-full px-6 font-semibold">
            <Link href="/download" className="flex items-center gap-2">
              <Download className="size-4" />
              Download TCT Orbit
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-6">
            <Link href="/privacy-features">How privacy works</Link>
          </Button>
        </div>
      </header>

      {/* Section links */}
      <nav
        aria-label="Feature sections"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-center gap-1 overflow-x-auto py-2 text-sm [scrollbar-width:none]">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="block whitespace-nowrap rounded-full px-4 py-1.5 font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Organize */}
        <div className="pt-24">
          <SectionHeader
            id="organize"
            eyebrow="Organize"
            title="Tame your tabs."
            desc="Keep every task in its own place, and get anywhere in a keystroke."
          />
          <div className="space-y-24 lg:space-y-32">
            {ORGANIZE.map((f, i) => (
              <HighlightRow key={f.id} f={f} flip={i % 2 === 1} />
            ))}
          </div>
        </div>

        {/* Focus */}
        <div className="pt-32">
          <SectionHeader
            id="focus"
            eyebrow="Focus"
            title="Stay in the zone."
            desc="Tools that clear the screen and keep your attention on one thing at a time."
          />
          <div className="space-y-24 lg:space-y-32">
            {FOCUS.map((f, i) => (
              <HighlightRow key={f.id} f={f} flip={i % 2 === 1} />
            ))}
          </div>
        </div>

        {/* Tools & control */}
        <div className="pt-32">
          <SectionHeader
            id="tools"
            eyebrow="Tools & control"
            title="The small things, built in."
            desc="Everyday tools and settings that usually take extensions or digging through menus."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((t) => {
              const Icon = t.icon;
              return (
                <section
                  key={t.id}
                  id={t.id}
                  className="reveal scroll-mt-32 rounded-2xl border border-border/60 bg-card/60 p-6 space-y-3 hover:border-primary/40 transition-colors"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-heading font-semibold text-lg">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.copy}</p>
                  <ul className="space-y-1.5 pt-1 text-xs text-foreground/85">
                    {t.points.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 shrink-0 mt-0.5 text-primary" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
            <Link
              href="/privacy-features"
              className="reveal group flex flex-col justify-between rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 hover:bg-primary/10 transition-colors"
            >
              <div className="space-y-2">
                <h3 className="font-heading font-semibold text-lg">Privacy Shield</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ad &amp; tracker blocking, fingerprint noise, HTTPS-Only, DNS-over-HTTPS and more, all on by default.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                See privacy features
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Keyboard shortcuts */}
        <section id="keyboard" aria-labelledby="keyboard-title" className="scroll-mt-32 pt-32">
          <div className="max-w-2xl space-y-3 mb-10">
            <p className="text-sm font-semibold text-primary">Shortcuts</p>
            <h2 id="keyboard-title" className="font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Keyboard first.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Press <kbd>Ctrl/Cmd+/</kbd> or <kbd>?</kbd> in Orbit to see this list anytime. On macOS, use Cmd instead of Ctrl.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SHORTCUT_GROUPS.map((g) => (
              <div key={g.title} className="reveal rounded-2xl border border-border/60 bg-card/60 overflow-hidden">
                <h3 className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40 border-b border-border/50">
                  {g.title}
                </h3>
                <dl className="divide-y divide-border/40">
                  {g.items.map(([action, keys]) => (
                    <div key={action} className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm">
                      <dt className="text-foreground/90">{action}</dt>
                      <dd>
                        <kbd className="whitespace-nowrap px-2 py-0.5 text-xs">{keys}</kbd>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="reveal mt-32 rounded-3xl border border-border/60 bg-gradient-to-b from-primary/10 to-transparent px-6 py-14 text-center space-y-5">
          <h2 className="font-semibold text-3xl sm:text-4xl tracking-tight">Try it on your own tabs.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Free forever. Windows 10/11 (x64), macOS 10.15+ (Apple Silicon) and Linux (x64).
          </p>
          <Button asChild size="lg" className="rounded-full px-7 font-semibold">
            <Link href="/download" className="flex items-center gap-2">
              <Download className="size-4" />
              Download TCT Orbit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
