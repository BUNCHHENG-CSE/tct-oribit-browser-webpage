import { OrbitLogo } from "@/components/layout/OrbitLogo";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        <OrbitLogo size={36} showText={false} />
        <div className="absolute -inset-3 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </div>
      <div className="text-xs font-mono text-muted-foreground animate-pulse">
        Aligning orbital data stream...
      </div>
    </div>
  );
}
