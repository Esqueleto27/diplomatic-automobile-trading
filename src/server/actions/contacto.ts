"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/db/schema";
import { contactoSchema } from "@/lib/validations/contacto";
import { errorAdmin, errorPublico } from "@/lib/action-error";
import { dentroDelLimite, getRateLimiter } from "@/lib/rate-limit";

// El mensaje viene de un formulario público sin sesión — no confiar en su
// contenido al armar el HTML del correo (evita que alguien rompa el formato
// o meta un link disfrazado de texto plano con `<a href=...>`).
function escapeHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Layout con tablas y estilos inline a propósito, no CSS moderno (flexbox,
// grid, <style> embebido): es lo único que renderiza de forma consistente
// entre clientes de correo (Gmail, Outlook, etc. ignoran o rompen el resto).
function plantillaCorreoContacto(datos: {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}): string {
  const mensajeHtml = escapeHtml(datos.mensaje).replace(/\n/g, "<br>");
  const fila = (etiqueta: string, valor: string) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #ececec;color:#8a8a8a;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;width:110px;vertical-align:top;">${etiqueta}</td>
      <td style="padding:10px 0;border-bottom:1px solid #ececec;color:#1a1a1a;font-size:15px;vertical-align:top;">${valor}</td>
    </tr>`;

  return `
    <div style="background-color:#f4f4f2;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
      <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5;">
        <tr>
          <td style="background-color:#111111;padding:24px 28px;">
            <span style="color:#c7a354;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;">Diplomatic Automobile Trading</span>
            <h1 style="color:#ffffff;font-size:20px;font-weight:400;margin:6px 0 0;">Nuevo mensaje de contacto</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 28px 8px;">
            <table role="presentation" width="100%" style="border-collapse:collapse;">
              ${fila("Nombre", escapeHtml(datos.nombre))}
              ${fila("Email", `<a href="mailto:${escapeHtml(datos.email)}" style="color:#111111;">${escapeHtml(datos.email)}</a>`)}
              ${fila("Asunto", escapeHtml(datos.asunto))}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 28px 28px;">
            <p style="color:#8a8a8a;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;margin:16px 0 8px;">Mensaje</p>
            <p style="color:#1a1a1a;font-size:15px;line-height:1.6;margin:0;white-space:pre-line;">${mensajeHtml}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 28px;background-color:#fafafa;border-top:1px solid #ececec;">
            <p style="color:#a0a0a0;font-size:12px;margin:0;">Enviado desde el formulario de contacto de diplomatic-trading.com — respondé este correo para contestarle directo.</p>
          </td>
        </tr>
      </table>
    </div>`;
}

// Notificación por correo del nuevo mensaje — best-effort: si falla el envío
// no debe tumbar el guardado (que ya ocurrió) ni la respuesta al usuario. El
// mensaje sigue quedando disponible en /admin/mensajes de todas formas.
// Recibe `env` en vez de llamar a getCloudflareContext() de nuevo acá (ya se
// resolvió una vez en el caller, que también necesita `ctx.waitUntil`).
async function notificarNuevoMensaje(
  env: CloudflareEnv,
  datos: { nombre: string; email: string; asunto: string; mensaje: string },
) {
  try {
    await env.EMAIL.send({
      from: { email: "contacto@diplomatic-trading.com", name: "Diplomatic Automobile Trading" },
      to: "diplomatic.trading@hotmail.com",
      replyTo: datos.email,
      subject: `Nuevo mensaje de contacto: ${datos.asunto}`,
      html: plantillaCorreoContacto(datos),
      text: `Nuevo mensaje de contacto\n\nNombre: ${datos.nombre}\nEmail: ${datos.email}\nAsunto: ${datos.asunto}\n\n${datos.mensaje}`,
    });
  } catch (error) {
    console.error("No se pudo enviar la notificación de contacto por correo:", error);
  }
}

export type ContactoActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      ok?: boolean;
    }
  | undefined;

export async function enviarMensajeContacto(
  _prevState: ContactoActionState,
  formData: FormData,
): Promise<ContactoActionState> {
  // Honeypot: campo invisible para personas, que los bots de spam sí
  // completan. Si llega con valor, fingimos éxito y no guardamos nada.
  if (formData.get("empresa_web")) {
    return { ok: true };
  }

  const t = await getTranslations("contactForm.errores");

  // Endpoint público sin sesión — el honeypot de arriba frena bots torpes,
  // no uno que hable el protocolo de Server Actions directo. 3 envíos por
  // minuto por IP alcanza de sobra para una persona real y evita que se
  // llene la tabla ContactMessage (y la bandeja del panel) a fuerza bruta.
  const limiter = await getRateLimiter("RATE_LIMITER_CONTACTO");
  if (!(await dentroDelLimite(limiter))) {
    return { message: t("rateLimit") };
  }

  const parsed = contactoSchema({
    nombre: t("nombre"),
    email: t("email"),
    asunto: t("asunto"),
    mensaje: t("mensaje"),
    consentimiento: t("consentimiento"),
  }).safeParse({
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    asunto: formData.get("asunto"),
    mensaje: formData.get("mensaje"),
    consentimiento: formData.get("consentimiento"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  // `consentimiento` sólo existe para validar el checkbox — ContactMessage
  // no tiene esa columna, así que se arma el objeto a insertar a mano en vez
  // de spreadear parsed.data entero (si no, Drizzle ni compila: .values()
  // está tipado contra el schema real).
  const { nombre, email, asunto, mensaje } = parsed.data;
  const datosContacto = { nombre, email, asunto, mensaje };

  try {
    const db = await getDb();
    await db.insert(contactMessages).values({ id: randomUUID(), ...datosContacto });
  } catch (error) {
    return { message: errorPublico(error, "enviarMensajeContacto") };
  }

  // ctx.waitUntil, no un await ni un fire-and-forget a secas: en Workers,
  // una promesa sin await puede cortarse a mitad de camino en cuanto se
  // manda la respuesta. waitUntil le garantiza tiempo de CPU para terminar
  // en segundo plano sin que el visitante tenga que esperar el envío del
  // correo — el mensaje ya quedó guardado en la DB, que es lo que importa.
  const { env, ctx } = await getCloudflareContext({ async: true });
  ctx.waitUntil(notificarNuevoMensaje(env, datosContacto));

  revalidatePath("/admin/mensajes");
  return { ok: true };
}

export async function marcarMensajeLeido(
  id: string,
  leido: boolean,
): Promise<string | null> {
  await requireSession();
  try {
    const db = await getDb();
    await db.update(contactMessages).set({ leido }).where(eq(contactMessages.id, id));
  } catch (error) {
    return errorAdmin(error, "marcarMensajeLeido");
  }
  revalidatePath("/admin/mensajes");
  return null;
}

export async function eliminarMensaje(id: string): Promise<string | null> {
  await requireSession();
  try {
    const db = await getDb();
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  } catch (error) {
    return errorAdmin(error, "eliminarMensaje");
  }
  revalidatePath("/admin/mensajes");
  return null;
}
