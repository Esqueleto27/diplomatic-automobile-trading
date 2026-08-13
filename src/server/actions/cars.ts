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
import { errorAdmin } from "@/lib/action-error";
import { eliminarFotosDeAuto, uploadFotos } from "@/server/actions/car-photos";

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
    estado: formData.get("estado"),
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
  const id = randomUUID();

  try {
    const db = await getDb();
    await db.insert(cars).values({ id, ...parsed.data, slug });
  } catch (error) {
    return { message: errorAdmin(error, "createCar: insert") };
  }

  const fotos = formData
    .getAll("fotos")
    .filter((valor): valor is File => valor instanceof File && valor.size > 0);
  const errorFotos = await uploadFotos(id, fotos);
  revalidatePath("/admin/autos");

  if (errorFotos) {
    // El auto ya existe en la base — volver a mostrar el formulario de
    // "Nuevo auto" invitaba a pulsar "Crear auto" de nuevo y publicar un
    // segundo auto duplicado. En cambio se va a la ficha del auto recién
    // creado: ahí el admin ve que ya se guardó y puede reintentar sólo las
    // fotos desde CarPhotos.
    redirect(`/admin/autos/${id}?fotosError=1`);
  }

  redirect("/admin/autos?creado=1");
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

  try {
    const db = await getDb();
    await db
      .update(cars)
      .set({ ...parsed.data, updatedAt: new Date().toISOString() })
      .where(eq(cars.id, id));
  } catch (error) {
    return { message: errorAdmin(error, "updateCar") };
  }

  revalidatePath("/admin/autos");
  redirect("/admin/autos?actualizado=1");
}

export type DeleteCarState = { error?: string } | undefined;

export async function deleteCar(id: string): Promise<DeleteCarState> {
  await requireSession();
  try {
    await eliminarFotosDeAuto(id);
    const db = await getDb();
    await db.delete(cars).where(eq(cars.id, id));
  } catch (error) {
    return { error: errorAdmin(error, "deleteCar") };
  }
  revalidatePath("/admin/autos");
  return undefined;
}
