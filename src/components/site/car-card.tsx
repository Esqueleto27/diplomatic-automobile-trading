import Link from "next/link";
import type { AutoPublico } from "@/lib/cars";
import { esVendido, estadoLabel } from "@/lib/cars";
import { CarMedia } from "@/components/site/car-media";
import { SiteButton } from "@/components/site/button";
import { cn } from "@/lib/utils";
import { formatoNumero, formatoPrecio } from "@/lib/format";

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
  const vendido = esVendido(auto.estado);
  // El badge de estado ya dice "Vendido" cuando corresponde — mostrarlo dos
  // veces (el estado normal + un badge aparte) sería redundante, así que acá
  // sólo cambia el estilo del mismo badge en vez de sumar uno nuevo.
  const estado = estadoLabel(auto.estado);
  const sinPrecio = auto.precio == null;

  return (
    <article
      className={cn(
        "group flex h-full flex-col border bg-surface transition-all duration-300 ease-out",
        vendido
          ? "border-white/[0.07]"
          : "border-gold/25 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lift",
      )}
    >
      <Link
        href={`/autos/${auto.slug}`}
        className="relative block outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <CarMedia
          auto={auto}
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
          className={cn(
            "aspect-video sm:aspect-[16/10]",
            vendido && "grayscale",
          )}
        />
        {vendido && <div aria-hidden className="absolute inset-0 bg-black/35" />}
        {estado && (
          <span
            className={cn(
              "absolute left-3 top-3 border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] backdrop-blur-sm",
              vendido
                ? "border-foreground/40 bg-background/90 text-foreground"
                : "border-gold/60 bg-background/85 text-gold",
            )}
          >
            {estado}
          </span>
        )}
      </Link>

      <div className={cn("flex flex-1 flex-col p-6", vendido && "opacity-60")}>
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
              {vendido ? "Ver detalle" : "Ver más"}
            </SiteButton>
          </div>
        </div>
      </div>
    </article>
  );
}
