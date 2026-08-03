"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { carSchema } from "@/lib/validations/car";
import { slugify } from "@/lib/slug";

export type CarActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No autorizado");
  }
}

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
  await requireAdmin();

  const parsed = parseCarForm(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const slug = `${slugify(parsed.data.nombre)}-${Math.random().toString(36).slice(2, 8)}`;

  await prisma.car.create({
    data: { ...parsed.data, slug },
  });

  revalidatePath("/admin/autos");
  redirect("/admin/autos");
}

export async function updateCar(
  id: string,
  _prevState: CarActionState,
  formData: FormData,
): Promise<CarActionState> {
  await requireAdmin();

  const parsed = parseCarForm(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.car.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/autos");
  redirect("/admin/autos");
}

export async function deleteCar(id: string) {
  await requireAdmin();
  await prisma.car.delete({ where: { id } });
  revalidatePath("/admin/autos");
}
