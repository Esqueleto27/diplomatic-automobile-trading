import { z } from "zod";

// Los mensajes de validación se inyectan desde afuera (ver
// enviarMensajeContacto en server/actions/contacto.ts, que llama a esto con
// las traducciones ya resueltas vía getTranslations) en vez de vivir
// hardcodeados en español acá — así el error que ve el visitante sale en su
// idioma sin que este archivo dependa de next-intl directamente.
//
// Límites de tamaño: el endpoint es público y sin sesión (cualquiera puede
// enviar POSTs directos sin pasar por el formulario), así que sin tope
// alguien podría insertar mensajes de varios MB repetidamente en D1.
export function contactoSchema(mensajes: {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  consentimiento: string;
}) {
  return z.object({
    nombre: z.string().trim().min(1, mensajes.nombre).max(150),
    email: z.string().trim().email(mensajes.email).max(254),
    asunto: z.string().trim().min(1, mensajes.asunto).max(200),
    mensaje: z.string().trim().min(1, mensajes.mensaje).max(5000),
    // El checkbox llega como "on" (marcado) o null (sin marcar) en el
    // FormData — nunca se guarda en ContactMessage (esa tabla no tiene esta
    // columna), enviarMensajeContacto lo saca del objeto antes del insert.
    // Igual conviene validarlo acá y no aparte, para que el error salga con
    // el mismo mecanismo de campo que el resto (errors.consentimiento).
    consentimiento: z.preprocess(
      (valor) => valor === "on",
      z.boolean().refine((valor) => valor, mensajes.consentimiento),
    ),
  });
}
