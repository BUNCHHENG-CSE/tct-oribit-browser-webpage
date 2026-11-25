"use client";

import * as React from "react";
import Image from "next/image";
import {
  PanelLeft,
  Lock,
  ShieldCheck,
  Star,
  Columns2,
  Minus,
  Copy,
  X,
  Plus,
  Layers,
  Briefcase,
  FlaskConical,
  EyeOff,
  History,
  Sparkles,
  ArrowLeftRight,
  NotebookPen,
  Play,
  FileText,
  Mail,
  Code2,
  BookOpen,
  Search,
} from "lucide-react";

/* ================================================================== */
/* Shared: Orbit window chrome (matches the real app)                 */
/* ================================================================== */

function Fav({ icon: Icon, bg, size = 12 }: { icon: React.ElementType; bg: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[3px] text-white"
      style={{ width: size, height: size, background: bg }}
    >
      <Icon style={{ width: size * 0.62, height: size * 0.62 }} strokeWidth={3} />
    </span>
  );
}

function Window({
  space,
  spaceColor = "#a3a3a3",
  url,
  splitOn,
  hideChrome,
  children,
}: {
  space: string;
  spaceColor?: string;
  url: string;
  splitOn?: boolean;
  hideChrome?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#141414] text-neutral-300 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] select-none">
      <div
        className={`flex items-center gap-2 overflow-hidden border-white/[0.06] bg-[#141414] px-2.5 text-[10px] transition-all duration-500 ${
          hideChrome ? "h-0 border-b-0 opacity-0" : "h-8 border-b opacity-100"
        }`}
      >
        <PanelLeft className="size-3 shrink-0 text-neutral-500" />
        <Image src="/logo.png" alt="" width={12} height={12} className="object-contain" />
        <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/[0.07] px-2 py-0.5 text-[9.5px] font-medium text-neutral-200">
          <span className="size-1.5 rounded-full transition-colors duration-500" style={{ background: spaceColor }} />
          {space}
        </span>
        <div className="mx-auto flex h-5 w-full max-w-[55%] items-center gap-1.5 rounded-md border border-white/[0.06] bg-[#1c1c1c] px-2">
          <Lock className="size-2.5 shrink-0 text-emerald-400" />
          <span className="truncate text-[9.5px] text-neutral-200">{url}</span>
          <span className="ml-auto flex items-center gap-1 text-neutral-500">
            <ShieldCheck className="size-2.5 text-emerald-400" />
            <Star className="size-2.5" />
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-neutral-500">
          <Columns2 className={`size-3 ${splitOn ? "text-white" : ""}`} />
          <Minus className="hidden sm:block size-2.5" />
          <Copy className="hidden sm:block size-2.5" />
          <X className="hidden sm:block size-2.5" />
        </div>
      </div>
      <div className="relative aspect-[16/10]">{children}</div>
    </div>
  );
}

function Controls({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex flex-wrap items-center justify-center gap-2">{children}</div>;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-colors ${
        active
          ? "bg-foreground text-background ring-foreground"
          : "bg-foreground/[0.04] text-muted-foreground ring-foreground/10 hover:text-foreground hover:ring-foreground/25"
      }`}
    >
      {children}
    </button>
  );
}

/* ================================================================== */
/* 1. Spaces                                                          */
/* ================================================================== */

const SPACES = [
  {
    name: "Work",
    key: "1",
    icon: Briefcase,
    color: "#60a5fa",
    account: "you@company.com",
    tabs: [
      { t: "Q4 Roadmap — Docs", i: FileText, c: "#3b82f6" },
      { t: "Inbox (3)", i: Mail, c: "#f59e0b" },
      { t: "PR #412 · orbit/app", i: Code2, c: "#525252" },
      { t: "Sprint board", i: Layers, c: "#8b5cf6" },
    ],
    page: { kicker: "Docs", title: "Q4 Product Roadmap", tone: "light" as const },
  },
  {
    name: "Research",
    key: "2",
    icon: FlaskConical,
    color: "#c084fc",
    account: "you@university.edu",
    tabs: [
      { t: "Attention Is All You Need", i: BookOpen, c: "#b91c1c" },
      { t: "Reading list", i: Star, c: "#ca8a04" },
      { t: "Lab notebook", i: NotebookPen, c: "#16a34a" },
    ],
    page: { kicker: "Paper · arXiv", title: "Attention Is All You Need", tone: "paper" as const },
  },
  {
    name: "Personal",
    key: "3",
    icon: Layers,
    color: "#a3a3a3",
    account: "you@gmail.com",
    tabs: [
      { t: "Search privately", i: Search, c: "#de5833" },
      { t: "Video — Home", i: Play, c: "#ff0033" },
      { t: "Weekend in Kyoto", i: Sparkles, c: "#0ea5e9" },
    ],
    page: { kicker: "Travel", title: "48 hours in Kyoto", tone: "dark" as const },
  },
];

export function SpacesVisual() {
  const [idx, setIdx] = React.useState(0);
  const [auto, setAuto] = React.useState(true);

  React.useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SPACES.length), 3000);
    return () => clearInterval(t);
  }, [auto]);

  const s = SPACES[idx];
  const pick = (i: number) => {
    setAuto(false);
    setIdx(i);
  };

  const pageTone =
    s.page.tone === "light"
      ? "bg-[#f8fafc] text-slate-900"
      : s.page.tone === "paper"
      ? "bg-[#f6f3ee] text-[#1f1d1a]"
      : "bg-[#1c1c1c] text-neutral-100";
  const line = s.page.tone === "dark" ? "bg-white/10" : "bg-black/10";

  return (
    <div>
      <Window space={s.name} spaceColor={s.color} url={s.tabs[0].t.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".example"}>
        <div className="absolute inset-0 flex">
          {/* Sidebar (expanded, like the real app) */}
          <aside className="flex w-[34%] shrink-0 flex-col border-r border-white/[0.06] p-1.5">
            <div className="flex items-center gap-1 rounded-md bg-white/[0.04] p-1">
              {SPACES.map((sp, i) => {
                const Icon = sp.icon;
                return (
                  <button
                    key={sp.name}
                    onClick={() => pick(i)}
                    title={sp.name}
                    className={`flex size-5 items-center justify-center rounded transition-colors ${
                      i === idx ? "bg-white/15" : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Icon className="size-2.5" style={{ color: sp.color }} />
                  </button>
                );
              })}
              <Plus className="ml-auto mr-0.5 size-2.5 text-neutral-500" />
            </div>

            <div key={idx} className="flex-1 animate-in fade-in slide-in-from-left-1 duration-300">
              <div className="flex items-center justify-between px-1 pb-1 pt-2 text-[9px]">
                <span className="flex items-center gap-1.5 font-semibold text-neutral-100">
                  <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="text-neutral-500">{s.tabs.length} tabs</span>
              </div>
              <div className="mb-1 h-px bg-white/[0.06]" />
              {s.tabs.map((tab, i) => (
                <div
                  key={tab.t}
                  className={`relative flex items-center gap-1.5 rounded px-1.5 py-1 text-[9.5px] ${
                    i === 0 ? "bg-white/[0.08] text-white" : "text-neutral-400"
                  }`}
                >
                  {i === 0 && <span className="absolute -left-1.5 h-2.5 w-[2px] rounded-full bg-neutral-300" />}
                  <Fav icon={tab.i} bg={tab.c} size={10} />
                  <span className="truncate">{tab.t}</span>
                </div>
              ))}
            </div>

            <div className="space-y-0.5 border-t border-white/[0.06] pt-1 text-[9px] text-neutral-500">
              <div className="flex items-center gap-1.5 rounded bg-white/[0.06] px-1.5 py-1 text-neutral-200">
                <Plus className="size-2.5" /> New Tab
              </div>
              <div className="flex items-center gap-1.5 px-1.5 py-0.5">
                <EyeOff className="size-2.5 text-violet-400" /> New Private Tab
              </div>
              <div className="flex items-center gap-1.5 px-1.5 py-0.5">
                <History className="size-2.5" /> History
              </div>
            </div>
          </aside>

          {/* Page */}
          <div key={`p${idx}`} className={`relative flex-1 overflow-hidden p-[5%] animate-in fade-in duration-500 ${pageTone}`}>
            <div className="mb-4 flex items-center justify-between">
              <div className={`h-2 w-12 rounded-full ${s.page.tone === "dark" ? "bg-white/70" : "bg-black/70"}`} />
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-medium ring-1 ring-inset"
                style={{ color: s.color, borderColor: s.color, boxShadow: `inset 0 0 0 1px ${s.color}55` }}
              >
                <span className="size-3 rounded-full" style={{ background: s.color }} />
                {s.account}
              </span>
            </div>
            <div className="text-[8.5px] font-semibold uppercase tracking-widest opacity-60">{s.page.kicker}</div>
            <h4
              className={`mt-1 text-base sm:text-xl font-bold leading-tight tracking-tight ${
                s.page.tone === "paper" ? "font-serif" : "font-heading"
              }`}
            >
              {s.page.title}
            </h4>
            <div className="mt-3 space-y-1.5">
              {[100, 94, 98, 72].map((w, i) => (
                <div key={i} className={`h-1.5 rounded-full ${line}`} style={{ width: `${w}%` }} />
              ))}
            </div>
            <div
              className="mt-4 h-[28%] rounded-lg"
              style={{ background: `linear-gradient(135deg, ${s.color}66, transparent)` }}
            />
          </div>
        </div>

        {/* Shortcut toast */}
        <div
          key={`k${idx}`}
          className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/80 px-2.5 py-1.5 text-[10px] text-neutral-200 ring-1 ring-white/10 backdrop-blur animate-in fade-in zoom-in-95 duration-300"
        >
          <span className="size-1.5 rounded-full" style={{ background: s.color }} />
          <span>{s.name}</span>
        </div>
      </Window>

      <Controls>
        {SPACES.map((sp, i) => {
          const Icon = sp.icon;
          return (
            <Chip key={sp.name} active={i === idx} onClick={() => pick(i)}>
              <Icon className="size-3.5" /> {sp.name}
            </Chip>
          );
        })}
      </Controls>
    </div>
  );
}

/* ================================================================== */
/* 2. Split View                                                      */
/* ================================================================== */

type PaneData = {
  title: string;
  url: string;
  icon: React.ElementType;
  color: string;
  zoom: string;
  body: React.ReactNode;
};

function SplitPane({ p, focused, onFocus }: { p: PaneData; focused: boolean; onFocus: () => void }) {
  return (
    <div
      onClick={onFocus}
      className={`flex h-full w-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-md transition-shadow ${
        focused ? "ring-2 ring-sky-400/80" : "ring-1 ring-white/[0.06]"
      }`}
    >
      <div className="flex h-5 shrink-0 items-center gap-1.5 bg-[#161616] px-2 text-[9px] font-medium text-neutral-200">
        <Fav icon={p.icon} bg={p.color} size={10} />
        <span className="truncate">{p.title}</span>
        <span className="ml-auto flex items-center gap-1.5 text-neutral-500">
          <span className="font-mono text-[8px]">{p.zoom}</span>
          <ArrowLeftRight className="size-2.5" />
          <X className="size-2.5" />
        </span>
      </div>
      <div className="min-h-0 flex-1">{p.body}</div>
    </div>
  );
}

export function SplitViewVisual() {
  const [ratio, setRatio] = React.useState(54);
  const [focus, setFocus] = React.useState<0 | 1>(0);
  const [swapped, setSwapped] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setRatio(Math.min(72, Math.max(28, ((e.clientX - r.left) / r.width) * 100)));
  };

  const docs: PaneData = {
    title: "API Reference — docs",
    url: "docs.api.example/reference",
    icon: FileText,
    color: "#3b82f6",
    zoom: "100%",
    body: (
      <div className="h-full bg-[#f8fafc] p-3 text-slate-900">
        <div className="text-[8px] font-semibold uppercase tracking-widest text-blue-600">Reference</div>
        <div className="mt-1 font-heading text-sm sm:text-base font-bold">tabs.query()</div>
        <div className="mt-2 space-y-1.5">
          {[100, 92, 96, 70].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full bg-slate-200" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-3 rounded-md border border-slate-200 bg-white p-2 font-mono text-[8.5px] leading-relaxed text-slate-600">
          <span className="text-blue-600">GET</span> /api/tabs?space=work
          <br />
          <span className="text-slate-400">→ 200 OK · 12 tabs</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {["Parameters", "Returns"].map((t) => (
            <div key={t} className="rounded-md bg-slate-100 p-1.5 text-[8.5px] font-semibold">
              {t}
              <div className="mt-1 h-1 w-3/4 rounded-full bg-slate-300" />
            </div>
          ))}
        </div>
      </div>
    ),
  };

  const code: PaneData = {
    title: "orbit/app — tabs.ts",
    url: "code.example/orbit/app",
    icon: Code2,
    color: "#525252",
    zoom: "90%",
    body: (
      <div className="h-full bg-[#0d1117] p-3 font-mono text-[9px] leading-[1.7] text-neutral-400">
        {[
          <React.Fragment key="l1"><span className="text-violet-400">export async function</span> <span className="text-sky-300">loadTabs</span>() {"{"}</React.Fragment>,
          <React.Fragment key="l2">&nbsp;&nbsp;<span className="text-violet-400">const</span> res = <span className="text-violet-400">await</span> fetch(<span className="text-emerald-300">&quot;/api/tabs&quot;</span>)</React.Fragment>,
          <React.Fragment key="l3">&nbsp;&nbsp;<span className="text-violet-400">if</span> (!res.ok) <span className="text-violet-400">throw</span> res</React.Fragment>,
          <React.Fragment key="l4">&nbsp;&nbsp;<span className="text-violet-400">return</span> res.json()</React.Fragment>,
          <React.Fragment key="l5">{"}"}</React.Fragment>,
          <span key="l6" className="text-neutral-600">{"// 12 tabs in Work space"}</span>,
        ].map((c, n) => (
          <div key={n} className="flex gap-3">
            <span className="w-3 text-right text-neutral-600">{n + 1}</span>
            <span className="truncate">{c}</span>
          </div>
        ))}
      </div>
    ),
  };

  const panes = swapped ? [code, docs] : [docs, code];


  return (
    <div>
      <Window space="Work" spaceColor="#60a5fa" url={panes[focus].url} splitOn>
        <div
          ref={ref}
          onPointerMove={onMove}
          onPointerUp={() => (dragging.current = false)}
          onPointerLeave={() => (dragging.current = false)}
          className="absolute inset-0 flex bg-[#0e0e0e] p-1"
        >
          <div className="h-full min-w-0" style={{ width: `${ratio}%` }}>
            <SplitPane p={panes[0]} focused={focus === 0} onFocus={() => setFocus(0)} />
          </div>
          <div
            onPointerDown={(e) => {
              dragging.current = true;
              (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
            }}
            role="separator"
            aria-label="Drag to resize"
            className="group flex w-2.5 shrink-0 cursor-col-resize touch-none items-center justify-center"
          >
            <span className="h-10 w-1 rounded-full bg-white/25 transition-colors group-hover:bg-sky-400" />
          </div>
          <div className="h-full min-w-0 flex-1">
            <SplitPane p={panes[1]} focused={focus === 1} onFocus={() => setFocus(1)} />
          </div>
        </div>
      </Window>

      <Controls>
        <Chip onClick={() => setFocus(0)} active={focus === 0}>
          Focus left
        </Chip>
        <Chip onClick={() => setFocus(1)} active={focus === 1}>
          Focus right
        </Chip>
        <Chip onClick={() => setSwapped((s) => !s)}>
          <ArrowLeftRight className="size-3.5" /> Swap panes
        </Chip>
        <span className="w-full text-center text-xs text-muted-foreground">Drag the divider to resize.</span>
      </Controls>
    </div>
  );
}
