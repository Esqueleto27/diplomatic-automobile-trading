import Link from "next/link";
import type { AutoPublico } from "@/lib/cars";
import { estadoLabel } from "@/lib/cars";
import { CarMedia } from "@/components/site/car-media";
import { SiteButton } from "@/components/site/button";
import { cn } from "@/lib/utils";

const formatoNumero = new Intl.NumberFormat("es-EC");
const formatoPrecio = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function especificaciones(auto: AutoPublico): string {
  return [
    auto.anio?.toString(),
    auto.kilometraje != null
      ? `${formatoNumero.format(auto.kilometraje)} km`
      : null,
    auto.transmision,
    auto.combustible,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function precioLegible(auto: AutoPublico): string {
  return auto.precio != null
    ? formatoPrecio.format(auto.precio)
    : "Precio bajo consulta";
}

/** Tarjeta completa con specs y acciones, para vehículos usados/diplomáticos. */
export function CarCardDetalle({ auto }: { auto: AutoPublico }) {
  const estado = estadoLabel(auto.estado);
  const sinPrecio = auto.precio == null;

  return (
    <article className="group flex h-full flex-col border border-gold/25 bg-surface transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/60 hover:shadow-lift">
      <Link
        href={`/autos/${auto.slug}`}
        className="relative block outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <CarMedia
          auto={auto}
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
          className="aspect-video sm:aspect-[16/10]"
        />
        {estado && (
          <span className="absolute left-3 top-3 border border-gold/60 bg-background/85 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-gold backdrop-blur-sm">
            {estado}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl leading-tight tracking-wide">
          <Link href={`/autos/${auto.slug}`} className="hover:text-gold">
            {auto.nombre}
          </Link>
        </h3>

        <p className="mt-3 text-sm tracking-wide text-muted-foreground">
          {especificaciones(auto)}
        </p>

        {/* mt-auto ancla precio + CTA al fondo de la card: sin esto, un
            título de 2 líneas en una tarjeta y de 1 en la de al lado
            desalinea dónde caen el precio y el botón entre columnas. */}
        <div className="mt-auto pt-3">
          <p
            className={cn(
              "font-semibold tracking-wide text-gold",
              sinPrecio ? "text-base" : "text-[1.375rem]",
            )}
          >
            {precioLegible(auto)}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 pt-1">
            <SiteButton href={`/autos/${auto.slug}`} size="sm">
              Ver más
            </SiteButton>
          </div>
        </div>
      </div>
    </article>
  );
}
