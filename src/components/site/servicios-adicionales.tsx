import { useTranslations } from "next-intl";
import { servicios } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { ServiceCard } from "@/components/site/service-card";
import { SiteButton } from "@/components/site/button";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

// La home muestra una grilla completa de 3x2, no los 7 servicios: con 7 en
// tres columnas la última fila queda con una card sola y dos huecos, que se
// lee como si faltara algo. Esta sección es de descubrimiento — el listado
// completo, con la descripción larga de cada uno, vive en /servicios, a un
// clic del botón de abajo.
const DESTACADOS = 6;

// En móvil, esas 6 cards apiladas son ~1.600px de scroll de una sola
// sección: se muestran 4 y el botón de abajo lleva al listado completo, que
// es donde de verdad se comparan los servicios. Desde `sm:` la grilla es de
// 2 o 3 columnas y las 6 vuelven a entrar sin alargar la página.
const DESTACADOS_EN_MOVIL = 4;

export function ServiciosAdicionales() {
  const t = useTranslations("servicios");

  return (
    <section className="section-py" aria-labelledby="servicios">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading>
          <span id="servicios">{t("tituloSeccion")}</span>
        </SectionHeading>

        {/* Grid parejo 3×2, sin asimetría: se probó una card grande
            (col-span-2) para destacar el core del negocio y generaba más
            problemas que los que resolvía — huecos en el grid al no fijar
            también las filas, y una card desproporcionada. La jerarquía
            (Importación de Vehículos y Cupo Diplomático primero) ya la da
            el orden del array `servicios` en site.ts, no hace falta
            duplicarla con el tamaño. */}
        <ul className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {servicios.slice(0, DESTACADOS).map((servicio, i) => (
            <li
              key={servicio.slug}
              className={cn(i >= DESTACADOS_EN_MOVIL && "hidden sm:block")}
            >
              <Reveal delay={(i % 3) * 0.1}>
                <ServiceCard servicio={servicio} />
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center sm:mt-12">
          <SiteButton href="/servicios" size="lg" variant="outline">
            {t("ctaVerTodos")}
          </SiteButton>
        </div>
      </div>
    </section>
  );
}
