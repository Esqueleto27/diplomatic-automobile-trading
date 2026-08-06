import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Servicio } from "@/lib/site";

/**
 * Tarjeta de descubrimiento — vive en la home, en /servicios (grilla) y como
 * "servicios relacionados" al pie de cada landing individual.
 *
 * `aspect-[4/3]` es a propósito fijo (no depende del alto del contenido):
 * dentro de una misma grilla, todas las columnas tienen el mismo ancho, así
 * que fijar el aspect-ratio garantiza que las 7 cards midan exactamente lo
 * mismo sin importar si el título o el resumen de una es más largo que el
 * de otra — antes de esto, una versión sin imagen y sin aspect-ratio fijo
 * quedaba con alturas irregulares.
 *
 * La card sólo tiene que dar ganas de entrar: foto real del servicio,
 * título, una línea de resumen y el CTA. El detalle completo (descripción
 * larga) vive en su sección dentro de /servicios, a la que esta card lleva
 * directo por ancla.
 */
export function ServiceCard({ servicio, delay = 0 }: { servicio: Servicio; delay?: number }) {
  const { slug, titulo, resumen, icono: Icono, imagen } = servicio;

  return (
    <Link
      href={`/servicios#${slug}`}
      style={{ animationDelay: `${delay}s` }}
      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden border border-white/[0.07] bg-surface p-6 outline-none transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_44px_-18px_rgba(0,0,0,0.6),0_0_0_1px_rgba(199,163,84,0.12)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      {imagen ? (
        <>
          <Image
            src={imagen}
            alt=""
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {/* El velo arranca al 85% abajo (donde va el texto) y se disuelve
              del todo a media altura: las fotos de servicios ya son oscuras
              de por sí, así que un degradado que cubría toda la card las
              apagaba hasta volverlas rectángulos marrones indistinguibles. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 via-55% to-transparent transition-opacity duration-300"
          />
        </>
      ) : (
        <div aria-hidden className="absolute inset-0 bg-placeholder-esquina" />
      )}

      <div
        aria-hidden
        className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-white/15 bg-black/30 backdrop-blur-sm transition-colors duration-300 group-hover:border-gold/60"
      >
        <Icono className="size-5 text-gold transition-transform duration-300 group-hover:scale-110" />
      </div>

      <div className="relative">
        <span
          aria-hidden
          className="mb-4 block h-px w-10 bg-gold/70 transition-all duration-500 group-hover:w-16"
        />
        {/* El contenedor reserva siempre el alto de 2 líneas (text-xl 1.25rem
            x leading-snug 1.375 x 2 = 3.4375rem) y ancla el título abajo: sin
            esto, los títulos de una línea suben su bloque y la rayita dorada
            queda a distinta altura en cada card de la fila. El min-h va en el
            div y no en el h3 porque line-clamp-2 usa display:-webkit-box, que
            no admite el alineado vertical. */}
        <div className="flex min-h-[3.4375rem] items-end">
          <h3 className="line-clamp-2 font-display text-xl leading-snug tracking-wide">
            {titulo}
          </h3>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {resumen}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-gold">
          Ver más
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
