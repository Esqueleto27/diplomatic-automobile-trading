import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { Servicio } from "@/lib/site";

/**
 * Tarjeta de descubrimiento — vive en la home, en /servicios (grilla) y como
 * "servicios relacionados" al pie de cada landing individual.
 *
 * `aspect-[4/3]` es a propósito fijo (no depende del alto del contenido):
 * dentro de una misma grilla, todas las columnas tienen el mismo ancho, así
 * que fijar el aspect-ratio garantiza que todas las cards midan exactamente lo
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
  const { slug, icono: Icono, imagen } = servicio;
  const t = useTranslations("servicios");
  const titulo = t(`items.${slug}.titulo`);
  const resumen = t(`items.${slug}.resumen`);

  return (
    <Link
      href={`/servicios#${slug}`}
      style={{ animationDelay: `${delay}s` }}
      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden border border-white/[0.07] bg-surface p-5 outline-none sm:p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_44px_-18px_rgba(0,0,0,0.6),0_0_0_1px_rgba(199,163,84,0.12)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
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
          {/* Antes se disolvía a 0.25 de opacidad ya a mitad de la card
              (`via-black/25 via-55%`) — insuficiente contraste contra fotos
              claras (contenedores, capó, ventana de aeropuerto): el título
              quedaba leyéndose directo sobre la imagen. Ahora casi opaco
              donde vive el texto (0.94 en la base, 0.8 hasta 35%) y recién
              empieza a aclarar después de esa zona, en vez de aclarar desde
              el borde inferior mismo. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.94)_0%,rgba(0,0,0,.8)_35%,rgba(0,0,0,.3)_65%,transparent_100%)] transition-opacity duration-300"
          />
        </>
      ) : (
        <div aria-hidden className="absolute inset-0 bg-placeholder-esquina" />
      )}

      <div className="relative">
        <span
          aria-hidden
          className="mb-4 block h-px w-10 bg-gold/70 transition-all duration-500 group-hover:w-16"
        />
        {/* El ícono va pegado al título, no flotando arriba a la derecha de
            la foto: así queda leído como parte del bloque de texto en vez de
            un elemento suelto desconectado. El contenedor del título reserva
            siempre el alto de 2 líneas (text-xl 1.25rem x leading-snug 1.375
            x 2 = 3.4375rem) y lo ancla abajo: sin esto, los títulos de una
            línea suben su bloque y el ícono/rayita quedan a distinta altura
            en cada card de la fila. El min-h va en el div y no en el h3
            porque line-clamp-2 usa display:-webkit-box, que no admite el
            alineado vertical. */}
        <div className="flex min-h-[3.4375rem] items-end gap-3">
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 bg-black/30 backdrop-blur-sm transition-colors duration-300 group-hover:border-gold/60"
          >
            <Icono className="size-4 text-gold transition-transform duration-300 group-hover:scale-110" />
          </span>
          <h3 className="line-clamp-2 font-display text-xl leading-snug tracking-wide">
            {titulo}
          </h3>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {resumen}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-gold">
          {t("verMas")}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
