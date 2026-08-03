import "server-only";
import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  SESSION_COOKIE_NAME,
  createToken,
  verifyToken,
  type SessionPayload,
} from "@/lib/auth";

// Wrapper Next.js sobre las primitivas edge-safe de src/lib/auth.ts: usa
// cookies() (Server Components/Actions, runtime Node) y AUTH_SECRET vía
// binding de Workers (no process.env — no existe así en Workers).
async function getAuthSecret(): Promise<string> {
  const { env } = await getCloudflareContext({ async: true });
  const secret = env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET no está configurado.");
  }
  return secret;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = await getAuthSecret();
  return verifyToken(token, secret);
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const secret = await getAuthSecret();
  const token = await createToken(payload, secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Usar en Server Actions / Server Components del admin: lanza si no hay sesión válida. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  return session;
}
