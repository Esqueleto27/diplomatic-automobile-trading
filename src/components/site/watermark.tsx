import Image from "next/image";
import { logoUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Marca de agua: logo propio superpuesto en cada foto real de auto (nunca
 * en placeholders), discreto pero siempre presente — protege contra el uso
 * de las fotos fuera del sitio sin taparle la vista al vehículo. Usada por
 * CarMedia (tarjetas del inventario) y CarGallery (foto grande de la ficha
 * de un auto) — antes cada una tenía su propia copia del mismo `<Image>`.
 *
 * `size="sm"` para las tarjetas del inventario (fotos más chicas, marca de
 * agua más discreta); `size="lg"` para la foto grande de la ficha.
 */
export function Watermark({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <Image
      src={logoUrl}
      alt=""
      aria-hidden
      width={300}
      height={74}
      className={cn(
        "pointer-events-none absolute w-auto opacity-80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]",
        size === "sm"
          ? "bottom-2.5 right-2.5 h-4 sm:h-5"
          : "bottom-3 right-3 h-5 sm:h-6",
      )}
    />
  );
}
