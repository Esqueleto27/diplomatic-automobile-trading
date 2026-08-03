"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { requireSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { cars } from "@/db/schema";
import { carSchema } from "@/lib/validations/car";
import { slugify } from "@/lib/slug";
import { uploadFotos } from "@/server/actions/car-photos";

export type CarActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

function parseCarForm(formData: FormData) {
  return carSchema.safeParse({
    nombre: formData.get("nombre"),
    marca: formData.get("marca"),
    anio: formData.get("anio"),
    precio: formData.get("precio"),
    kilometraje: formData.get("kilometraje"),
    transmision: formData.get("transmision"),
    combustible: formData.get("combustible"),
    color: formData.get("color"),
    descripcion: formData.get("descripcion"),
    tipo: formData.get("tipo"),
    destacado: formData.get("destacado") === "on",
    activo: formData.get("activo") === "on",
  });
}

export async function createCar(
  _prevState: CarActionState,
  formData: FormData,
): Promise<CarActionState> {
  await requireSession();

  const parsed = parseCarForm(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const slug = `${slugify(parsed.data.nombre)}-${Math.random().toString(36).slice(2, 8)}`;

  const db = await getDb();
  const id = randomUUID();
  await db.insert(cars).values({ id, ...parsed.data, slug });

  const fotos = formData
    .getAll("fotos")
    .filter((valor): valor is File => valor instanceof File && valor.size > 0);
  const errorFotos = await uploadFotos(id, fotos);
  if (errorFotos) {
    return { message: `El auto se creó pero falló la subida de fotos: ${errorFotos}` };
  }

  revalidatePath("/admin/autos");
  redirect(`/admin/autos/${id}`);
}

export async function updateCar(
  id: string,
  _prevState: CarActionState,
  formData: FormData,
): Promise<CarActionState> {
  await requireSession();

  const parsed = parseCarForm(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const db = await getDb();
  await db
    .update(cars)
    .set({ ...parsed.data, updatedAt: new Date().toISOString() })
    .where(eq(cars.id, id));

  revalidatePath("/admin/autos");
  redirect("/admin/autos");
}

export async function deleteCar(id: string) {
  await requireSession();
  const db = await getDb();
  await db.delete(cars).where(eq(cars.id, id));
  revalidatePath("/admin/autos");
}
