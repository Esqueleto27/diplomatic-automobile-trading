import Image from "next/image";
import { cn } from "@/lib/utils";
import type { AutoPublico } from "@/lib/cars";
import { logoUrl } from "@/lib/site";

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
        <>
          <Image
            src={portada}
            alt={auto.nombre}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {/* Marca de agua: logo propio en cada foto de auto, discreto pero
              siempre presente — protege contra el uso de las fotos fuera del
              sitio sin taparle la vista al vehículo. */}
          <Image
            src={logoUrl}
            alt=""
            aria-hidden
            width={300}
            height={74}
            className="pointer-events-none absolute bottom-2.5 right-2.5 h-4 w-auto opacity-80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] sm:h-5"
          />
        </>
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
