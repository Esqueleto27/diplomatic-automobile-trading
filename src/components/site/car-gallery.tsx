"use client";

import { useState } from "react";
import Image from "next/image";
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

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-surface-2">
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
      </div>

      {fotos.length > 1 && (
        // Ancho fijo por miniatura + scroll horizontal, no `flex-1`: con
        // flex-1 las 10 miniaturas que permite el sistema se repartían el
        // ancho disponible entre todas, y en un móvil angosto cada una
        // quedaba en unos 22px — imposible distinguir una foto de otra o
        // acertarle con el dedo.
        <ul className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
          {fotos.map((foto, i) => (
            <li key={foto.id} className="w-20 shrink-0 sm:w-24">
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
