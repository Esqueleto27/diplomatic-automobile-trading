"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { asc, count, eq } from "drizzle-orm";
import { requireSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { carPhotos } from "@/db/schema";
import { getPhotosBucket, getPhotosPublicUrl } from "@/lib/r2";
import { errorAdmin } from "@/lib/action-error";
import {
  MAX_BYTES_POR_FOTO,
  MAX_FOTOS_POR_AUTO,
  TIPOS_PERMITIDOS,
  extensionDe,
} from "@/lib/fotos";

/** El navegador reporta File.type a partir de la extensión/metadata, no del
 * contenido real — no alcanza como única defensa. Se verifican los magic
 * bytes de cada formato permitido antes de aceptar el archivo. */
async function tieneFirmaValida(archivo: File): Promise<boolean> {
  const header = new Uint8Array(await archivo.slice(0, 12).arrayBuffer());

  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return true; // JPEG
  }
  if (
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47 &&
    header[4] === 0x0d &&
    header[5] === 0x0a &&
    header[6] === 0x1a &&
    header[7] === 0x0a
  ) {
    return true; // PNG
  }

  const riff = String.fromCharCode(...header.slice(0, 4));
  const webp = String.fromCharCode(...header.slice(8, 12));
  return riff === "RIFF" && webp === "WEBP";
}

export type SubirFotosState = { error?: string } | undefined;

function extraerArchivos(formData: FormData): File[] {
  return formData
    .getAll("fotos")
    .filter((valor): valor is File => valor instanceof File && valor.size > 0);
}

export async function uploadFotos(
  carId: string,
  archivos: File[],
): Promise<string | null> {
  await requireSession();

  if (archivos.length === 0) {
    return null;
  }

  for (const archivo of archivos) {
    if (!TIPOS_PERMITIDOS.has(archivo.type)) {
      return `Formato no soportado: ${archivo.type || archivo.name}`;
    }
    if (archivo.size > MAX_BYTES_POR_FOTO) {
      return `"${archivo.name}" pesa más de 8 MB.`;
    }
    if (!(await tieneFirmaValida(archivo))) {
      return `"${archivo.name}" no es una imagen válida.`;
    }
  }

  try {
    const db = await getDb();
    const [{ total: actuales }] = await db
      .select({ total: count() })
      .from(carPhotos)
      .where(eq(carPhotos.carId, carId));

    if (actuales + archivos.length > MAX_FOTOS_POR_AUTO) {
      return `Máximo ${MAX_FOTOS_POR_AUTO} fotos por auto (ya hay ${actuales}).`;
    }

    const bucket = await getPhotosBucket();
    const publicUrl = await getPhotosPublicUrl();

    for (const [i, archivo] of archivos.entries()) {
      const key = `autos/${carId}/${randomUUID()}.${extensionDe(archivo.type)}`;

      // R2 rechaza file.stream() con "Provided readable stream must have a
      // known length" — arrayBuffer() sí funciona, tanto local como en prod.
      await bucket.put(key, await archivo.arrayBuffer(), {
        httpMetadata: { contentType: archivo.type },
      });

      await db.insert(carPhotos).values({
        id: randomUUID(),
        carId,
        key,
        url: `${publicUrl}/${key}`,
        orden: actuales + i,
        portada: actuales === 0 && i === 0,
      });
    }
  } catch (error) {
    return errorAdmin(error, "uploadFotos");
  }

  return null;
}

export async function subirFotos(
  carId: string,
  _prevState: SubirFotosState,
  formData: FormData,
): Promise<SubirFotosState> {
  await requireSession();

  const archivos = extraerArchivos(formData);
  if (archivos.length === 0) {
    return { error: "Selecciona al menos una foto." };
  }

  const error = await uploadFotos(carId, archivos);
  if (error) return { error };

  revalidatePath(`/admin/autos/${carId}`);
  return undefined;
}

export async function eliminarFoto(
  carId: string,
  photoId: string,
): Promise<string | null> {
  await requireSession();

  try {
    const db = await getDb();
    const foto = await db.query.carPhotos.findFirst({
      where: eq(carPhotos.id, photoId),
    });
    if (!foto || foto.carId !== carId) return null;

    const bucket = await getPhotosBucket();
    await bucket.delete(foto.key);
    await db.delete(carPhotos).where(eq(carPhotos.id, photoId));

    // Si la borrada era portada, promover la siguiente en orden.
    if (foto.portada) {
      const siguiente = await db.query.carPhotos.findFirst({
        where: eq(carPhotos.carId, carId),
        orderBy: asc(carPhotos.orden),
      });
      if (siguiente) {
        await db
          .update(carPhotos)
          .set({ portada: true })
          .where(eq(carPhotos.id, siguiente.id));
      }
    }
  } catch (error) {
    return errorAdmin(error, "eliminarFoto");
  }

  revalidatePath(`/admin/autos/${carId}`);
  return null;
}

/** Borra las fotos de un auto, en R2 y en D1. Usado antes de borrar el auto
 * en sí (deleteCar) — pero también es un endpoint público como cualquier
 * función exportada de un archivo "use server", así que borra la fila en D1
 * acá mismo en vez de depender de que el caller borre el auto después y
 * dispare el ON DELETE CASCADE: invocada sola, antes dejaba el inventario
 * apuntando a fotos que ya no existían en el bucket. Cuando sí la llama
 * deleteCar, el cascade posterior no tiene nada que hacer — no es un
 * problema borrar dos veces lo que ya no está. */
export async function eliminarFotosDeAuto(carId: string): Promise<void> {
  await requireSession();
  const db = await getDb();
  const fotos = await db.query.carPhotos.findMany({
    where: eq(carPhotos.carId, carId),
  });
  if (fotos.length === 0) return;

  const bucket = await getPhotosBucket();
  await bucket.delete(fotos.map((foto) => foto.key));
  await db.delete(carPhotos).where(eq(carPhotos.carId, carId));
}

export async function marcarPortada(
  carId: string,
  photoId: string,
): Promise<string | null> {
  await requireSession();

  try {
    const db = await getDb();

    // Validar pertenencia ANTES del batch: si photoId no fuera de este
    // carId, el segundo UPDATE del batch afectaría 0 filas y el auto
    // quedaría sin ninguna portada (el primer UPDATE ya puso todas en
    // false), sin error.
    const foto = await db.query.carPhotos.findFirst({
      where: eq(carPhotos.id, photoId),
    });
    if (!foto || foto.carId !== carId) return null;

    await db.batch([
      db.update(carPhotos).set({ portada: false }).where(eq(carPhotos.carId, carId)),
      db.update(carPhotos).set({ portada: true }).where(eq(carPhotos.id, photoId)),
    ]);
  } catch (error) {
    return errorAdmin(error, "marcarPortada");
  }

  revalidatePath(`/admin/autos/${carId}`);
  return null;
}
