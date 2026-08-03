import type { Metadata } from "next";
import { contacto } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { ContactForm } from "@/components/site/contact-form";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto — Diplomatic Automobile Trading",
  description:
    "Hable con un especialista de Diplomatic Automobile Trading.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading as="h1">Hablemos</SectionHeading>
          <p className="mt-4 max-w-md text-base leading-[1.8] text-muted-foreground sm:text-lg">
            Cuéntenos qué vehículo busca o qué trámite necesita resolver. Un
            especialista le responde por WhatsApp el mismo día.
          </p>

          <a
            href={whatsappHref(
              "Hola, me gustaría hablar con un especialista de Diplomatic Automobile Trading.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center justify-center bg-gold px-8 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold-foreground outline-none transition-colors hover:bg-gold-strong focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            Escribir por WhatsApp
          </a>
        </div>

        <dl className="space-y-px self-start">
          <div className="border-t border-border py-5">
            <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
              Teléfono
            </dt>
            <dd className="mt-2 space-y-1 text-base">
              {contacto.telefonos.map((tel) => (
                <div key={tel}>
                  <a
                    href={`tel:${tel.replace(/\s/g, "")}`}
                    className="hover:text-gold"
                  >
                    {tel}
                  </a>
                </div>
              ))}
            </dd>
          </div>

          <div className="border-t border-border py-5">
            <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
              Email
            </dt>
            <dd className="mt-2 text-base">
              <a href={`mailto:${contacto.email}`} className="hover:text-gold">
                {contacto.email}
              </a>
            </dd>
          </div>

          <div className="border-y border-border py-5">
            <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
              Sitio
            </dt>
            <dd className="mt-2 text-base text-foreground/85">{contacto.sitio}</dd>
          </div>

          <div className="border-y border-border py-5">
            <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
              Dirección
            </dt>
            <dd className="mt-2 text-base text-foreground/85">
              {contacto.direccion}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-16 border-t border-border pt-14 sm:mt-20 sm:pt-16">
        <SectionHeading as="h2">Escríbanos</SectionHeading>
        <p className="mt-3 max-w-md text-base leading-[1.8] text-muted-foreground sm:text-lg">
          Complete el formulario y un especialista le responde a la brevedad.
        </p>
        <div className="mt-8 max-w-2xl">
          <ContactForm />
        </div>
      </div>

      {/* El embed gratuito de Google Maps no acepta estilos, y su mapa claro
          metía un bloque blanco en medio de una página oscura. `invert` +
          `hue-rotate(180deg)` es el truco estándar para pasarlo a modo oscuro
          conservando los colores: invierte la luminosidad y devuelve el tono a
          su sitio. */}
      <div className="mt-16 overflow-hidden border border-border">
        <iframe
          title="Ubicación de Diplomatic Automobile Trading — Edificio La Moraleja Business Center"
          src="https://www.google.com/maps?q=Av.+La+Coru%C3%B1a+N27-36+y+Av.+Francisco+de+Orellana,+Quito&output=embed"
          className="block h-[320px] w-full sm:h-[400px]"
          style={{
            filter:
              "invert(0.92) hue-rotate(180deg) saturate(0.5) brightness(0.95) contrast(0.9)",
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
