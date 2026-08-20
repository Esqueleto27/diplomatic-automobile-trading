import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { metadataPagina } from "@/lib/metadata";
import { SectionHeading } from "@/components/site/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return metadataPagina({
    ruta: "/privacidad",
    titulo: t("privacidadTitulo"),
    descripcion: t("privacidadDescripcion"),
    ogLocale: t("ogLocale"),
  });
}

// Cada bloque es {titulo, texto} de la traducción, listado acá en vez de
// escribir seis <section> casi idénticas a mano — agregar una sección nueva
// es una fila más en este array, no JSX repetido.
const SECCIONES = [
  "responsable",
  "finalidad",
  "baseLegal",
  "conservacion",
  "destinatarios",
  "derechos",
  "cambios",
] as const;

export default async function PrivacidadPage() {
  const t = await getTranslations("privacidad");

  return (
    <section className="py-14 sm:py-28">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <div className="max-w-2xl">
          <SectionHeading as="h1">{t("titulo")}</SectionHeading>
          <p className="mt-4 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            {t("actualizado")}
          </p>
          <p className="mt-8 text-base leading-[1.8] text-muted-foreground sm:text-lg">
            {t("intro")}
          </p>

          <dl className="mt-12 space-y-10">
            {SECCIONES.map((clave) => (
              <div key={clave}>
                <dt className="font-display text-xl font-light tracking-wide">
                  {t(`${clave}Titulo`)}
                </dt>
                <dd className="mt-3 text-base leading-[1.8] text-muted-foreground">
                  {t(`${clave}Texto`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
