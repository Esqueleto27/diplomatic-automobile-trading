import type { Metadata } from "next";
import { servicios } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { mensajeConsultaServicio, whatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Servicios — Diplomatic Automobile Trading",
  description:
    "Matriculación, importación con cupo diplomático y seguros para el cuerpo diplomático.",
};

export default function ServiciosPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-28">
      <SectionHeading as="h1">Servicios Adicionales</SectionHeading>
      <p className="mt-3 max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg">
        Más allá de la compra del vehículo, acompañamos los trámites que suelen
        consumir más tiempo al llegar o mudarse de país.
      </p>

      <div className="mt-14 space-y-px">
        {servicios.map(({ slug, titulo, descripcion, icono: Icono }) => (
          <section
            key={slug}
            id={slug}
            className="scroll-mt-28 border-t border-border py-9 last:border-b"
          >
            <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start sm:gap-8">
              <Icono
                className="size-7 text-gold/70"
                aria-hidden
              />

              <div>
                <h2 className="font-display text-2xl leading-snug tracking-wide">
                  {titulo}
                </h2>
                <p className="mt-2 max-w-2xl text-base leading-[1.8] text-muted-foreground">
                  {descripcion}
                </p>
              </div>

              <a
                href={whatsappHref(mensajeConsultaServicio(titulo))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 shrink-0 items-center justify-center border border-gold/40 px-5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-gold outline-none transition-colors hover:border-gold hover:bg-gold/10 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                Consultar
              </a>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
