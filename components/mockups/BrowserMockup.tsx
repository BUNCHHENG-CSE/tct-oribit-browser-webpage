"use client";

import * as React from "react";
import Image from "next/image";
import {
  PanelLeft,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  ShieldCheck,
  Star,
  Plus,
  Columns2,
  MoreHorizontal,
  Minus,
  Copy,
  X,
  Layers,
  Briefcase,
  EyeOff,
  History,
  Download,
  Settings,
  Sparkles,
  Search,
  Play,
  ArrowLeftRight,
  TrendingUp,
  FileText,
  Mail,
  Code2,
  Music,
  Newspaper,
  HardDrive,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type PageKind = "search" | "video" | "markets" | "docs" | "mail";
type Tab = { id: string; title: string; url: string; kind: PageKind; blocked: number };
type SpaceId = "personal" | "work";

const FAVICON: Record<PageKind, { bg: string; icon: React.ElementType }> = {
  search: { bg: "#de5833", icon: Search },
  video: { bg: "#ff0033", icon: Play },
  markets: { bg: "#16a34a", icon: TrendingUp },
  docs: { bg: "#3b82f6", icon: FileText },
  mail: { bg: "#f59e0b", icon: Mail },
};

const SPACES: Record<SpaceId, { name: string; color: string; icon: React.ElementType; tabs: Tab[] }> = {
  personal: {
    name: "Personal",
    color: "#a3a3a3",
    icon: Layers,
    tabs: [
      { id: "p1", title: "Search privately", url: "search.example", kind: "search", blocked: 9 },
      { id: "p2", title: "Video — Home", url: "video.example", kind: "video", blocked: 37 },
      { id: "p3", title: "Markets — Live charts", url: "markets.example/live", kind: "markets", blocked: 24 },
    ],
  },
  work: {
    name: "Work",
    color: "#60a5fa",
    icon: Briefcase,
    tabs: [
      { id: "w1", title: "Q4 Roadmap — Docs", url: "docs.example/q4-roadmap", kind: "docs", blocked: 6 },
      { id: "w2", title: "Inbox (3)", url: "mail.example/inbox", kind: "mail", blocked: 12 },
      { id: "w3", title: "Markets — Live charts", url: "markets.example/live", kind: "markets", blocked: 24 },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function Favicon({ kind, size = 14 }: { kind: PageKind; size?: number }) {
  const f = FAVICON[kind];
  const Icon = f.icon;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[4px] text-white"
      style={{ width: size, height: size, background: f.bg }}
    >
      <Icon style={{ width: size * 0.62, height: size * 0.62 }} strokeWidth={3} />
    </span>
  );
}

function RailButton({
  icon: Icon,
  label,
  expanded,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  expanded: boolean;
  accent?: string;
}) {
  return (
    <div
      title={label}
      className={`flex w-full items-center gap-2.5 rounded-md text-[11px] text-(--ob-muted) transition-colors hover:bg-(--ob-hover) hover:text-(--ob-fg) ${
        expanded ? "px-2.5 py-1.5" : "justify-center py-1.5"
      }`}
    >
      <Icon className="size-3.5 shrink-0" style={accent ? { color: accent } : undefined} />
      {expanded && <span className="truncate">{label}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

/** Start page — follows the theme, shows off the privacy story */
function SearchPage() {
  const shortcuts = [
    { l: "Mail", i: Mail, c: "#f59e0b" },
    { l: "Video", i: Play, c: "#ff0033" },
    { l: "Docs", i: FileText, c: "#3b82f6" },
    { l: "Code", i: Code2, c: "#525252" },
    { l: "Music", i: Music, c: "#1db954" },
    { l: "News", i: Newspaper, c: "#0ea5e9" },
  ];
  const week = [38, 52, 44, 70, 61, 88, 74];
  return (
    <div className="flex h-full flex-col items-center justify-center bg-(--ob-page) px-[7%] text-(--ob-fg)">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="" width={22} height={22} className="object-contain" />
        <span className="font-heading text-lg sm:text-xl font-bold tracking-tight">TCT Orbit</span>
      </div>

      <div className="mt-5 flex h-9 w-full max-w-lg items-center gap-2 rounded-full border border-(--ob-border) bg-(--ob-card) pl-3.5 pr-1.5 text-[11px] text-(--ob-muted) shadow-sm">
        <Search className="size-3.5" />
        Search privately or type a URL
        <span className="ml-auto rounded-full bg-(--ob-page) px-2.5 py-1 text-[10px] font-medium text-(--ob-fg-2) ring-1 ring-(--ob-border)">
          Ctrl+L
        </span>
      </div>

      <div className="mt-5 grid grid-cols-6 gap-2.5 sm:gap-4">
        {shortcuts.map((s) => {
          const Icon = s.i;
          return (
            <div key={s.l} className="flex flex-col items-center gap-1.5">
              <span className="flex size-8 sm:size-10 items-center justify-center rounded-xl bg-(--ob-card) ring-1 ring-(--ob-border)">
                <span className="flex size-4 sm:size-5 items-center justify-center rounded-md text-white" style={{ background: s.c }}>
                  <Icon className="size-2.5 sm:size-3" strokeWidth={3} />
                </span>
              </span>
              <span className="text-[9px] text-(--ob-muted)">{s.l}</span>
            </div>
          );
        })}
      </div>

      {/* Privacy report */}
      <div className="mt-8 hidden sm:grid w-full max-w-lg grid-cols-[1.3fr_1fr] gap-2.5">
        <div className="rounded-xl bg-(--ob-card) p-3 ring-1 ring-(--ob-border)">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1.5 font-semibold text-(--ob-fg)">
              <ShieldCheck className="size-3.5 text-emerald-500" /> Privacy report
            </span>
            <span className="text-(--ob-muted)">this week</span>
          </div>
          <div className="mt-1 font-heading text-xl font-bold">427</div>
          <div className="text-[9px] text-(--ob-muted)">trackers blocked</div>
          <div className="mt-2 flex h-8 items-end gap-1">
            {week.map((h, i) => (
              <span
                key={i}
                className={`flex-1 rounded-sm ${i === week.length - 1 ? "bg-emerald-500" : "bg-emerald-500/35"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-(--ob-card) p-3 ring-1 ring-(--ob-border)">
          <span className="flex size-6 items-center justify-center rounded-lg bg-sky-500/15 text-sky-500">
            <HardDrive className="size-3.5" />
          </span>
          <div>
            <div className="text-[10.5px] font-semibold text-(--ob-fg)">Stored on this device</div>
            <div className="text-[9px] leading-snug text-(--ob-muted)">History, tabs and Spaces never leave your computer.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoPage() {
  const thumbs = [
    "from-rose-500 to-orange-400",
    "from-sky-500 to-indigo-500",
    "from-emerald-500 to-teal-400",
    "from-fuchsia-500 to-purple-500",
    "from-amber-400 to-red-500",
    "from-slate-500 to-slate-700",
  ];
  return (
    <div className="flex h-full flex-col bg-white p-3 text-neutral-900 dark:bg-[#0f0f0f] dark:text-neutral-100">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-4 w-6 items-center justify-center rounded bg-[#ff0033]">
          <Play className="size-2 fill-white text-white" />
        </span>
        <span className="text-[11px] font-semibold tracking-tight">Video</span>
        <div className="ml-2 h-5 flex-1 rounded-full bg-black/[0.06] dark:bg-white/[0.07]" />
      </div>
      <div className="mb-3 flex gap-1.5 overflow-hidden">
        {["All", "Music", "Gaming", "Live", "News", "Podcasts"].map((c, i) => (
          <span key={c} className={`shrink-0 rounded-md px-2 py-0.5 text-[9px] font-medium ${i === 0 ? "bg-neutral-900 text-white dark:bg-white dark:text-black" : "bg-black/[0.06] dark:bg-white/10"}`}>
            {c}
          </span>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-2 lg:grid-cols-3 content-start gap-2.5">
        {thumbs.map((g, i) => (
          <div key={i} className="space-y-1.5">
            <div className={`aspect-video rounded-lg bg-gradient-to-br ${g} opacity-90`} />
            <div className="h-1.5 w-11/12 rounded-full bg-black/15 dark:bg-white/20" />
            <div className="h-1.5 w-1/2 rounded-full bg-black/[0.07] dark:bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketsPage() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#fffaf5] p-4 text-neutral-900 dark:bg-[#050505] dark:text-neutral-100">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 dark:opacity-70"
        style={{ background: "radial-gradient(60% 50% at 50% 70%, rgba(249,115,22,0.35), transparent 70%)" }}
      />
      <div className="relative flex items-center gap-2">
        <span className="text-[11px] font-black tracking-tighter">M/</span>
        <div className="h-5 max-w-[60%] flex-1 rounded-full bg-black/[0.06] dark:bg-white/[0.08]" />
      </div>
      <div className="relative mt-4 text-center">
        <div className="font-heading text-xl sm:text-3xl font-bold tracking-tight text-red-600 dark:text-[#ff4d4d]">Black Friday</div>
        <div className="mt-1 text-sm sm:text-lg font-bold">Up to 80% off</div>
        <div className="mt-3 flex justify-center gap-1.5">
          {[
            ["04", "DAYS"],
            ["22", "HRS"],
            ["12", "MIN"],
            ["38", "SEC"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-md bg-black/[0.06] px-2 py-1 dark:bg-white/10 backdrop-blur">
              <div className="text-[11px] font-bold leading-none">{n}</div>
              <div className="mt-0.5 text-[7px] text-neutral-500 dark:text-neutral-400">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 300 80" className="relative mt-auto h-1/3 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="mk" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#22c55e" stopOpacity="0.35" />
            <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 60 L30 52 L55 58 L80 40 L110 46 L140 30 L170 36 L200 20 L230 28 L260 12 L300 18 L300 80 L0 80Z" fill="url(#mk)" />
        <path d="M0 60 L30 52 L55 58 L80 40 L110 46 L140 30 L170 36 L200 20 L230 28 L260 12 L300 18" fill="none" stroke="#22c55e" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function DocsPage() {
  return (
    <div className="h-full bg-[#f8fafc] px-[8%] py-[5%] text-slate-900 dark:bg-[#16181c] dark:text-slate-100">
      <div className="text-[9px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Planning</div>
      <h3 className="mt-2 font-heading text-xl sm:text-3xl font-bold tracking-tight">Q4 Roadmap</h3>
      <div className="mt-4 space-y-2">
        {[100, 92, 97, 70].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {["Spaces v2", "Split View", "Local backup"].map((t, i) => (
          <div key={t} className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-white/5">
            <div className={`mb-1.5 h-1 w-6 rounded-full ${["bg-blue-500", "bg-violet-500", "bg-emerald-500"][i]}`} />
            <div className="text-[9.5px] font-semibold">{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MailPage() {
  return (
    <div className="h-full bg-(--ob-page) p-3 text-(--ob-fg)">
      {["Design review moved to 3pm", "Your build passed ✓", "Weekly digest"].map((s, i) => (
        <div key={s} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 ${i === 0 ? "bg-(--ob-active)" : ""}`}>
          <span className="size-6 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[10.5px] font-semibold">{s}</div>
            <div className="mt-1 h-1.5 w-3/4 rounded-full bg-(--ob-active)" />
          </div>
        </div>
      ))}
    </div>
  );
}

const PAGES: Record<PageKind, () => React.ReactElement> = {
  search: SearchPage,
  video: VideoPage,
  markets: MarketsPage,
  docs: DocsPage,
  mail: MailPage,
};

function Pane({ tab, header, onClose }: { tab: Tab; header: boolean; onClose?: () => void }) {
  const Page = PAGES[tab.kind];
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
      {header && (
        <div className="flex h-6 shrink-0 items-center gap-1.5 bg-(--ob-chrome) px-2 text-[10px] font-medium text-(--ob-fg-2)">
          <Favicon kind={tab.kind} size={11} />
          <span className="truncate">{tab.title}</span>
          <span className="ml-auto flex items-center gap-2 text-(--ob-muted)">
            <ArrowLeftRight className="size-2.5" />
            <button onClick={onClose} aria-label="Close pane" className="hover:text-(--ob-fg)">
              <X className="size-2.5" />
            </button>
          </span>
        </div>
      )}
      <div key={tab.id} className="min-h-0 flex-1 animate-in fade-in duration-300">
        <Page />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Browser                                                             */
/* ------------------------------------------------------------------ */

export function BrowserMockup() {
  const [spaceId, setSpaceId] = React.useState<SpaceId>("personal");
  const [expanded, setExpanded] = React.useState(true);
  const [activeId, setActiveId] = React.useState("p1");
  const [split, setSplit] = React.useState(false);

  const space = SPACES[spaceId];
  const active = space.tabs.find((t) => t.id === activeId) ?? space.tabs[0];
  const splitTab = space.tabs.find((t) => t.id !== active.id && t.kind !== active.kind) ?? space.tabs[1];

  const switchSpace = (id: SpaceId) => {
    setSpaceId(id);
    setActiveId(SPACES[id].tabs[0].id);
  };

  return (
    <div className="orbit-ui relative mx-auto w-full max-w-6xl">
      {/* ================= Floating feature cards (desktop) ================= */}
      <div className="pointer-events-none absolute -left-6 top-[42%] z-20 hidden xl:block">
        <div className="pointer-events-auto w-44 rounded-2xl border border-(--ob-border) bg-(--ob-chrome)/90 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="px-1.5 pb-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-(--ob-muted)">Spaces</div>
          {(Object.keys(SPACES) as SpaceId[]).map((id) => {
            const s = SPACES[id];
            const Icon = s.icon;
            const on = id === spaceId;
            return (
              <button
                key={id}
                onClick={() => switchSpace(id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                  on ? "bg-(--ob-active) text-(--ob-fg)" : "text-(--ob-muted) hover:bg-(--ob-hover)"
                }`}
              >
                <Icon className="size-3.5" style={{ color: s.color }} />
                <span className="font-medium">{s.name}</span>
                <span className="ml-auto text-[10px] opacity-70">{s.tabs.length} tabs</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute -right-8 top-16 z-20 hidden xl:block">
        <div
          key={active.url}
          className="w-56 rounded-2xl border border-(--ob-border) bg-(--ob-chrome)/90 p-3.5 text-(--ob-fg) shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-500"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              <ShieldCheck className="size-4 text-emerald-500" /> Shield
            </span>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">On</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-heading text-3xl font-bold tracking-tight">{active.blocked}</span>
            <span className="text-[11px] text-(--ob-muted)">trackers blocked</span>
          </div>
          <div className="truncate text-[10.5px] text-(--ob-muted)">on {active.url}</div>
        </div>
      </div>

      {/* ================= Window ================= */}
      <div className="relative overflow-hidden rounded-xl bg-(--ob-chrome) font-sans text-(--ob-fg-2) shadow-(--ob-shadow) select-none">
        {/* Glass highlight along the top edge */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Top bar */}
        <div className="flex h-9 items-center gap-2 border-b border-(--ob-border) px-2.5 text-[11px]">
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={() => setExpanded((e) => !e)} aria-label="Toggle sidebar" className="text-(--ob-muted) hover:text-(--ob-fg)">
              <PanelLeft className="size-3.5" />
            </button>
            <Image src="/logo.png" alt="" width={14} height={14} className="object-contain" />
            <span className="hidden sm:inline font-semibold text-(--ob-fg)">TCT Orbit</span>
            <button
              onClick={() => switchSpace(spaceId === "personal" ? "work" : "personal")}
              className="hidden md:flex items-center gap-1.5 rounded-full bg-(--ob-active) px-2 py-0.5 text-[10.5px] font-medium text-(--ob-fg) hover:bg-(--ob-hover)"
              title="Switch Space"
            >
              <span className="size-1.5 rounded-full" style={{ background: space.color }} />
              {space.name}
            </button>
            <span className="hidden md:block h-3.5 w-px bg-(--ob-border)" />
            <div className="hidden md:flex items-center gap-2.5 text-(--ob-muted)">
              <ArrowLeft className="size-3 opacity-50" />
              <ArrowRight className="size-3 opacity-50" />
              <RotateCw className="size-3" />
            </div>
          </div>

          <div className="mx-auto flex h-6 w-full max-w-md items-center gap-2 rounded-md border border-(--ob-border) bg-(--ob-field) px-2.5">
            <Lock className="size-2.5 shrink-0 text-emerald-500" />
            <span key={active.url} className="truncate text-[10.5px] text-(--ob-fg) animate-in fade-in">
              {active.url}
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-(--ob-muted)">
              <ShieldCheck className="size-3 text-emerald-500" />
              <Star className="size-3" />
              <span className="hidden lg:inline font-mono text-[8.5px]">Ctrl+L</span>
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2.5 text-(--ob-muted)">
            <Plus className="hidden sm:block size-3.5" />
            <button
              onClick={() => setSplit((s) => !s)}
              aria-label="Toggle split view"
              className={`rounded p-0.5 transition-colors ${split ? "bg-(--ob-active) text-(--ob-fg)" : "hover:text-(--ob-fg)"}`}
            >
              <Columns2 className="size-3.5" />
            </button>
            <MoreHorizontal className="hidden sm:block size-3.5" />
            <span className="hidden sm:block h-3.5 w-px bg-(--ob-border)" />
            <Minus className="hidden sm:block size-3" />
            <Copy className="hidden sm:block size-3" />
            <X className="hidden sm:block size-3" />
          </div>
        </div>

        {/* Body */}
        <div className="flex h-[420px] sm:h-[540px]">
          {/* Sidebar */}
          <aside
            className={`hidden sm:flex shrink-0 flex-col border-r border-(--ob-border) transition-[width] duration-300 ${
              expanded ? "w-48" : "w-11"
            }`}
          >
            <div className="flex-1 space-y-2 overflow-hidden p-1.5">
              <div className={`flex gap-1 rounded-lg ${expanded ? "items-center bg-(--ob-hover) p-1" : "flex-col items-center"}`}>
                {(["personal", "work"] as const).map((id) => {
                  const Icon = SPACES[id].icon;
                  return (
                    <button
                      key={id}
                      onClick={() => switchSpace(id)}
                      title={`${SPACES[id].name} Space`}
                      className={`flex size-6 items-center justify-center rounded-md transition-colors ${
                        id === spaceId ? "bg-(--ob-active) text-(--ob-fg)" : "text-(--ob-muted) hover:text-(--ob-fg)"
                      }`}
                    >
                      <Icon className="size-3" />
                    </button>
                  );
                })}
                {expanded && (
                  <span className="ml-auto mr-1 flex size-5 items-center justify-center rounded-full bg-(--ob-hover) text-(--ob-muted)">
                    <Plus className="size-2.5" />
                  </span>
                )}
              </div>

              {expanded && (
                <div className="flex items-center justify-between px-1.5 text-[10px]">
                  <span className="flex items-center gap-1.5 font-semibold text-(--ob-fg)">
                    <span className="size-1.5 rounded-full" style={{ background: space.color }} />
                    {space.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-(--ob-muted)">
                    {space.tabs.length} tabs <Sparkles className="size-2.5" />
                  </span>
                </div>
              )}

              {expanded && <div className="h-px bg-(--ob-border)" />}

              <div className={`space-y-0.5 ${expanded ? "" : "flex flex-col items-center pt-1"}`}>
                {space.tabs.map((t) => {
                  const on = t.id === active.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveId(t.id)}
                      title={t.title}
                      className={`relative flex items-center gap-2 rounded-md text-left text-[10.5px] transition-colors ${
                        expanded ? "w-full px-2 py-1.5" : "size-7 justify-center"
                      } ${on ? "bg-(--ob-active) text-(--ob-fg) ring-1 ring-inset ring-(--ob-border)" : "text-(--ob-muted) hover:bg-(--ob-hover)"}`}
                    >
                      {on && <span className="absolute -left-1.5 top-1/2 h-3.5 w-[2px] -translate-y-1/2 rounded-full bg-(--ob-fg)" />}
                      <Favicon kind={t.kind} size={expanded ? 12 : 13} />
                      {expanded && <span className="truncate">{t.title}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-0.5 border-t border-(--ob-border) p-1.5">
              {expanded ? (
                <div className="mb-1 flex items-center gap-2 rounded-lg bg-(--ob-active) px-2.5 py-1.5 text-[11px] font-medium text-(--ob-fg)">
                  <Plus className="size-3.5" /> New Tab
                </div>
              ) : (
                <div className="mx-auto mb-1 flex size-6 items-center justify-center rounded-full bg-(--ob-active) text-(--ob-fg)">
                  <Plus className="size-3" />
                </div>
              )}
              <RailButton icon={EyeOff} label="New Private Tab" expanded={expanded} accent="#8b5cf6" />
              <RailButton icon={History} label="History" expanded={expanded} />
              <RailButton icon={Download} label="Downloads" expanded={expanded} />
              <RailButton icon={Star} label="Bookmarks" expanded={expanded} />
              <RailButton icon={Settings} label="Settings" expanded={expanded} />
            </div>
          </aside>

          {/* Viewport */}
          <main className="flex min-w-0 flex-1 bg-(--ob-viewport)">
            <Pane tab={active} header={split} onClose={() => setSplit(false)} />
            {split && (
              <>
                <div className="group hidden sm:flex w-1.5 cursor-col-resize items-center justify-center bg-(--ob-chrome)">
                  <span className="h-8 w-0.5 rounded-full bg-(--ob-border) group-hover:bg-(--ob-muted)" />
                </div>
                <div className="hidden sm:flex min-w-0 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
                  <Pane tab={splitTab} header onClose={() => setSplit(false)} />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
