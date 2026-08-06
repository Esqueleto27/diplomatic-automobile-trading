import { Reveal } from "@/components/site/reveal";
import { SiteButton } from "@/components/site/button";

/** Cierre de la portada: un llamado a la acción único al final del home. */
export function ContactCta() {
  return (
    <section
      className="border-t border-border bg-surface py-24 sm:py-32"
      aria-labelledby="contacto-cta"
    >
      <div className="mx-auto flex max-w-site flex-col items-center px-5 text-center sm:px-8">
        <Reveal className="flex flex-col items-center">
          <span aria-hidden className="mb-5 h-px w-12 bg-gold/70" />
          <h2
            id="contacto-cta"
            className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-light leading-[1.1] tracking-wide"
          >
            Hablemos de su próximo vehículo
          </h2>
          <p className="mt-6 max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg">
            Un especialista le atiende personalmente para asesorarlo en la
            compra, importación o los trámites de su vehículo.
          </p>
          <SiteButton href="/contacto" size="lg" className="mt-10">
            Contáctanos
          </SiteButton>
        </Reveal>
      </div>
    </section>
  );
}
