/**
 * Lightweight, theme-aware illustrations for the /features page.
 * Pure markup (server components, no images, no client JS): crisp at any size,
 * correct in light and dark mode, and they only show features that ship.
 */
import { Search, CloudRain, Waves, Coffee, Sparkles, Activity } from "lucide-react";

function Frame({ children, url = "tctorbit.com", className = "" }: { children: React.ReactNode; url?: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={`overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl shadow-primary/5 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-3 py-2">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-amber-400/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 flex-1 truncate rounded-full bg-background/70 px-3 py-0.5 font-mono text-[10px] text-muted-foreground">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

const Line = ({ w, strong = false }: { w: string; strong?: boolean }) => (
  <div className={`h-2 rounded-full ${strong ? "bg-foreground/60" : "bg-muted-foreground/20"}`} style={{ width: w }} />
);

const SPACES = [
  { name: "Work", color: "bg-blue-500", tabs: ["Pull requests", "Sprint board", "API docs"] },
  { name: "Research", color: "bg-violet-500" },
  { name: "Personal", color: "bg-emerald-500" },
];

export function SpacesViz() {
  return (
    <Frame url="spaces / work">
      <div className="flex h-64">
        <aside className="w-40 shrink-0 space-y-1 border-r border-border/60 bg-muted/30 p-2.5">
          {SPACES.map((s, i) => (
            <div
              key={s.name}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${
                i === 0 ? "bg-primary/15 font-semibold text-primary" : "text-muted-foreground"
              }`}
            >
              <span className={`size-2 rounded-full ${s.color}`} />
              {s.name}
            </div>
          ))}
          <div className="my-2 h-px bg-border/60" />
          {SPACES[0].tabs!.map((t, i) => (
            <div
              key={t}
              className={`truncate rounded-md px-2.5 py-1 text-[11px] ${i === 0 ? "bg-background text-foreground" : "text-muted-foreground"}`}
            >
              {t}
            </div>
          ))}
        </aside>
        <div className="flex-1 space-y-2.5 p-5">
          <Line w="55%" strong />
          <Line w="90%" />
          <Line w="80%" />
          <div className="mt-4 h-24 rounded-xl bg-gradient-to-br from-blue-500/25 to-transparent" />
        </div>
      </div>
    </Frame>
  );
}

export function CommandViz() {
  const rows = [
    { label: "Toggle Split View", hint: "Ctrl \\" },
    { label: "Go to tab: Sprint board", hint: "Tab" },
    { label: "Switch to Space: Research", hint: "Space" },
    { label: "Open Settings", hint: "Ctrl ," },
  ];
  return (
    <div aria-hidden className="relative">
      <Frame className="opacity-60">
        <div className="h-64 space-y-2.5 p-5">
          <Line w="40%" strong />
          <Line w="85%" />
          <Line w="70%" />
        </div>
      </Frame>
      <div className="absolute inset-x-6 top-10 rounded-2xl border border-primary/30 bg-card shadow-2xl shadow-primary/20">
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3 text-sm">
          <Search className="size-4 text-muted-foreground" />
          <span>split</span>
          <span className="h-4 w-px animate-pulse bg-primary" />
          <kbd className="ml-auto">Ctrl K</kbd>
        </div>
        <ul className="p-1.5 text-xs">
          {rows.map((r, i) => (
            <li
              key={r.label}
              className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                i === 0 ? "bg-primary/15 font-medium text-primary" : "text-muted-foreground"
              }`}
            >
              {r.label}
              <span className="font-mono text-[10px] opacity-70">{r.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Pane({ tint }: { tint: string }) {
  return (
    <div className="flex-1 space-y-2 rounded-xl border border-border/60 bg-background/60 p-3">
      <Line w="50%" strong />
      <Line w="95%" />
      <Line w="80%" />
      <Line w="88%" />
      <div className={`mt-3 h-20 rounded-lg ${tint}`} />
    </div>
  );
}

export function SplitViz() {
  return (
    <Frame url="docs.example ⟷ github.com">
      <div className="relative flex h-64 gap-1.5 p-2.5">
        <Pane tint="bg-blue-500/15" />
        <div className="flex w-2 items-center justify-center">
          <span className="h-14 w-1 rounded-full bg-primary" />
        </div>
        <Pane tint="bg-emerald-500/15" />
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border/60 bg-card px-3 py-1 text-[11px] shadow-lg">
          <kbd>Ctrl</kbd> + <kbd>\</kbd> Split View
        </span>
      </div>
    </Frame>
  );
}

export function ZenReaderViz() {
  return (
    <div aria-hidden className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex h-56 items-center justify-center rounded-2xl border border-border/70 bg-card p-5 shadow-xl">
          <div className="w-full space-y-2">
            <Line w="60%" strong />
            <Line w="100%" />
            <Line w="92%" />
            <Line w="96%" />
            <Line w="70%" />
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          <kbd>F11</kbd> Zen: no browser UI
        </p>
      </div>
      <div className="space-y-2">
        <div className="h-56 rounded-2xl border border-border/70 bg-[#f7f3ea] p-5 text-[#2a2620] shadow-xl dark:bg-[#1f1d1a] dark:text-[#ece6da]">
          <p className="font-serif text-sm font-bold leading-snug">How focus works</p>
          <p className="mt-2 font-serif text-[11px] leading-relaxed opacity-80">
            Clean, readable text with the ads, banners and sidebars stripped away. Just the article.
          </p>
          <div className="mt-3 space-y-1.5 opacity-40">
            <div className="h-1.5 w-full rounded-full bg-current" />
            <div className="h-1.5 w-11/12 rounded-full bg-current" />
            <div className="h-1.5 w-4/5 rounded-full bg-current" />
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          <kbd>F9</kbd> Reader: clean text
        </p>
      </div>
    </div>
  );
}

export function NotesPomodoroViz() {
  return (
    <div aria-hidden className="grid grid-cols-1 sm:grid-cols-5 gap-4">
      <div className="sm:col-span-3 rounded-2xl border border-border/70 bg-card p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="font-semibold">Notes · Work</span>
          <kbd>Ctrl ⇧ N</kbd>
        </div>
        <ul className="space-y-2 text-[11px] text-muted-foreground">
          <li>• Review auth PR before standup</li>
          <li>• API rate limit is per token</li>
          <li>• Ask design about empty states</li>
        </ul>
        <div className="mt-4 space-y-1.5">
          <Line w="80%" />
          <Line w="60%" />
        </div>
      </div>
      <div className="sm:col-span-2 flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-card p-4 shadow-xl">
        <div className="relative flex size-24 items-center justify-center rounded-full border-4 border-muted">
          <div className="absolute inset-[-4px] rounded-full border-4 border-primary border-r-transparent border-b-transparent rotate-45" />
          <div className="text-center">
            <div className="font-mono text-lg font-bold">25:00</div>
            <div className="text-[10px] text-muted-foreground">focus</div>
          </div>
        </div>
        <div className="mt-3 flex gap-1.5 text-muted-foreground">
          <CloudRain className="size-4 text-primary" />
          <Waves className="size-4" />
          <Coffee className="size-4" />
        </div>
      </div>
    </div>
  );
}

export function TabsViz() {
  const usage = [
    { tab: "Video call", mem: "w-4/5", cpu: "w-3/5" },
    { tab: "Design file", mem: "w-3/5", cpu: "w-2/5" },
    { tab: "Docs", mem: "w-1/4", cpu: "w-1/12" },
  ];
  return (
    <div aria-hidden className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xl">
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-xs">
          <Search className="size-3.5 text-muted-foreground" />
          github
          <kbd className="ml-auto">Ctrl ⇧ A</kbd>
        </div>
        <ul className="mt-2 space-y-1 text-[11px]">
          <li className="rounded-md bg-primary/15 px-2.5 py-1.5 font-medium text-primary">GitHub · Pull requests <span className="opacity-60">(Work)</span></li>
          <li className="px-2.5 py-1.5 text-muted-foreground">GitHub · Issues <span className="opacity-60">(Work)</span></li>
          <li className="px-2.5 py-1.5 text-muted-foreground">GitHub · Stars <span className="opacity-60">(Personal)</span></li>
        </ul>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
          <Sparkles className="size-3" /> Tab Tidy
        </div>
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold">
            <Activity className="size-3.5 text-primary" /> Task Manager
          </span>
          <kbd>⇧ Esc</kbd>
        </div>
        <div className="grid grid-cols-[1fr_4rem_4rem] gap-x-3 gap-y-2.5 text-[11px]">
          <span className="text-muted-foreground">Tab</span>
          <span className="text-muted-foreground">Memory</span>
          <span className="text-muted-foreground">CPU</span>
          {usage.map((u) => (
            <div key={u.tab} className="contents">
              <span className="truncate">{u.tab}</span>
              <span className="flex items-center"><span className={`h-1.5 rounded-full bg-primary/70 ${u.mem}`} /></span>
              <span className="flex items-center"><span className={`h-1.5 rounded-full bg-amber-500/70 ${u.cpu}`} /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
