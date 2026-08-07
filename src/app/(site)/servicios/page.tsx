import Image from "next/image";
import type { Metadata } from "next";
import { servicios } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteButton } from "@/components/site/button";
import {
  buildWhatsappHref,
  getWhatsappNumber,
  mensajeConsultaServicio,
} from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Matriculación, importación con cupo diplomático y seguros para el cuerpo diplomático.",
  alternates: { canonical: "/servicios" },
};

export default async function ServiciosPage() {
  const numeroWhatsapp = await getWhatsappNumber();

  return (
    <div>
      <div className="mx-auto max-w-site px-5 pt-20 sm:px-8 sm:pt-32">
        <SectionHeading as="h1">Nuestros Servicios</SectionHeading>
        <p className="mt-6 max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg">
          Más allá de la compra del vehículo, acompañamos los trámites que
          suelen consumir más tiempo al llegar o mudarse de país.
        </p>
      </div>

      {/* Fondo alternado por servicio (bg-background / bg-surface, los dos
          negros ya definidos en el tema) — cada sección va de borde a borde
          para que el cambio de tono se note y sea claro dónde termina un
          servicio y empieza el siguiente, en vez de que los 7 se lean como
          un solo bloque largo. */}
      {servicios.map(({ slug, titulo, descripcion, icono: Icono, imagen }, i) => (
        <section
          key={slug}
          id={slug}
          className={i % 2 === 0 ? "bg-background" : "bg-surface"}
        >
          <div className="mx-auto grid max-w-site scroll-mt-28 items-center gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16">
            <div className={i % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
              <div className="group relative aspect-[4/3] overflow-hidden border border-white/[0.07] bg-surface-2">
                {imagen ? (
                  <Image
                    src={imagen}
                    alt={titulo}
                    fill
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-placeholder-esquina"
                  />
                )}
              </div>
            </div>

            <div className={i % 2 === 0 ? "lg:order-2" : "lg:order-1"}>
              <div className="flex items-center gap-3">
                <Icono className="size-6 shrink-0 text-gold" aria-hidden />
                <h2 className="font-display text-2xl leading-snug tracking-wide sm:text-3xl">
                  {titulo}
                </h2>
              </div>
              <p className="mt-4 max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg">
                {descripcion}
              </p>
              <SiteButton
                href={buildWhatsappHref(
                  numeroWhatsapp,
                  mensajeConsultaServicio(titulo),
                )}
                size="md"
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8"
              >
                Consultar
              </SiteButton>
            </div>
          </div>
        </section>
      ))}

      <div className="mx-auto max-w-site px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="mt-8 flex flex-col items-center gap-5 border-t border-border pt-16 text-center sm:mt-12 sm:pt-20">
          <h2 className="font-display text-3xl tracking-wide">
            ¿Necesita ayuda con alguno de nuestros servicios?
          </h2>
          <p className="max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg">
            Cuéntenos qué necesita y un especialista lo atenderá personalmente.
          </p>
          <SiteButton href="/contacto" size="lg" className="mt-2">
            Contáctanos
          </SiteButton>
        </div>
      </div>
    </div>
  );
}
