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
    <section className="py-32 sm:py-40" aria-labelledby="servicios">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading>
          <span id="servicios">Servicios Adicionales</span>
        </SectionHeading>

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
