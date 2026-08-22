import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/site/reveal";
import { SiteButton } from "@/components/site/button";
import { contactoCtaImageUrl } from "@/lib/site";

/**
 * Cierre de la portada: un llamado a la acción único al final del home.
 *
 * El fondo es una columnata institucional de noche (generada, sin autos —
 * ver `contactoCtaImageUrl` en site.ts para por qué se cambió la foto de
 * superautos que había antes), tratada en tres capas: el filtro le baja el
 * brillo lo justo, un negro parejo asegura contraste en toda la franja, y
 * un radial oscurece específicamente la banda central, que es donde cae el
 * bloque de texto.
 */
export function ContactCta() {
  const t = useTranslations("contactCta");

  return (
    <section
      className="relative isolate overflow-hidden border-t border-border py-20 sm:py-32"
      aria-labelledby="contacto-cta"
    >
      {/* Tratamiento bastante más suave que el anterior
          (grayscale .35 + sepia .2 + brightness .45 + negro al 70 %): esa
          receta oscurecía tanto la foto que no se distinguía qué era, y una
          imagen que no se lee no aporta nada — sólo ensucia el fondo. Acá el
          brillo baja lo justo para que el texto tenga contraste y la
          columnata siga siendo reconocible, y se quita el desaturado: el
          ámbar cálido de la piedra es exactamente el color de la marca. */}
      <Image
        src={contactoCtaImageUrl}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center [filter:brightness(.75)_saturate(.95)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/40" />
      {/* El radial oscurece sólo la banda central, que es donde cae el
          bloque de texto — deja los bordes de la foto más limpios. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(58%_58%_at_50%_50%,rgba(0,0,0,.55),transparent)]"
      />

      <div className="mx-auto flex max-w-site flex-col items-center px-5 text-center sm:px-8">
        <Reveal className="flex flex-col items-center">
          <span aria-hidden className="mb-6 h-px w-20 [background-image:linear-gradient(90deg,transparent,var(--gold),transparent)]" />
          <h2
            id="contacto-cta"
            className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-light leading-[1.1] tracking-wide"
          >
            {t("titulo")}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg">
            {t("texto")}
          </p>
          <SiteButton href="/contacto" size="lg" className="mt-9 sm:mt-10">
            {t("cta")}
          </SiteButton>
        </Reveal>
      </div>
    </section>
  );
}
