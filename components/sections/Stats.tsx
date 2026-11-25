/** Honest, verifiable claims only: these are product facts, not usage numbers. */
const STATS = [
  { value: "0", suffix: "bytes", label: "of telemetry sent" },
  { value: "100", suffix: "%", label: "of your data stays local" },
  { value: "6", suffix: "+", label: "protections on by default" },
  { value: "$0", suffix: "", label: "free, no account needed" },
];

export function Stats() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <dl className="grid grid-cols-2 gap-y-10 rounded-3xl border border-border bg-card/60 px-6 py-10 sm:px-10 lg:grid-cols-4 lg:divide-x lg:divide-border">
          {STATS.map((s) => (
            <div key={s.label} className="reveal text-center lg:px-6">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {s.value}
                  {s.suffix && <span className="text-gradient ml-1 text-2xl sm:text-3xl">{s.suffix}</span>}
                </span>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
