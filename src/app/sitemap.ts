import type { MetadataRoute } from "next";
import { getAutosVisibles } from "@/lib/cars";
import { siteUrl } from "@/lib/site";

const PAGINAS_ESTATICAS = [
  "",
  "/empresa",
  "/inventario",
  "/servicios",
  "/contacto",
  "/privacidad",
];

// Sin esto, Next prerenderiza /sitemap.xml una sola vez en el build (queda
// "○ Static" en la tabla de rutas) y los autos publicados después nunca
// entran — mismo criterio que el resto de páginas que leen inventario
// (home, /inventario, /autos/[slug]), que ya lo tienen.
export const dynamic = "force-dynamic";

// Igual que la home (ver `autosOVacio` en page.tsx): si la base de datos no
// responde, el sitemap se sigue generando con las páginas estáticas en vez
// de romper por completo.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = PAGINAS_ESTATICAS.map((ruta) => ({
    url: `${siteUrl}${ruta}`,
    lastModified: new Date(),
    // /privacidad es una página de referencia legal, no de conversión — no
    // le compite prioridad de rastreo a las páginas comerciales.
    changeFrequency: ruta === "" ? "weekly" : "monthly",
    priority: ruta === "" ? 1 : ruta === "/privacidad" ? 0.3 : 0.7,
  }));

  try {
    const autos = await getAutosVisibles();
    const autosSitemap: MetadataRoute.Sitemap = autos.map((auto) => ({
      url: `${siteUrl}/autos/${auto.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...estaticas, ...autosSitemap];
  } catch (error) {
    console.error("No se pudo leer el inventario para el sitemap:", error);
    return estaticas;
  }
}
