import Link from "next/link";
import type { AutoPublico } from "@/lib/cars";
import { CarMedia } from "@/components/site/car-media";
import { mensajeTestDrive, whatsappHref } from "@/lib/whatsapp";

const formatoNumero = new Intl.NumberFormat("es-EC");

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
    ? `USD ${formatoNumero.format(auto.precio)}`
    : "Precio bajo consulta";
}

/** Tarjeta completa con specs y acciones, para vehículos usados/diplomáticos. */
export function CarCardDetalle({ auto }: { auto: AutoPublico }) {
  return (
    <article className="group flex h-full flex-col border-x border-b border-t-0 border-gold/25 bg-surface transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_24px_44px_-18px_rgba(0,0,0,0.6)]">
      <Link
        href={`/autos/${auto.slug}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <CarMedia
          auto={auto}
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
          className="aspect-[4/3]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl leading-tight tracking-wide">
          <Link href={`/autos/${auto.slug}`} className="hover:text-gold">
            {auto.nombre}
          </Link>
        </h3>

        <p className="mt-2 text-sm tracking-wide text-muted-foreground">
          {especificaciones(auto)}
        </p>
        <p className="mt-2 text-[1.375rem] font-semibold tracking-wide text-gold">
          {precioLegible(auto)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2 pt-1">
          <a
            href={whatsappHref(mensajeTestDrive(auto.nombre))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center bg-gold px-4 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-gold-foreground outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-strong focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Agenda un Test Drive
          </a>
          <Link
            href={`/autos/${auto.slug}`}
            className="inline-flex h-10 items-center border border-gold/40 bg-transparent px-4 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-gold outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Ver fotos
          </Link>
        </div>
      </div>
    </article>
  );
}
