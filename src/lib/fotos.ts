// Reglas de fotos de auto, compartidas entre cliente (PhotoPicker,
// CarPhotos) y servidor (car-photos.ts) — antes vivían triplicadas con
// nombres distintos (MAX_FOTOS vs MAX_FOTOS_POR_AUTO) y ya se habían
// desincronizado una vez (el cambio de 5 a 10 fotos no llegó a todos los
// lugares). Server y Client Components pueden importar este archivo por
// igual: son sólo constantes, sin nada que dependa de bindings de Workers.
export const MAX_FOTOS_POR_AUTO = 10;
export const MAX_BYTES_POR_FOTO = 8 * 1024 * 1024; // 8 MB
export const TIPOS_PERMITIDOS = new Set(["image/jpeg", "image/png", "image/webp"]);
export const ACCEPT_FOTOS = "image/jpeg,image/png,image/webp";

export function extensionDe(mimeType: string): string {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}
