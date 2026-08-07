import type { Metadata } from "next";
import { getAutosPorTipo } from "@/lib/cars";
import { Hero } from "@/components/site/hero";
import { BrandStrip } from "@/components/site/brand-strip";
import { StatsBand } from "@/components/site/stats-band";
import { OficinaTrust } from "@/components/site/oficina-trust";
import { VehiculosUsados } from "@/components/site/vehiculos-usados";
import { ServiciosAdicionales } from "@/components/site/servicios-adicionales";
import { ContactCta } from "@/components/site/contact-cta";

// Lee inventario en vivo: no se prerenderiza en build (ahí no hay base de datos)
// y el admin ve sus cambios publicados de inmediato.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * El inventario es sólo una parte de la portada. Si la base de datos no
 * responde, se sigue sirviendo el resto (hero, marcas, servicios) en vez de
 * tumbar la página entera con un 500: el error queda en los logs del servidor
 * para que se note, pero el visitante todavía puede contactar al negocio.
 */
async function autosOVacio(
  ...args: Parameters<typeof getAutosPorTipo>
): Promise<Awaited<ReturnType<typeof getAutosPorTipo>>> {
  try {
    return await getAutosPorTipo(...args);
  } catch (error) {
    console.error("No se pudo leer el inventario para la portada:", error);
    return [];
  }
}

export default async function HomePage() {
  // El inventario es sólo de vehículos usados/diplomáticos: los nuevos se
  // consiguen por importación o compra local, es un servicio (ver
  // lineasNegocio en src/lib/site.ts, usado hoy sólo en /empresa), no algo
  // que se liste con fotos. Por eso no hay consulta a tipo "NUEVO".
  const usados = await autosOVacio(["USADO", "DIPLOMATICO"], 10);

  // Las secciones son bloques independientes: cambiar el orden de la página
  // es mover una línea, y una sección sin inventario simplemente no se monta.
  return (
    <>
      <Hero />
      <BrandStrip />
      <StatsBand />
      <OficinaTrust />
      {usados.length > 0 && <VehiculosUsados autos={usados} />}
      <ServiciosAdicionales />
      <ContactCta />
    </>
  );
}
