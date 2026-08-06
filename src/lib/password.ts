import bcrypt from "bcryptjs";

// Separado de src/lib/auth.ts a propósito: bcryptjs usa `crypto`/`setImmediate`
// de Node, incompatibles con Edge Runtime. Este archivo sólo lo importa
// src/server/actions/auth.ts (Server Action, runtime Node) — nunca
// src/middleware.ts, que sólo necesita verificar el JWT.
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
