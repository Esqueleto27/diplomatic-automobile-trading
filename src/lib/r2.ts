import { getCloudflareContext } from "@opennextjs/cloudflare";

// R2 no tiene carpetas reales — es almacenamiento plano por key. Los
// prefijos de key (ej. "autos/") se muestran como carpetas en el dashboard
// de Cloudflare, pero se crean solos al subir un archivo, no aparte.
// Convención de prefijos para este bucket (PHOTOS_BUCKET), para que
// cualquier función de subida nueva sea consistente con esto:
//   autos/{carId}/{uuid}.ext        → fotos de autos (ya implementado)
//   sitio/logos/{...}                → si el cliente sube su propio logo
//   sitio/general/{...}              → otras imágenes generales del sitio
// Los logos de marcas, el hero y las fotos de servicios NO van acá — viven
// en public/img/ (código, versionado en git), porque son parte del diseño
// del sitio, no contenido que el admin sube/cambia. Ver CLAUDE.md.

/** Igual que getDb(): los bindings de Workers sólo existen en el
 * contexto de request, no como process.env estático. */
export async function getPhotosBucket(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext({ async: true });
  return env.PHOTOS_BUCKET;
}

export async function getPhotosPublicUrl(): Promise<string> {
  const { env } = await getCloudflareContext({ async: true });
  return env.R2_PUBLIC_URL;
}
