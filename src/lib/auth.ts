import { SignJWT, jwtVerify } from "jose";

// Primitivas puras de JWT — sin Next.js, sin DB, 100% edge-safe (jose usa
// Web Crypto, no APIs de Node). src/middleware.ts corre en Edge Runtime y
// las importa directo, por eso este archivo NO puede traer bcryptjs (usa
// `crypto`/`setImmediate` de Node) — ver src/lib/password.ts para eso.

const encoder = new TextEncoder();

export const SESSION_COOKIE_NAME = "session";

export type SessionPayload = {
  userId: string;
  email: string;
};

export async function createToken(
  payload: SessionPayload,
  secret: string,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoder.encode(secret));
}

export async function verifyToken(
  token: string,
  secret: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}
