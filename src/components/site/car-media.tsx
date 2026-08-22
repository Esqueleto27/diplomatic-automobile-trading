import Image from "next/image";
import { cn } from "@/lib/utils";
import type { AutoPublico } from "@/lib/cars";
import { Watermark } from "@/components/site/watermark";
import { ImageSettle } from "@/components/site/image-settle";

/**
 * Foto de portada del auto. Cuando todavía no se cargó ninguna foto muestra
 * un marcador tipográfico en vez de un hueco roto: el inventario se publica
 * antes de tener la sesión de fotos.
 */
export function CarMedia({
  auto,
  sizes,
  className,
  priority,
}: {
  auto: AutoPublico;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const portada = auto.fotos[0]?.url;

  return (
    <div
      className={cn("relative overflow-hidden bg-surface-2", className)}
    >
      {portada ? (
        <ImageSettle className="absolute inset-0">
          <Image
            src={portada}
            alt={auto.nombre}
            fill
            sizes={sizes}
            priority={priority}
            quality={90}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <Watermark size="sm" />
        </ImageSettle>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 grid place-items-center bg-placeholder-centro"
        >
          <span className="font-display text-6xl font-light text-foreground/[0.12]">
            D
          </span>
        </div>
      )}
    </div>
  );
}
