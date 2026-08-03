import { getCloudflareContext } from "@opennextjs/cloudflare";

// R2 no tiene carpetas reales — es almacenamiento plano por key. Los
// prefijos de key (ej. "autos/") se muestran como carpetas en el dashboard
// de Cloudflare, pero se crean solos al subir un archivo, no aparte.
// Convención de prefijos para este bucket (PHOTOS_BUCKET):
//   autos/{carId}/{uuid}.ext  → fotos de autos, sube el admin desde el panel
//   sitio/...                 → assets de diseño del sitio (logos, hero,
//                                fondos de servicios) subidos a mano vía
//                                wrangler r2 object put, no desde ningún
//                                formulario del admin. Referenciados desde
//                                src/lib/site.ts (ASSETS_BASE_URL). Si se
//                                reemplaza uno (ej. logo nuevo del cliente),
//                                subir con el mismo nombre/key — no hace
//                                falta tocar código ni redeployar.

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
