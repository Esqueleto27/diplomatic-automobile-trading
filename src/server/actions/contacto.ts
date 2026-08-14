"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { requireSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/db/schema";
import { contactoSchema } from "@/lib/validations/contacto";
import { errorAdmin, errorPublico } from "@/lib/action-error";
import { dentroDelLimite, getRateLimiter } from "@/lib/rate-limit";

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
  }).safeParse({
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    asunto: formData.get("asunto"),
    mensaje: formData.get("mensaje"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const db = await getDb();
    await db.insert(contactMessages).values({ id: randomUUID(), ...parsed.data });
  } catch (error) {
    return { message: errorPublico(error, "enviarMensajeContacto") };
  }

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
