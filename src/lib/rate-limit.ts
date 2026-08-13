import "server-only";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Límite de frecuencia por IP para Server Actions públicas o de bajo tráfico
 * de intentos legítimos (login del único admin, formulario de contacto) —
 * ninguna de las dos tenía nada antes: el login era adivinable por fuerza
 * bruta a la velocidad que aguantara el Worker, y el formulario de contacto
 * sólo se defendía de un honeypot (que frena bots torpes, no uno que hable
 * el protocolo de Server Actions directo).
 *
 * Usa el binding nativo de Rate Limiting de Cloudflare (ver "ratelimits" en
 * wrangler.jsonc) — sin KV ni servicio externo, con estado propio por
 * namespace_id. La clave es la IP real del visitante (`cf-connecting-ip`,
 * la que Cloudflare pone — no `x-forwarded-for`, que el cliente podría
 * falsear). En local (`next dev`, sin el header) cae a una clave fija: el
 * límite igual aplica, pero compartido por todas las requests locales, que
 * es aceptable para desarrollo.
 */
export async function dentroDelLimite(limiter: RateLimit): Promise<boolean> {
  const headersList = await headers();
  const ip = headersList.get("cf-connecting-ip") ?? "local-dev";
  const { success } = await limiter.limit({ key: ip });
  return success;
}

export async function getRateLimiter(
  binding: "RATE_LIMITER_LOGIN" | "RATE_LIMITER_CONTACTO",
): Promise<RateLimit> {
  const { env } = await getCloudflareContext({ async: true });
  return env[binding];
}
