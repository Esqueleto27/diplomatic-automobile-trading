import type { Metadata } from "next";
import Image from "next/image";
import { contacto, contactoHeroImageUrl, edificioImageUrl } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { ContactForm } from "@/components/site/contact-form";
import { SiteButton } from "@/components/site/button";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Hable con un especialista de Diplomatic Automobile Trading.",
  alternates: { canonical: "/contacto" },
};

export default async function ContactoPage() {
  const hrefEspecialista = await whatsappHref(
    "Hola, me gustaría hablar con un especialista de Diplomatic Automobile Trading.",
  );

  return (
    <>
      {/* Foto real (entrega de llaves) como textura de fondo, no como
          imagen protagonista: tres capas la apagan a propósito. El filtro
          la desatura y le baja el brillo para que no compita con el texto;
          `bg-black/70` asegura contraste parejo en toda la franja; el
          radial oscurece específicamente el centro, donde cae el título.
          `object-[center_35%]` centra las manos/llave detrás del
          encabezado en vez de la fila de autos del fondo. */}
      <section className="relative isolate overflow-hidden py-[clamp(5rem,10vw,8rem)]">
        <Image
          src={contactoHeroImageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[center_35%] [filter:grayscale(.35)_sepia(.2)_brightness(.45)_saturate(.8)]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/70" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_50%,rgba(0,0,0,.55),transparent)]"
        />

        <div className="mx-auto max-w-site px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <SectionHeading as="h1">Hablemos</SectionHeading>
              <p className="mt-6 max-w-md text-base leading-[1.8] text-muted-foreground sm:text-lg">
                Cuéntenos qué vehículo busca o qué trámite necesita resolver.
                Un especialista le responde por WhatsApp el mismo día.
              </p>

              <SiteButton
                href={hrefEspecialista}
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10"
              >
                Escribir por WhatsApp
              </SiteButton>

              <dl className="mt-14 space-y-px">
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
                    <a
                      href={`mailto:${contacto.email}`}
                      className="hover:text-gold"
                    >
                      {contacto.email}
                    </a>
                  </dd>
                </div>

                <div className="border-y border-border py-5">
                  <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
                    Sitio
                  </dt>
                  <dd className="mt-2 text-base text-foreground/85">
                    {contacto.sitio}
                  </dd>
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

            {/* Foto real de la fachada (no generada), mismo tratamiento que
                la foto de oficina en /empresa: retrato aspect-[3/4], sin
                forzarla a una caja panorámica que le recorte el encuadre
                vertical dramático que ya tiene. Ayuda a reconocer el
                edificio en persona; el mapa, más abajo, ayuda a llegar. */}
            <div className="relative aspect-[3/4] overflow-hidden border border-white/[0.07] shadow-lift sm:mx-auto sm:max-w-sm lg:mx-0 lg:max-w-none">
              <Image
                src={edificioImageUrl}
                alt="Fachada del edificio La Moraleja Business Center, oficinas de Diplomatic Automobile Trading"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-site px-5 py-16 sm:px-8 sm:py-20">
        <div>
          <SectionHeading as="h2">Escríbanos</SectionHeading>
          <p className="mt-3 max-w-md text-base leading-[1.8] text-muted-foreground sm:text-lg">
            Complete el formulario y un especialista le responde a la
            brevedad.
          </p>
          <div className="mt-8 max-w-2xl border border-white/[0.07] bg-surface p-6 sm:p-10">
            <ContactForm />
          </div>
        </div>

        {/* El embed gratuito de Google Maps no acepta estilos, y su mapa
            claro metía un bloque blanco en medio de una página oscura.
            `invert` + `hue-rotate(180deg)` es el truco estándar para
            pasarlo a modo oscuro conservando los colores: invierte la
            luminosidad y devuelve el tono a su sitio. */}
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
    </>
  );
}
