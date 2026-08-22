import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { servicios } from "@/lib/site";
import { metadataPagina } from "@/lib/metadata";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteButton } from "@/components/site/button";
import {
  buildWhatsappHref,
  getWhatsappNumber,
  getWhatsappNumberSeguros,
} from "@/lib/whatsapp";

// Mismo motivo que /contacto: sin esto Next prerenderiza la página estática
// en build y el número de WhatsApp queda horneado desde .dev.vars en vez
// del valor real de producción.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return metadataPagina({
    ruta: "/servicios",
    titulo: t("serviciosTitulo"),
    descripcion: t("serviciosDescripcion"),
    ogLocale: t("ogLocale"),
  });
}

export default async function ServiciosPage() {
  // Dos números: los seguros los atiende otra línea del negocio (ver
  // `lineaSeguros` en src/lib/site.ts), el resto de los servicios va al
  // número principal.
  const [numeroWhatsapp, numeroSeguros, t, tWhatsapp] = await Promise.all([
    getWhatsappNumber(),
    getWhatsappNumberSeguros(),
    getTranslations("servicios"),
    getTranslations("whatsapp"),
  ]);

  return (
    <div>
      <div className="mx-auto max-w-site px-5 pt-14 sm:px-8 sm:pt-32">
        <SectionHeading as="h1">{t("tituloSeccion")}</SectionHeading>
        <p className="mt-6 max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg">
          {t("descripcionPagina")}
        </p>
      </div>

      {/* Fondo alternado por servicio (bg-background / bg-surface, los dos
          negros ya definidos en el tema) — cada sección va de borde a borde
          para que el cambio de tono se note y sea claro dónde termina un
          servicio y empieza el siguiente, en vez de que los 9 se lean como
          un solo bloque largo. */}
      {servicios.map(({ slug, icono: Icono, imagen, lineaSeguros }, i) => {
        const titulo = t(`items.${slug}.titulo`);
        const descripcion = t(`items.${slug}.descripcion`);
        return (
          <section
            key={slug}
            id={slug}
            className={i % 2 === 0 ? "bg-background" : "bg-surface"}
          >
            <div className="mx-auto grid max-w-site scroll-mt-28 items-center gap-7 px-5 py-12 sm:gap-8 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
                <div className="group relative aspect-[4/3] overflow-hidden border border-hairline bg-surface-2">
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
                    lineaSeguros ? numeroSeguros : numeroWhatsapp,
                    tWhatsapp("consultaServicio", { servicio: titulo }),
                  )}
                  size="md"
                  variant="outline"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8"
                >
                  {t("ctaConsultar")}
                </SiteButton>
              </div>
            </div>
          </section>
        );
      })}

      <div className="mx-auto max-w-site px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="mt-8 flex flex-col items-center gap-5 border-t border-border pt-16 text-center sm:mt-12 sm:pt-20">
          <h2 className="font-display text-3xl tracking-wide">
            {t("cierreTitulo")}
          </h2>
          <p className="max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg">
            {t("cierreTexto")}
          </p>
          <SiteButton href="/contacto" size="lg" className="mt-2">
            {t("cierreCta")}
          </SiteButton>
        </div>
      </div>
    </div>
  );
}
