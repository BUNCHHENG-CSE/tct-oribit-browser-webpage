import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyEdgeSessionToken } from "./lib/auth-edge";
import { getAdminSlug, getAdminSessionSecret } from "./lib/admin-config";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSlug = getAdminSlug();
  const secret = getAdminSessionSecret();
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // 1. Direct access to /admin, /dashboard, /wp-admin returns a 404 Not Found honeypot
  // Automated scanners & crawlers will receive 404 with zero hint of an admin dashboard
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/wp-admin" ||
    pathname === "/cpanel"
  ) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), {
      status: 404,
    });
  }

  // 2. Protect /api/admin/* endpoints (require valid session, return 404 if invalid)
  if (pathname.startsWith("/api/admin")) {
    const isValid = secret ? await verifyEdgeSessionToken(token, secret) : false;
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }
    return NextResponse.next();
  }

  // 3. Stealth Admin Gateway matching (accessible strictly via the secret slug)
  if (pathname === `/${adminSlug}` || pathname.startsWith(`/${adminSlug}/`)) {
    const isLoginPage = pathname === `/${adminSlug}/login`;
    const isValid = secret ? await verifyEdgeSessionToken(token, secret) : false;

    if (!isValid && !isLoginPage) {
      const loginUrl = new URL(`/${adminSlug}/login`, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isValid && isLoginPage) {
      return NextResponse.redirect(new URL(`/${adminSlug}`, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
