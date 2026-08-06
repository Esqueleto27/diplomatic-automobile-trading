import { indicadores } from "@/lib/site";
import { Reveal } from "@/components/site/reveal";

/**
 * Indicadores de confianza, minimalistas: número grande en display + etiqueta
 * en mayúsculas chicas, separados por hairline en desktop. Sin gráficos, sin
 * íconos — la cifra y el label alcanzan.
 */
export function StatsBand() {
  return (
    <section aria-label="Nuestra trayectoria" className="py-24 sm:py-28">
      <div className="mx-auto grid max-w-site gap-y-12 px-5 sm:px-8 sm:grid-cols-3 sm:divide-x sm:divide-border">
        {indicadores.map(({ valor, etiqueta }, i) => (
          <Reveal
            key={etiqueta}
            delay={i * 0.08}
            className="sm:px-8 sm:first:pl-0 sm:last:pr-0"
          >
            <p className="font-display text-5xl font-light tracking-wide text-gold sm:text-6xl">
              {valor}
            </p>
            <p className="mt-3 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
              {etiqueta}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
