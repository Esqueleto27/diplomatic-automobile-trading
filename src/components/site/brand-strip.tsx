import { useTranslations } from "next-intl";
import { marcas } from "@/lib/site";
import { LogoMarca } from "@/components/site/logo-marca";
import { cn } from "@/lib/utils";

// En móvil sólo entran las primeras 12 (tres filas justas de cuatro). No es
// un recorte de contenido importante: el muro de marcas es una señal de
// respaldo, no un listado que alguien lea entero — y las 20 en una columna de
// 390px daban cinco filas de puro logo. Desde `sm:` aparecen todas.
const MARCAS_EN_MOVIL = 12;

/**
 * Muro de marcas: todas visibles a la vez, sin flechas, sin auto-scroll y
 * —desde 2026-08-13— tampoco scroll horizontal en móvil.
 *
 * La versión anterior convertía la fila en un carrusel deslizable en
 * pantallas chicas. En la práctica se leía como un componente roto: sólo se
 * veían cuatro logos, el corte del cuarto quedaba a mitad de pantalla y nada
 * indicaba que había más para el costado (la barra va oculta). Ahora es una
 * grilla que envuelve, igual que en desktop — mismo componente en todos los
 * tamaños, sin eje de scroll propio compitiendo con el de la página.
 *
 * La frase de confianza (+30 años) va como leyenda arriba del muro, a
 * propósito, en vez de vivir en su propia sección de "bienvenida" separada
 * — eso es lo que hace que dos sitios del mismo rubro se lean calcados
 * aunque el texto sea distinto palabra por palabra.
 */
export function BrandStrip() {
  const t = useTranslations("brandStrip");

  return (
    <section
      aria-label={t("aria")}
      className="border-y border-border bg-surface"
    >
      <div className="mx-auto flex max-w-site flex-col items-center px-5 pt-10 sm:px-8 sm:pt-12">
        <span aria-hidden className="mb-4 h-px w-10 bg-gold/70" />
        <p className="max-w-[26rem] text-center text-sm leading-relaxed text-muted-foreground sm:max-w-none sm:text-base">
          {t("confianza")}
        </p>
      </div>

      <ul className="mx-auto grid max-w-site grid-cols-4 items-center justify-items-center gap-x-6 gap-y-7 px-5 py-9 sm:grid-cols-6 sm:gap-x-10 sm:px-8 sm:py-12 md:flex md:flex-wrap md:justify-center md:gap-x-14 md:gap-y-9">
        {marcas.map((marca, i) => (
          <li
            key={marca.nombre}
            className={cn(
              "grid h-11 place-items-center sm:h-14 md:h-16 md:shrink-0",
              i >= MARCAS_EN_MOVIL && "hidden sm:grid",
            )}
          >
            <LogoMarca marca={marca} />
          </li>
        ))}
      </ul>
    </section>
  );
}
