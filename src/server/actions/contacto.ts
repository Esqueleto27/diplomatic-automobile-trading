"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contactoSchema } from "@/lib/validations/contacto";

export type ContactoActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      ok?: boolean;
    }
  | undefined;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No autorizado");
  }
}

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

  await prisma.contactMessage.create({ data: parsed.data });

  revalidatePath("/admin/mensajes");
  return { ok: true };
}

export async function marcarMensajeLeido(id: string, leido: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { leido } });
  revalidatePath("/admin/mensajes");
}

export async function eliminarMensaje(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/mensajes");
}
