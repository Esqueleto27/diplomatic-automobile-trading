/**
 * Serializa datos estructurados (Schema.org) para inyectar en un
 * `<script type="application/ld+json">` vía `dangerouslySetInnerHTML`.
 *
 * `JSON.stringify` por sí solo NO escapa `<`, así que un valor que
 * contenga literalmente `</script>` cerraría la etiqueta antes de tiempo e
 * inyectaría HTML/JS arbitrario en la página. Acá los datos combinan campos
 * fijos con texto libre que carga el admin (nombre del auto, marca, color —
 * ver vehiculoSchema en autos/[slug]/page.tsx): sin este escape, una cuenta
 * de admin comprometida (o un typo con esa secuencia exacta) podría inyectar
 * script. `<` es la forma estándar de neutralizarlo sin romper el JSON
 * ni cambiar el dato una vez parseado.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
