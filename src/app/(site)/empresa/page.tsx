import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { marcas, oficinaImageUrl } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteButton } from "@/components/site/button";
import { Reveal } from "@/components/site/reveal";
import { StatsBand } from "@/components/site/stats-band";
import { LogoMarca } from "@/components/site/logo-marca";

export async function generateMetadata(): Promise<Metadata> {
  const [t, tBrand] = await Promise.all([
    getTranslations("metadata"),
    getTranslations("brandStrip"),
  ]);
  return {
    title: t("empresaTitulo"),
    description: tBrand("confianza"),
    alternates: { canonical: "/empresa" },
  };
}

export default async function EmpresaPage() {
  const [t, tBrand] = await Promise.all([
    getTranslations("empresa"),
    getTranslations("brandStrip"),
  ]);

  return (
    <div className="mx-auto max-w-site px-5 py-14 sm:px-8 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeading as="h1">{t("titulo")}</SectionHeading>

          <p className="mt-6 text-base leading-[1.8] text-foreground/85 sm:text-lg">
            {tBrand("confianza")} {t("textoExtra")}
          </p>

          <SiteButton href="/inventario" size="lg" className="mt-10">
            {t("ctaInventario")}
          </SiteButton>
        </div>

        {/* Foto real de la oficina, no generada — a diferencia del hero y los
            fondos de servicios, acá el punto es mostrar el lugar real. */}
        <div className="relative aspect-[3/4] overflow-hidden border border-white/[0.07] shadow-lift sm:mx-auto sm:max-w-sm lg:mx-0 lg:max-w-none">
          <Image
            src={oficinaImageUrl}
            alt={t("fotoAlt")}
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-cover [filter:sepia(.25)_saturate(.85)_hue-rotate(-12deg)]"
          />
        </div>
      </div>

      {/* Misma franja de trayectoria que la home (StatsBand) — llena con un
          dato concreto (30+ años, embajadas atendidas, vehículos vendidos)
          el espacio que antes ocupaba el bloque de líneas de negocio, que ya
          se explica en la home y se sentía repetido acá. */}
      <div className="-mx-5 mt-20 sm:-mx-8">
        <StatsBand />
      </div>

      {/* Muro de marcas: mismo array y mismo tratamiento visual "logo suelto"
          que BrandStrip en la home — antes esta sección repetía las ~20
          marcas como una grilla de tarjetas cuadradas grandes, que con ese
          volumen se volvía una página entera de solo logos. Un muro
          horizontal compacto (mismo patrón ya resuelto en BrandStrip) cabe
          en una fracción del alto y no exige scroll para llegar a lo que
          sigue. */}
      <div className="mt-24">
        <SectionHeading>{t("marcasTitulo")}</SectionHeading>

        <p className="mt-6 max-w-2xl text-base leading-[1.8] text-foreground/85 sm:text-lg">
          {t("marcasTexto")}
        </p>

        {/* Grilla de 4 en móvil, fila que envuelve desde sm: con `flex-wrap`
            y `gap-x-16` en 390px entraban dos logos por renglón y las 20
            marcas se estiraban diez filas, casi todo aire. */}
        <ul className="mt-10 grid grid-cols-4 items-center justify-items-center gap-x-6 gap-y-7 border-y border-border py-9 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-16 sm:gap-y-8 sm:py-10">
          {marcas.map((marca, i) => (
            <li
              key={marca.nombre}
              className="grid h-11 place-items-center sm:h-16"
            >
              <Reveal delay={(i % 12) * 0.03}>
                <div className="group grid place-items-center">
                  <LogoMarca marca={marca} hover="group" />
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
