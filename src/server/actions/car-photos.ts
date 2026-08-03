"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { and, asc, count, eq } from "drizzle-orm";
import { requireSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { carPhotos } from "@/db/schema";
import { getPhotosBucket, getPhotosPublicUrl } from "@/lib/r2";

const MAX_FOTOS_POR_AUTO = 5;
const TIPOS_PERMITIDOS = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

function extensionDe(mimeType: string): string {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

export type SubirFotosState = { error?: string } | undefined;

export async function subirFotos(
  carId: string,
  _prevState: SubirFotosState,
  formData: FormData,
): Promise<SubirFotosState> {
  await requireSession();

  const archivos = formData
    .getAll("fotos")
    .filter((valor): valor is File => valor instanceof File && valor.size > 0);

  if (archivos.length === 0) {
    return { error: "Seleccioná al menos una foto." };
  }

  const db = await getDb();
  const [{ total: actuales }] = await db
    .select({ total: count() })
    .from(carPhotos)
    .where(eq(carPhotos.carId, carId));

  if (actuales + archivos.length > MAX_FOTOS_POR_AUTO) {
    return {
      error: `Máximo ${MAX_FOTOS_POR_AUTO} fotos por auto (ya hay ${actuales}).`,
    };
  }

  for (const archivo of archivos) {
    if (!TIPOS_PERMITIDOS.has(archivo.type)) {
      return { error: `Formato no soportado: ${archivo.type || archivo.name}` };
    }
    if (archivo.size > MAX_BYTES) {
      return { error: `"${archivo.name}" pesa más de 8 MB.` };
    }
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

  revalidatePath(`/admin/autos/${carId}`);
  return undefined;
}

export async function eliminarFoto(carId: string, photoId: string) {
  await requireSession();

  const db = await getDb();
  const foto = await db.query.carPhotos.findFirst({
    where: eq(carPhotos.id, photoId),
  });
  if (!foto || foto.carId !== carId) return;

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

  revalidatePath(`/admin/autos/${carId}`);
}

export async function marcarPortada(carId: string, photoId: string) {
  await requireSession();

  const db = await getDb();
  await db.batch([
    db.update(carPhotos).set({ portada: false }).where(eq(carPhotos.carId, carId)),
    db
      .update(carPhotos)
      .set({ portada: true })
      .where(and(eq(carPhotos.id, photoId), eq(carPhotos.carId, carId))),
  ]);

  revalidatePath(`/admin/autos/${carId}`);
}
