import Link from "next/link";
import type { AutoPublico } from "@/lib/cars";
import { CarMedia } from "@/components/site/car-media";
import { SiteButton } from "@/components/site/button";
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
export async function CarCardDetalle({ auto }: { auto: AutoPublico }) {
  const hrefTestDrive = await whatsappHref(mensajeTestDrive(auto.nombre));

  return (
    <article className="group flex h-full flex-col border border-gold/25 bg-surface transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/60 hover:shadow-lift">
      <Link
        href={`/autos/${auto.slug}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <CarMedia
          auto={auto}
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
          className="aspect-[16/10]"
        />
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
        <p className="mt-3 text-[1.375rem] font-semibold tracking-wide text-gold">
          {precioLegible(auto)}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 pt-1">
          <SiteButton
            href={hrefTestDrive}
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agenda un Test Drive
          </SiteButton>
          <SiteButton href={`/autos/${auto.slug}`} size="sm" variant="outline">
            Ver fotos
          </SiteButton>
        </div>
      </div>
    </article>
  );
}
