import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/actions/admin/auth";
import { exportSubscribersCsv } from "@/lib/actions/admin/subscribers";

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const csv = await exportSubscribersCsv();

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tct-orbit-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
