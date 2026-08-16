import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getTranslations } from "next-intl/server";

/** Igual que getDb()/getPhotosBucket(): los bindings/vars de Workers sólo
 * existen en el contexto de request, no como process.env estático. */
export async function getWhatsappNumber(): Promise<string> {
  const { env } = await getCloudflareContext({ async: true });
  return env.WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";
}

/**
 * Los seguros (vehículos, viajes y salud) los atiende otra línea del
 * negocio, no la misma que la compra/importación de vehículos.
 *
 * Cae a getWhatsappNumber() si la var no está definida: es preferible que
 * una consulta de seguros llegue al número principal a que el botón caiga
 * a /contacto por un valor faltante en un entorno mal configurado.
 */
export async function getWhatsappNumberSeguros(): Promise<string> {
  const { env } = await getCloudflareContext({ async: true });
  const numero = env.WHATSAPP_NUMBER_SEGUROS?.replace(/\D/g, "");
  return numero || getWhatsappNumber();
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

export async function mensajeTestDrive(nombreAuto: string): Promise<string> {
  const t = await getTranslations("whatsapp");
  return t("testDrive", { auto: nombreAuto });
}

// Sin equivalente "mensajeConsultaServicio": el único caller (servicios/page.tsx)
// ya recorre servicios dentro de un .map() no-async — ahí es más simple leer
// la traducción "whatsapp.consultaServicio" directo con getTranslations que
// envolver el map en Promise.all sólo para poder hacer await acá.
