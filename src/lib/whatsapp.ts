import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Igual que getDb()/getPhotosBucket(): los bindings/vars de Workers sólo
 * existen en el contexto de request, no como process.env estático. */
export async function getWhatsappNumber(): Promise<string> {
  const { env } = await getCloudflareContext({ async: true });
  return env.WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";
}

/**
 * Link de contacto por WhatsApp con mensaje prellenado.
 * Si todavía no se configuró WHATSAPP_NUMBER, cae a la página de contacto
 * en vez de generar un enlace roto a wa.me.
 */
export function buildWhatsappHref(numero: string, mensaje: string): string {
  if (!numero) return "/contacto";
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/** Conveniencia para el caso de un solo link por página/componente. */
export async function whatsappHref(mensaje: string): Promise<string> {
  const numero = await getWhatsappNumber();
  return buildWhatsappHref(numero, mensaje);
}

export function mensajeTestDrive(nombreAuto: string): string {
  return `Hola, me interesa agendar un test drive del ${nombreAuto}.`;
}

export function mensajeConsultaServicio(servicio: string): string {
  return `Hola, quisiera información sobre el servicio de ${servicio}.`;
}
