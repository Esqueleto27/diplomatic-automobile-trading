import { indicadores } from "@/lib/site";
import { Reveal } from "@/components/site/reveal";

/**
 * Franja de trayectoria: mismo fondo/borde que el resto de franjas oscuras
 * del sitio (ver BrandStrip, justo arriba en la home) — antes usaba
 * `bg-cream` como único punto claro de la página, pero al lado de todo lo
 * demás (negro + dorado) se leía como un bloque ajeno, no como una pausa
 * intencional.
 *
 * `grid-cols-3` fijo, también en móvil (no `flex-wrap`): con 3 items,
 * flex-wrap en una pantalla angosta terminaba envolviendo a 2+1, dejando el
 * tercer número solo en su propia fila. Tres columnas con divisores se lee
 * sólido y ocupa una fracción del alto que una lista apilada.
 */
export function StatsBand() {
  return (
    <section
      aria-label="Nuestra trayectoria"
      className="border-b border-border bg-surface py-10 sm:py-14"
    >
      <div className="mx-auto grid max-w-site grid-cols-3 divide-x divide-border px-5 sm:px-8">
        {indicadores.map(({ valor, etiqueta }, i) => (
          <Reveal
            key={etiqueta}
            delay={i * 0.08}
            className="px-2 text-center sm:px-6"
          >
            <p className="font-display text-2xl font-light tracking-wide text-gold sm:text-4xl">
              {valor}
            </p>
            <p className="mt-1 text-[0.6rem] uppercase leading-tight tracking-[0.14em] text-muted-foreground sm:mt-2 sm:text-[0.65rem] sm:tracking-[0.2em]">
              {etiqueta}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
