import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { SiteButton } from "@/components/site/button";
import { contactoCtaImageUrl } from "@/lib/site";

/**
 * Cierre de la portada: un llamado a la acción único al final del home.
 *
 * Foto real (fila de superautos) como textura de fondo, mismo tratamiento de
 * tres capas que la franja superior de /contacto (ver ContactoPage): el
 * filtro la desatura y le baja el brillo para que no compita con el texto,
 * `bg-black/70` asegura contraste parejo, y el radial oscurece
 * específicamente el centro, donde cae el título.
 */
export function ContactCta() {
  return (
    <section
      className="relative isolate overflow-hidden border-t border-border py-20 sm:py-32"
      aria-labelledby="contacto-cta"
    >
      <Image
        src={contactoCtaImageUrl}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center [filter:grayscale(.35)_sepia(.2)_brightness(.45)_saturate(.8)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/70" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_50%,rgba(0,0,0,.55),transparent)]"
      />

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
          <SiteButton href="/contacto" size="lg" className="mt-9 sm:mt-10">
            Contáctenos
          </SiteButton>
        </Reveal>
      </div>
    </section>
  );
}
