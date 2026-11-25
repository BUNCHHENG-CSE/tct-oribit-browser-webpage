import {
  NotebookPen,
  Search,
  ArrowDownToLine,
  Camera,
  Code2,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";

const ITEMS: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  { icon: NotebookPen, title: "Notes & Pomodoro", desc: "Notes for each Space and a 25/5 focus timer with ambient sounds." },
  { icon: Search, title: "Tab Search & Task Manager", desc: "Find any tab across Spaces and see what's using your memory." },
  { icon: Camera, title: "Smart tools", desc: "Screenshots, QR codes, picture-in-picture and clean link copying." },
  { icon: ArrowDownToLine, title: "One-click import", desc: "Bring bookmarks and history from Chrome, Edge, Brave and Firefox." },
  { icon: Code2, title: "Docked DevTools", desc: "Full Chromium DevTools, docked right beside the page." },
  { icon: BadgeCheck, title: "Free, no strings", desc: "No account, no ads, no subscription, no sponsored content. Ever." },
];

export function BuiltIn() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">And so much more</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Everything else, built in.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The tools you&apos;d normally hunt for extensions to get, ready from the first launch.
          </p>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="group bg-card p-8 transition-colors hover:bg-muted/50">
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white shadow-lg shadow-primary/25 transition-transform group-hover:scale-110">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 font-semibold tracking-tight">{title}</h3>
              <p className="mt-1.5 leading-relaxed text-muted-foreground">{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
