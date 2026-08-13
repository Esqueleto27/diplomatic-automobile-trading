/**
 * Manejo uniforme de fallas inesperadas en Server Actions (D1 caída, R2
 * caído, timeout de red, etc.) — separado de los errores de validación
 * (Zod), que ya tienen su propio mensaje específico y no pasan por acá.
 *
 * Devuelve un código corto (timestamp en base36 + 3 caracteres random, para
 * que dos fallas en el mismo milisegundo no compartan código) y loguea el
 * error real con `console.error` — visible en los logs de Cloudflare
 * (`wrangler tail` / dashboard de Workers) — sin exponer nunca el mensaje ni
 * el stack trace original en la UI: podrían filtrar detalles internos
 * (nombres de tabla, rutas, etc.) a quien esté mirando la pantalla.
 */
function codigoError(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const azar = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${timestamp}-${azar}`;
}

/** Para pantallas del panel admin: quien lo ve es el mismo administrador, así
 * que el mensaje lo invita a escalarlo (a nosotros/soporte) con el código. */
export function errorAdmin(error: unknown, contexto: string): string {
  const codigo = codigoError();
  console.error(`[${codigo}] ${contexto}:`, error);
  return `Ocurrió un error inesperado (código ${codigo}). Contacta a soporte si vuelve a pasar.`;
}

/** Para pantallas públicas del sitio (ej. formulario de contacto): quien lo
 * ve es un visitante, no tiene sentido pedirle que "contacte al admin" —
 * pero el código sigue siendo útil si después llama o escribe reportando el
 * problema. */
export function errorPublico(error: unknown, contexto: string): string {
  const codigo = codigoError();
  console.error(`[${codigo}] ${contexto}:`, error);
  return `No pudimos procesar la solicitud (código ${codigo}). Inténtelo de nuevo en un momento.`;
}
