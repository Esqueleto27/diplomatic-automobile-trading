import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/auth";
import { siteUrl } from "@/lib/site";

// Dominio final del sitio (ver src/lib/site.ts). Mientras el proyecto viva
// en el preview *.workers.dev, cualquier host que no sea este recibe
// noindex — evita que Google indexe el preview en paralelo al sitio real.
const CANONICAL_HOST = new URL(siteUrl).host;

// Mismo host de R2 que next.config.ts (remotePatterns) y src/lib/site.ts
// (ASSETS_BASE_URL) — hardcodeado a propósito en los tres lugares, mismo
// criterio explicado ahí: es estable y cambiarlo ya implica tocar código.
const R2_HOST = "https://pub-2a4b20ea6c834e9d8fda32f7a54be906.r2.dev";

// Corre en Edge Runtime (Cloudflare Workers) — el chequeo de sesión sólo
// toca D1 vía JWT/cookie (jose, edge-safe), nunca importa src/lib/db.ts ni
// src/db/schema.ts, que arrastrarían drizzle-orm/d1 innecesariamente acá.
// Ahora corre en todo el sitio (antes sólo /admin/*) porque los headers de
// seguridad y el noindex de preview aplican a cualquier ruta pública.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // Nonce por request para la Content-Security-Policy: permite los <script>
  // JSON-LD propios del sitio (Schema.org en SiteLayout y en la ficha de
  // auto) sin abrir script-src a 'unsafe-inline', que habilitaría cualquier
  // script inyectado por un XSS. Se manda también como header de REQUEST
  // (no sólo de respuesta) para que esos Server Components puedan leerlo
  // con `headers()` y ponerlo en el atributo `nonce` del script.
  const nonce = crypto.randomUUID();
  // En desarrollo, webpack envuelve cada módulo en `eval()` (devtool
  // eval-source-map) y el refresco en caliente abre un WebSocket — sin estas
  // dos excepciones el navegador bloquea TODO el JS de cliente en local: la
  // página se ve pero nada hidrata (los `<Reveal>` quedan en opacity:0, el
  // header nunca detecta el scroll, el menú móvil no abre). Sólo en dev: el
  // build de producción no usa eval, así que la política real sigue cerrada.
  const isDev = process.env.NODE_ENV !== "production";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ""}`,
    // 'unsafe-inline' sólo para estilos: React/Tailwind ponen varios
    // `style={{...}}` fijos en el servidor (filtros de imagen, delays de
    // animación, alturas calculadas de logos) — nonce-per-style no vale la
    // pena para esto, y no es el vector de XSS que importa acá.
    "style-src 'self' 'unsafe-inline'",
    // blob: para el preview local de fotos en el admin antes de subirlas
    // (PhotoPicker usa URL.createObjectURL) — sin esto el navegador las
    // bloqueaba en silencio y sólo se veía el botón de borrar sobre un
    // cuadro vacío, nunca la miniatura.
    `img-src 'self' data: blob: ${R2_HOST}`,
    "font-src 'self'",
    `connect-src 'self'${isDev ? " ws:" : ""}`,
    // Embed de Google Maps en /contacto — ver ese archivo.
    "frame-src https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  if (isAdminRoute) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const { env } = await getCloudflareContext({ async: true });
    const session = token ? await verifyToken(token, env.AUTH_SECRET) : null;
    const isLoggedIn = !!session;

    if (!isLoginPage && !isLoggedIn) {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/admin/login", request.nextUrl.origin)),
        request,
        csp,
      );
    }

    if (isLoginPage && isLoggedIn) {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/admin", request.nextUrl.origin)),
        request,
        csp,
      );
    }
  }

  // Next.js arma sus propios <script> internos (el payload de streaming de
  // RSC que hidrata la página) leyendo el nonce de la cabecera
  // Content-Security-Policy del REQUEST entrante, no de la respuesta — así
  // que hay que ponérsela acá también, exactamente igual a la de la
  // respuesta. Sin esto, esos scripts internos salían sin nonce y el propio
  // navegador los bloqueaba: la hidratación nunca corría, así que todo lo
  // que depende de JS para mostrarse (los `<Reveal>` de Motion, que arrancan
  // en opacity:0 hasta que su script hidrata) quedaba invisible.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  // El layout raíz necesita saber si está sirviendo /admin para fijar
  // `<html lang="es">` ahí: el panel es interno y siempre está en español,
  // pero la cookie de idioma la comparte con el sitio público, así que un
  // visitante que dejó el sitio en inglés hacía que el admin se anunciara
  // como `lang="en"` con todo el texto en español. En App Router un Server
  // Component no puede leer el pathname por su cuenta — tiene que llegar
  // por header desde acá.
  requestHeaders.set("x-pathname", pathname);

  return withSecurityHeaders(
    NextResponse.next({ request: { headers: requestHeaders } }),
    request,
    csp,
  );
}

function withSecurityHeaders(
  response: NextResponse,
  request: NextRequest,
  csp: string,
): NextResponse {
  response.headers.set("Content-Security-Policy", csp);
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
