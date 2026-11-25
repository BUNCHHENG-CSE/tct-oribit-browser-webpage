import { isAuthenticatedAdmin } from "@/lib/actions/admin/auth";
import { UnauthorizedView } from "@/components/errors/UnauthorizedView";
import { Suspense } from "react";
import { connection } from "next/server";
import { getAllReleases } from "@/lib/queries/releases";
import { ReleaseCrudClient } from "@/components/admin/ReleaseCrudClient";

export const instant = false;

async function ReleasesContent() {
  await connection();
  if (!(await isAuthenticatedAdmin())) return <UnauthorizedView />;
  const releases = await getAllReleases();
  return <ReleaseCrudClient initialReleases={releases} />;
}

export default function AdminReleasesPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-6">
          <div className="h-8 w-48 bg-muted/60 rounded-lg animate-pulse" />
          <div className="h-64 w-full bg-card/60 border border-border/50 rounded-2xl animate-pulse" />
        </div>
      }
    >
      <ReleasesContent />
    </Suspense>
  );
}
