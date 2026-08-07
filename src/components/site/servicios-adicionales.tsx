import { servicios } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { ServiceCard } from "@/components/site/service-card";
import { SiteButton } from "@/components/site/button";
import { Reveal } from "@/components/site/reveal";

// La home muestra una grilla completa de 3x2, no los 7 servicios: con 7 en
// tres columnas la última fila queda con una card sola y dos huecos, que se
// lee como si faltara algo. Esta sección es de descubrimiento — el listado
// completo, con la descripción larga de cada uno, vive en /servicios, a un
// clic del botón de abajo.
const DESTACADOS = 6;

export function ServiciosAdicionales() {
  return (
    <section className="section-py" aria-labelledby="servicios">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading>
          <span id="servicios">Nuestros Servicios</span>
        </SectionHeading>

        {/* Grid parejo 3×2, sin asimetría: se probó una card grande
            (col-span-2) para destacar el core del negocio y generaba más
            problemas que los que resolvía — huecos en el grid al no fijar
            también las filas, y una card desproporcionada. La jerarquía
            (Importación de Vehículos y Cupo Diplomático primero) ya la da
            el orden del array `servicios` en site.ts, no hace falta
            duplicarla con el tamaño. */}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.slice(0, DESTACADOS).map((servicio, i) => (
            <li key={servicio.slug}>
              <Reveal delay={(i % 3) * 0.1}>
                <ServiceCard servicio={servicio} />
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <SiteButton href="/servicios" size="lg" variant="outline">
            Ver todos los servicios
          </SiteButton>
        </div>
      </div>
    </section>
  );
}
