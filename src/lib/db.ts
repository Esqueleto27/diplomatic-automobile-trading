import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "@/db/schema";

// El binding D1 (env.DB) sólo existe dentro del contexto de request de
// Workers, no como variable de entorno estática — por eso no es un
// singleton de módulo, se resuelve por request. A diferencia del cliente de
// Prisma, envolver env.DB con drizzle() es liviano (no arranca un motor
// aparte), así que no hace falta cachear la instancia.
export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}
