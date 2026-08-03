const NUMERO = process.env.WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";

/**
 * Link de contacto por WhatsApp con mensaje prellenado.
 * Si todavía no se configuró WHATSAPP_NUMBER, cae a la página de contacto
 * en vez de generar un enlace roto a wa.me.
 */
export function whatsappHref(mensaje: string): string {
  if (!NUMERO) return "/contacto";
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

export function mensajeTestDrive(nombreAuto: string): string {
  return `Hola, me interesa agendar un test drive del ${nombreAuto}.`;
}

export function mensajeConsultaServicio(servicio: string): string {
  return `Hola, quisiera información sobre el servicio de ${servicio}.`;
}
