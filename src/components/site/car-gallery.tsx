"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Watermark } from "@/components/site/watermark";

export function CarGallery({
  fotos,
  nombre,
}: {
  fotos: { id: string; url: string }[];
  nombre: string;
}) {
  const [activa, setActiva] = useState(0);
  const thumbRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Tanto las flechas como las miniaturas mueven `activa` — sin esto, avanzar
  // con flecha hasta una foto fuera del área visible de miniaturas (con
  // scroll horizontal oculto, ver comentario más abajo) la dejaba
  // seleccionada pero invisible, sin pista de cuál era.
  useEffect(() => {
    thumbRefs.current[activa]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activa]);

  if (fotos.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full border border-border bg-surface-2">
        <div
          aria-hidden
          className="absolute inset-0 grid place-items-center bg-placeholder-centro"
        >
          <span className="font-display text-8xl font-light text-foreground/[0.12]">
            D
          </span>
        </div>
        <p className="absolute inset-x-0 bottom-6 text-center text-xs tracking-wide text-muted-foreground">
          Fotografías en preparación
        </p>
      </div>
    );
  }

  const hayVarias = fotos.length > 1;
  const anterior = () => setActiva((i) => (i - 1 + fotos.length) % fotos.length);
  const siguiente = () => setActiva((i) => (i + 1) % fotos.length);

  return (
    <div>
      <div
        className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-surface-2 outline-none"
        tabIndex={hayVarias ? 0 : undefined}
        onKeyDown={
          hayVarias
            ? (e) => {
                if (e.key === "ArrowLeft") anterior();
                if (e.key === "ArrowRight") siguiente();
              }
            : undefined
        }
      >
        <Image
          src={fotos[activa].url}
          alt={`${nombre} — foto ${activa + 1} de ${fotos.length}`}
          fill
          priority
          quality={90}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        {/* No va en las miniaturas del carrusel, más abajo — ya son
            demasiado chicas para llevarla. */}
        <Watermark size="lg" />

        {hayVarias && (
          <>
            {/* Antes la única forma de ver el resto de las fotos era
                arrastrar la tira de miniaturas, sin ninguna barra de scroll
                visible (se oculta a propósito, ver `no-scrollbar` abajo) que
                avisara que había más — se reportó como "no tengo acceso a
                las demás fotos". Estas flechas son ahora la vía principal;
                las miniaturas siguen sirviendo para saltar directo a una. */}
            <button
              type="button"
              onClick={anterior}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center border border-white/20 bg-background/70 text-foreground backdrop-blur-sm outline-none transition-colors hover:border-gold hover:text-gold focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={siguiente}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center border border-white/20 bg-background/70 text-foreground backdrop-blur-sm outline-none transition-colors hover:border-gold hover:text-gold focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute bottom-3 right-3 border border-white/20 bg-background/70 px-2.5 py-1 text-xs tabular-nums text-foreground backdrop-blur-sm">
              {activa + 1} / {fotos.length}
            </span>
          </>
        )}
      </div>

      {hayVarias && (
        // Ancho fijo por miniatura + scroll horizontal, no `flex-1`: con
        // flex-1 las 10 miniaturas que permite el sistema se repartían el
        // ancho disponible entre todas, y en un móvil angosto cada una
        // quedaba en unos 22px — imposible distinguir una foto de otra o
        // acertarle con el dedo.
        <ul className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
          {fotos.map((foto, i) => (
            <li
              key={foto.id}
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              className="w-20 shrink-0 sm:w-24"
            >
              <button
                type="button"
                onClick={() => setActiva(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === activa}
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden border transition-colors outline-none",
                  "focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  i === activa
                    ? "border-gold"
                    : "border-border hover:border-gold/50",
                )}
              >
                <Image
                  src={foto.url}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
