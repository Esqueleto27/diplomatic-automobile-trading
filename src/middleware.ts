import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/auth";
import { siteUrl } from "@/lib/site";

// Dominio final del sitio (ver src/lib/site.ts). Mientras el proyecto viva
// en el preview *.workers.dev, cualquier host que no sea este recibe
// noindex — evita que Google indexe el preview en paralelo al sitio real.
const CANONICAL_HOST = new URL(siteUrl).host;

// Corre en Edge Runtime (Cloudflare Workers) — el chequeo de sesión sólo
// toca D1 vía JWT/cookie (jose, edge-safe), nunca importa src/lib/db.ts ni
// src/db/schema.ts, que arrastrarían drizzle-orm/d1 innecesariamente acá.
// Ahora corre en todo el sitio (antes sólo /admin/*) porque los headers de
// seguridad y el noindex de preview aplican a cualquier ruta pública.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminRoute) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const { env } = await getCloudflareContext({ async: true });
    const session = token ? await verifyToken(token, env.AUTH_SECRET) : null;
    const isLoggedIn = !!session;

    if (!isLoginPage && !isLoggedIn) {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/admin/login", request.nextUrl.origin)),
        request,
      );
    }

    if (isLoginPage && isLoggedIn) {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/admin", request.nextUrl.origin)),
        request,
      );
    }
  }

  return withSecurityHeaders(NextResponse.next(), request);
}

function withSecurityHeaders(
  response: NextResponse,
  request: NextRequest,
): NextResponse {
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()",
  );

  if (request.nextUrl.host !== CANONICAL_HOST) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  // Corre en todas las rutas menos assets estáticos/imagen optimizada.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
