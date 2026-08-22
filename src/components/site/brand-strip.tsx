import { useTranslations } from "next-intl";
import { marcas } from "@/lib/site";
import { LogoMarca } from "@/components/site/logo-marca";

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
      className="surface-lit border-y border-border bg-surface"
    >
      <div className="mx-auto flex max-w-site flex-col items-center px-5 pt-10 sm:px-8 sm:pt-12">
        <span aria-hidden className="mb-4 h-px w-16 [background-image:linear-gradient(90deg,transparent,var(--gold),transparent)]" />
        {/* Un poco más grande en móvil (antes text-sm/14px, se leía chico
            para un dato que la empresa considera importante — los +30
            años) y con más ancho/interlineado para que respire en vez de
            apretarse en varias líneas cortas.
            `text-foreground/90` en vez de `text-muted-foreground`: es el
            mensaje de posicionamiento del negocio (a quién le venden y
            desde cuándo), no una leyenda secundaria — con el gris apagado
            se leía como letra chica. */}
        <p className="max-w-[28rem] text-center text-[0.9375rem] leading-[1.7] text-foreground/90 sm:max-w-none sm:text-base sm:leading-relaxed">
          {t("confianza")}
        </p>
      </div>

      {/* Todas las marcas visibles siempre, también en móvil — antes se
          cortaba a las primeras 12 (tres filas de cuatro) y el resto sólo
          aparecía desde `sm:`. El cliente pidió mostrarlas todas: en vez de
          cortar, se achica el logo (`h-9` en vez de `h-11`) y se suman
          columnas (`grid-cols-5` en vez de 4) para que las ~20 entren sin
          que la sección se alargue demasiado. */}
      <ul className="mx-auto grid max-w-site grid-cols-5 items-center justify-items-center gap-x-4 gap-y-6 px-5 py-9 sm:grid-cols-6 sm:gap-x-10 sm:gap-y-7 sm:px-8 sm:py-12 md:flex md:flex-wrap md:justify-center md:gap-x-14 md:gap-y-9">
        {marcas.map((marca) => (
          <li
            key={marca.nombre}
            className="grid h-9 place-items-center sm:h-14 md:h-16 md:shrink-0"
          >
            <LogoMarca marca={marca} />
          </li>
        ))}
      </ul>
    </section>
  );
}
