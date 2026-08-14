"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { and, count, eq, ne } from "drizzle-orm";
import { requireSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { cars } from "@/db/schema";
import { carSchema } from "@/lib/validations/car";
import { slugify } from "@/lib/slug";
import { errorAdmin } from "@/lib/action-error";
import { MAX_DESTACADOS } from "@/lib/cars";
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
    // "Vendido" es un checkbox aparte (no un select de estado) — se traduce
    // acá al único valor que la columna `estado` puede tener ahora.
    estado: formData.get("vendido") === "on" ? "VENDIDO" : undefined,
    destacado: formData.get("destacado") === "on",
    activo: formData.get("activo") === "on",
  });
}

/** El home sólo tiene 3 lugares para autos destacados (ver MAX_DESTACADOS en
 * lib/cars.ts) — sin este chequeo, marcar un cuarto simplemente lo dejaba
 * fuera del home sin ningún aviso ("por qué este auto no aparece"). Se
 * valida acá, no sólo con el hint del checkbox en CarForm: un select de
 * Base UI no impide tildar el checkbox, así que el form por sí solo no
 * alcanza como única defensa. `excludeId` deja re-guardar un auto que ya
 * era destacado sin que se cuente a sí mismo contra el tope. */
async function excedeTopeDestacados(excludeId?: string): Promise<boolean> {
  const db = await getDb();
  const [{ total }] = await db
    .select({ total: count() })
    .from(cars)
    .where(
      excludeId
        ? and(eq(cars.destacado, true), ne(cars.id, excludeId))
        : eq(cars.destacado, true),
    );
  return total >= MAX_DESTACADOS;
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

  if (parsed.data.destacado && (await excedeTopeDestacados())) {
    return {
      errors: {
        destacado: [
          `Ya hay ${MAX_DESTACADOS} autos destacados — quite uno antes de agregar otro.`,
        ],
      },
    };
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

  if (parsed.data.destacado && (await excedeTopeDestacados(id))) {
    return {
      errors: {
        destacado: [
          `Ya hay ${MAX_DESTACADOS} autos destacados — quite uno antes de agregar otro.`,
        ],
      },
    };
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
