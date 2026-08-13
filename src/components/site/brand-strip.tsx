import { confianza, marcas } from "@/lib/site";
import { LogoMarca } from "@/components/site/logo-marca";

/**
 * Muro de marcas: todas visibles siempre, sin flechas ni auto-scroll — eso
 * sigue descartado a propósito (esconder marcas detrás de un control obliga
 * a buscarlas, y un movimiento constante se lee inquieto, lo contrario del
 * tono de la marca).
 *
 * El layout sí cambia por viewport: en desktop es `flex-wrap`, todas visibles
 * sin scroll. En móvil, `flex-wrap` con ~20 marcas da 5-6 filas completas de
 * puro logo antes de llegar a cualquier otro contenido — dos pantallas de
 * scroll vertical sin nada más. Ahí pasa a una fila con scroll horizontal
 * (deslizable, sin flecha ni movimiento automático: lo mueve el visitante,
 * no la página) — sigue mostrando las mismas marcas, sólo cambia el eje de
 * scroll de vertical a horizontal para no monopolizar la pantalla.
 *
 * La frase de confianza (+30 años) va como leyenda arriba del muro de marcas,
 * a propósito, en vez de vivir en su propia sección de "bienvenida" separada
 * — eso es lo que hace que dos sitios del mismo rubro se lean calcados
 * aunque el texto sea distinto palabra por palabra.
 */
export function BrandStrip() {
  return (
    <section
      aria-label="Marcas que comercializamos"
      className="border-y border-border bg-surface"
    >
      <div className="mx-auto flex max-w-site flex-col items-center px-5 pt-8 sm:px-8">
        <span aria-hidden className="mb-4 h-px w-10 bg-gold/70" />
        <p className="text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          {confianza.frase}
        </p>
      </div>

      <ul
        className="no-scrollbar mx-auto flex max-w-site snap-x snap-mandatory items-center gap-x-10 overflow-x-auto px-5 py-10 scroll-px-5 sm:scroll-px-8 md:flex-wrap md:justify-center md:gap-x-16 md:gap-y-8 md:overflow-visible md:px-8"
      >
        {marcas.map((marca) => (
          <li
            key={marca.nombre}
            className="grid h-16 shrink-0 snap-center place-items-center"
          >
            <LogoMarca marca={marca} />
          </li>
        ))}
      </ul>
    </section>
  );
}
