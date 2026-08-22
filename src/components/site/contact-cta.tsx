import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/site/reveal";
import { ImageSettle } from "@/components/site/image-settle";
import { SiteButton } from "@/components/site/button";
import { contactoCtaImageUrl } from "@/lib/site";

/**
 * Cierre de la portada: un llamado a la acción único al final del home.
 *
 * El fondo es un plano de detalle de un sedán sin marca en una calle
 * mojada, de noche (generada — ver `contactoCtaImageUrl` en site.ts para
 * el historial completo de fotos que pasaron por acá), tratado en tres
 * capas: el filtro le baja el brillo lo justo, un negro parejo asegura
 * contraste en toda la franja, y un radial oscurece específicamente la
 * banda central, que es donde cae el bloque de texto.
 */
export function ContactCta() {
  const t = useTranslations("contactCta");

  return (
    <section
      className="relative isolate overflow-hidden border-t border-border py-20 sm:py-32"
      aria-labelledby="contacto-cta"
    >
      {/* La foto ya es oscura de por sí (hora azul, noche) — a diferencia
          de la columnata anterior, acá el filtro sólo tiene que asegurar
          contraste para el texto, no rescatar una imagen sobreexpuesta. */}
      {/* Era la única foto grande del sitio sin ningún movimiento — todas
          las demás (hero, oficina, empresa) ya asientan o se descubren al
          entrar en pantalla, y quieta al lado se leía como que a esta
          sección se le olvidó terminarla. `-z-10` va en ImageSettle, no en
          la Image: es el contenedor el que necesita el stacking context
          por encima del negro del fondo de la sección. */}
      <ImageSettle className="absolute inset-0 -z-10">
        <Image
          src={contactoCtaImageUrl}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center [filter:brightness(.75)_saturate(.95)]"
        />
      </ImageSettle>
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
