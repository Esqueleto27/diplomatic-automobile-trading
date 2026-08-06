import { confianza, marcas } from "@/lib/site";

/**
 * Muro de marcas: todas visibles siempre, sin carrusel ni movimiento.
 * Se descartaron las flechas y el auto-scroll a propósito — esconder marcas
 * detrás de un control obliga al visitante a buscarlas, y una fila en
 * movimiento constante se lee inquieta, justo lo contrario del tono de la
 * marca. Con `flex-wrap` la fila se reacomoda sola en pantallas angostas.
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

      <ul className="mx-auto flex max-w-site flex-wrap items-center justify-center gap-x-12 gap-y-8 px-5 py-10 sm:gap-x-16 sm:px-8">
        {marcas.map((marca) => (
          <li key={marca.nombre} className="grid h-16 place-items-center">
            {marca.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={marca.logo}
                alt={marca.nombre}
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                style={{ height: `${2.76 * (marca.escala ?? 1)}rem` }}
                className="w-auto opacity-75 transition-opacity duration-300 hover:opacity-100"
              />
            ) : (
              <span className="whitespace-nowrap font-display text-lg uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-foreground">
                {marca.nombre}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
