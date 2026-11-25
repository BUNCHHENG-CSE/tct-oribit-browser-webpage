import { isAuthenticatedAdmin } from "@/lib/actions/admin/auth";
import { UnauthorizedView } from "@/components/errors/UnauthorizedView";
import { Suspense } from "react";
import { connection } from "next/server";
import { getAllFaqs } from "@/lib/queries/faqs";
import { FaqCrudClient } from "@/components/admin/FaqCrudClient";

export const instant = false;

async function FaqsContent() {
  await connection();
  if (!(await isAuthenticatedAdmin())) return <UnauthorizedView />;
  const faqs = await getAllFaqs();
  return <FaqCrudClient initialFaqs={faqs} />;
}

export default function AdminFaqsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-6">
          <div className="h-8 w-48 bg-muted/60 rounded-lg animate-pulse" />
          <div className="h-64 w-full bg-card/60 border border-border/50 rounded-2xl animate-pulse" />
        </div>
      }
    >
      <FaqsContent />
    </Suspense>
  );
}
