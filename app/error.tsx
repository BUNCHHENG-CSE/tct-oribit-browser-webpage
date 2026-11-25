"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-5">
      <div className="p-3 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
        <AlertCircle className="size-8" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-heading font-bold">
        Orbital System Disruption
      </h2>
      <p className="text-muted-foreground text-sm max-w-md">
        An unexpected error occurred while rendering this view. Your local session remains safe and uncompromised.
      </p>
      <Button
        onClick={() => reset()}
        className="rounded-full bg-primary text-primary-foreground font-medium px-6"
      >
        <RotateCcw className="size-4 mr-2" />
        <span>Re-align Orbit (Retry)</span>
      </Button>
    </div>
  );
}
