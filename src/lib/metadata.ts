import type { Metadata } from "next";
import { heroImageUrl, siteUrl } from "@/lib/site";

/**
 * `openGraph`/`twitter` completos para una página interna — no alcanza con
 * pasar sólo `url`, porque Next.js no mergea `openGraph` en profundidad con
 * el del layout raíz: si una página define `openGraph`, reemplaza el objeto
 * entero (pierde `siteName`, `images`, `type`, `locale` heredados). Por eso
 * cada página que llama a esto repite esos campos en vez de heredarlos.
 *
 * Antes de este helper, todas las páginas heredaban el `openGraph.url` fijo
 * del layout raíz (`siteUrl`) sin overridearlo — WhatsApp/redes mostraban
 * siempre el link de la home al compartir cualquier página interna.
 */
export function metadataPagina(opciones: {
  ruta: string;
  titulo: string;
  descripcion: string;
  ogLocale: string;
}): Metadata {
  const urlAbsoluta = `${siteUrl}${opciones.ruta}`;
  return {
    title: opciones.titulo,
    description: opciones.descripcion,
    alternates: { canonical: opciones.ruta },
    openGraph: {
      type: "website",
      locale: opciones.ogLocale,
      url: urlAbsoluta,
      siteName: "Diplomatic Automobile Trading",
      title: opciones.titulo,
      description: opciones.descripcion,
      images: [{ url: heroImageUrl, width: 1600, height: 900 }],
    },
    twitter: {
      card: "summary_large_image",
      title: opciones.titulo,
      description: opciones.descripcion,
      images: [heroImageUrl],
    },
  };
}
