import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/auth";

// Corre en Edge Runtime (Cloudflare Workers) — sólo verifica el JWT de la
// cookie, nunca toca D1 directamente (por eso no importa src/lib/db.ts ni
// src/db/schema.ts, que arrastrarían drizzle-orm/d1 innecesariamente acá).
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { env } = await getCloudflareContext({ async: true });
  const session = token ? await verifyToken(token, env.AUTH_SECRET) : null;
  const isLoggedIn = !!session;

  if (!isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl.origin));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
