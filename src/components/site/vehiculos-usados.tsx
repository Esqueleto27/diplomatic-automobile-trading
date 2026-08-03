import Link from "next/link";
import type { AutoPublico } from "@/lib/cars";
import { CarCardDetalle } from "@/components/site/car-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

export function VehiculosUsados({ autos }: { autos: AutoPublico[] }) {
  // Grilla 2x2 en vez de carrusel horizontal: con tarjetas de este tamaño
  // (foto + specs + precio + dos botones) una fila larga dejaba mucho aire
  // vacío arriba de cada una. Cuatro en cuadrícula se ven completas.
  const destacados = autos.slice(0, 4);

  return (
    <section className="py-28 sm:py-36" aria-labelledby="vehiculos-usados">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-12">
          <Reveal className="lg:pt-2">
            <SectionHeading>
              <span id="vehiculos-usados">
                Vehículos
                <br className="hidden lg:block" /> Diplomáticos
                <br className="hidden lg:block" /> Usados
              </span>
            </SectionHeading>

            <p className="mt-5 max-w-sm text-base leading-[1.8] text-muted-foreground">
              Unidades con historial verificado, provenientes de misiones
              diplomáticas. Cada vehículo pasa por revisión mecánica y
              documentación al día antes de publicarse.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground/80">
              ¿Tiene uno para vender? También compramos vehículos
              diplomáticos usados, con una transacción simple y segura para
              ambas partes.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground/80">
              ¿Busca un modelo nuevo en cambio? Nuestro inventario es de
              usados; para nuevos coordinamos la importación o compra local a
              pedido.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/inventario"
                className="inline-flex h-11 items-center bg-gold px-7 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-gold-foreground outline-none transition-colors hover:bg-gold-strong focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                Ver inventario
              </Link>
              <Link
                href="/contacto"
                className="inline-flex h-11 items-center border border-gold/40 px-7 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-gold outline-none transition-colors hover:border-gold hover:bg-gold/10 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                Vender mi vehículo
              </Link>
            </div>
          </Reveal>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {destacados.map((auto, i) => (
              <li key={auto.id}>
                <Reveal delay={(i % 2) * 0.1}>
                  <CarCardDetalle auto={auto} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
