export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted/60 rounded-xl" />
          <div className="h-4 w-96 bg-muted/40 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-muted/50 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-card/60 border border-border/40 rounded-3xl p-6 space-y-3">
            <div className="h-4 w-24 bg-muted/50 rounded" />
            <div className="h-8 w-16 bg-muted/70 rounded" />
          </div>
        ))}
      </div>

      <div className="h-80 bg-card/60 border border-border/40 rounded-3xl p-6" />
    </div>
  );
}
