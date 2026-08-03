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
  await db.insert(cars).values({ id: randomUUID(), ...parsed.data, slug });

  revalidatePath("/admin/autos");
  redirect("/admin/autos");
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
