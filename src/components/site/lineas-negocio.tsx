import { lineasNegocio } from "@/lib/site";
import { Reveal } from "@/components/site/reveal";

/**
 * Deliberadamente NO es una grilla de tarjetas parejas con ícono arriba —
 * ese es el patrón que usa la competencia para presentar sus mismas dos
 * líneas de negocio (compra para diplomáticos / organismos internacionales),
 * y calcar la estructura visual además del texto seguiría leyéndose como
 * copia. Acá son dos paneles grandes tipo editorial, separados por una
 * regla vertical, con el ícono junto al título en vez de flotando arriba.
 */
export function LineasNegocio() {
  return (
    <section className="py-28 sm:py-36" aria-label="Qué hacemos">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-border">
        {lineasNegocio.map(({ slug, titulo, descripcion, icono: Icono }, i) => (
          <Reveal
            key={slug}
            delay={i * 0.12}
            className="lg:px-12 lg:first:pl-0 lg:last:pr-0"
          >
            <div className="flex items-center gap-3">
              <Icono className="size-6 shrink-0 text-gold" aria-hidden />
              <h2 className="font-display text-2xl tracking-wide">
                {titulo}
              </h2>
            </div>
            <p className="mt-4 max-w-md text-base leading-[1.8] text-muted-foreground sm:text-lg">
              {descripcion}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
