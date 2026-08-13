import { indicadores } from "@/lib/site";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/**
 * Franja de trayectoria: mismo fondo/borde que el resto de franjas oscuras
 * del sitio (ver BrandStrip, justo arriba en la home) — antes usaba
 * `bg-cream` como único punto claro de la página, pero al lado de todo lo
 * demás (negro + dorado) se leía como un bloque ajeno, no como una pausa
 * intencional.
 *
 * `grid-cols-3` con divisores cuando hay 3 indicadores (así se lee sólido,
 * sin envolver a 2+1 en móvil como pasaría con `flex-wrap`). Con 1 solo
 * indicador (el caso real hoy: se sacaron dos cifras de negocio que nunca
 * llegó a confirmar el cliente, ver el comentario en `indicadores`) el
 * mismo grid de 3 columnas dejaría dos huecos vacíos con divisores sin
 * nada al lado — acá se centra en cambio como una única pieza.
 */
export function StatsBand() {
  const unSoloIndicador = indicadores.length === 1;

  return (
    <section
      aria-label="Nuestra trayectoria"
      className="border-b border-border bg-surface py-10 sm:py-14"
    >
      <div
        className={cn(
          "mx-auto grid max-w-site px-5 sm:px-8",
          unSoloIndicador
            ? "justify-center"
            : "grid-cols-3 divide-x divide-border",
        )}
      >
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
