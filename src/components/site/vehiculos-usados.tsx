import type { AutoPublico } from "@/lib/cars";
import { AUTOS_EN_PORTADA } from "@/lib/cars";
import { CarCardDetalle } from "@/components/site/car-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { SiteButton } from "@/components/site/button";

export function VehiculosUsados({ autos }: { autos: AutoPublico[] }) {
  // La home ya pide exactamente esta cantidad, pero el slice queda como
  // red de seguridad: este componente nunca debe romper el grid de 3
  // columnas si alguien le pasa una lista más larga.
  const enPortada = autos.slice(0, AUTOS_EN_PORTADA);

  return (
    <section
      className="section-py border-y border-border bg-surface"
      aria-labelledby="vehiculos-usados"
    >
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <Reveal direction="left">
          <SectionHeading>
            <span id="vehiculos-usados">Vehículos Usados</span>
          </SectionHeading>

          <p className="mt-6 max-w-2xl text-base leading-[1.8] text-muted-foreground">
            Unidades seleccionadas con historial comprobable y documentación
            al día, listas para entregar. También compramos su vehículo y
            coordinamos la importación del modelo nuevo que busque.
          </p>
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {enPortada.map((auto, i) => (
            <li key={auto.id}>
              <Reveal delay={(i % 3) * 0.1}>
                <CarCardDetalle auto={auto} />
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center sm:mt-14">
          <SiteButton href="/inventario" size="lg">
            Ver inventario completo
          </SiteButton>
        </div>
      </div>
    </section>
  );
}
