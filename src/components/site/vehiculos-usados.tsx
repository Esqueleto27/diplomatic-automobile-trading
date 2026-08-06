import type { AutoPublico } from "@/lib/cars";
import { CarCardDetalle } from "@/components/site/car-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { SiteButton } from "@/components/site/button";

export function VehiculosUsados({ autos }: { autos: AutoPublico[] }) {
  // Grilla 2x2 en vez de carrusel horizontal: con tarjetas de este tamaño
  // (foto + specs + precio + dos botones) una fila larga dejaba mucho aire
  // vacío arriba de cada una. Cuatro en cuadrícula se ven completas.
  const destacados = autos.slice(0, 4);

  return (
    <section
      className="border-y border-border bg-surface py-32 sm:py-40"
      aria-labelledby="vehiculos-usados"
    >
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-12">
          <Reveal className="lg:pt-2" direction="left">
            <SectionHeading>
              <span id="vehiculos-usados">Vehículos Usados</span>
            </SectionHeading>

            <p className="mt-6 max-w-md text-base leading-[1.8] text-muted-foreground">
              Unidades seleccionadas con historial comprobable y
              documentación al día, listas para entregar. También compramos
              su vehículo y coordinamos la importación del modelo nuevo que
              busque.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <SiteButton href="/inventario" size="md">
                Ver inventario
              </SiteButton>
              <SiteButton href="/contacto" size="md" variant="outline">
                Vender mi vehículo
              </SiteButton>
            </div>
          </Reveal>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {destacados.map((auto, i) => (
              <li key={auto.id}>
                <Reveal delay={(i % 2) * 0.1}>
                  <CarCardDetalle auto={auto} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 flex flex-col items-center gap-5 text-center">
          <p className="font-display text-2xl tracking-wide">
            ¿Interesado en alguno de nuestros vehículos?
          </p>
          <SiteButton href="/contacto" size="lg">
            Contactar a un especialista
          </SiteButton>
        </div>
      </div>
    </section>
  );
}
