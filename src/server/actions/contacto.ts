"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { requireSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/db/schema";
import { contactoSchema } from "@/lib/validations/contacto";

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

  const parsed = contactoSchema.safeParse({
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
    email: formData.get("email"),
    asunto: formData.get("asunto"),
    mensaje: formData.get("mensaje"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const db = await getDb();
  await db.insert(contactMessages).values({ id: randomUUID(), ...parsed.data });

  revalidatePath("/admin/mensajes");
  return { ok: true };
}

export async function marcarMensajeLeido(id: string, leido: boolean) {
  await requireSession();
  const db = await getDb();
  await db.update(contactMessages).set({ leido }).where(eq(contactMessages.id, id));
  revalidatePath("/admin/mensajes");
}

export async function eliminarMensaje(id: string) {
  await requireSession();
  const db = await getDb();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  revalidatePath("/admin/mensajes");
}
