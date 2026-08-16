import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  alianzasImageUrl,
  experienciaImageUrl,
  marcas,
  oficinaImageUrl,
  razonesConfianza,
  trayectoriaImageUrl,
} from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { LogoMarca } from "@/components/site/logo-marca";

export async function generateMetadata(): Promise<Metadata> {
  const [t, tEmpresa] = await Promise.all([
    getTranslations("metadata"),
    getTranslations("empresa"),
  ]);
  return {
    title: t("empresaTitulo"),
    description: tEmpresa("intro"),
    alternates: { canonical: "/empresa" },
  };
}

/**
 * La página se lee como cinco bloques con un propósito distinto cada uno
 * (quiénes somos → de dónde venimos → por qué elegirnos → a quién
 * atendemos → con quién trabajamos), no como una sola columna de texto
 * corrido: por eso cada sección es `<section>` de borde a borde con su
 * propio contenedor y los fondos alternan entre los dos negros del tema
 * (`bg-background` / `bg-surface`), el mismo recurso que ya usa /servicios
 * para separar un ítem del siguiente.
 */
export default async function EmpresaPage() {
  const t = await getTranslations("empresa");

  return (
    <div>
      {/* 1. Presentación */}
      <section className="mx-auto max-w-site px-5 py-14 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionHeading as="h1">{t("titulo")}</SectionHeading>

            <p className="mt-6 text-base leading-[1.8] text-foreground/85 sm:text-lg">
              {t("intro")}
            </p>
          </div>

          {/* Foto real de la oficina, no generada — a diferencia del hero y los
              fondos de servicios, acá el punto es mostrar el lugar real.

              `w-full` es obligatorio junto con `sm:mx-auto`: en un item de
              grid, los márgenes automáticos desactivan el `stretch` por
              defecto y el elemento pasa a medir según su contenido, que acá
              es un `<Image fill>` (absolute, fuera del flujo) — sin esto la
              caja colapsa a 2px en toda la franja de tablet.

              El retrato 3/4 sólo se sostiene hasta `sm:`, donde la foto va
              centrada y acotada a `max-w-sm` (384px → 512px de alto). Desde
              `lg:` el layout pasa a dos columnas anchas y ese mismo 3/4 daba
              una foto altísima contra una columna de texto corta, con el
              texto flotando en medio de un vacío enorme. En `lg:` la foto
              pasa a 3/2 (apaisada), que es lo más cerca que llega del alto
              del título + párrafo sin recortarle el encuadre a la oficina. */}
          <div className="relative aspect-[3/4] w-full overflow-hidden border border-white/[0.07] shadow-lift sm:mx-auto sm:max-w-sm lg:mx-0 lg:aspect-[3/2] lg:max-w-none">
            <Image
              src={oficinaImageUrl}
              alt={t("fotoAlt")}
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover [filter:sepia(.25)_saturate(.85)_hue-rotate(-12deg)]"
            />
          </div>
        </div>
      </section>

      {/* 2. Nuestra historia — foto a la izquierda y texto a la derecha,
          al revés que la presentación de arriba: con la imagen del mismo
          lado en las dos, la página arrancaría con dos bloques calcados. */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-site gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal
            direction="left"
            className="relative aspect-[3/2] w-full overflow-hidden border border-white/[0.07] shadow-lift"
          >
            <Image
              src={trayectoriaImageUrl}
              alt={t("historiaFotoAlt")}
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal>
            <SectionHeading>{t("historiaTitulo")}</SectionHeading>
            <p className="mt-6 text-base leading-[1.8] text-foreground/85 sm:text-lg">
              {t("historiaTexto")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. ¿Por qué confiar en nosotros? */}
      <section className="mx-auto max-w-site px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading>{t("razonesTitulo")}</SectionHeading>

        {/* Una sola columna en móvil: con dos, los títulos de dos palabras
            ("Atención personalizada") parten en tres líneas y las tarjetas
            de la fila quedan de altos distintos. */}
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {razonesConfianza.map(({ slug, icono: Icono }, i) => (
            <li key={slug}>
              <Reveal delay={i * 0.06} className="h-full">
                <article className="flex h-full flex-col border border-white/[0.07] bg-surface p-7 transition-colors duration-200 hover:border-gold/50">
                  <Icono className="size-7 text-gold" aria-hidden />
                  <h3 className="mt-5 font-display text-xl tracking-wide">
                    {t(`razones.${slug}.titulo`)}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-[1.75] text-muted-foreground">
                    {t(`razones.${slug}.texto`)}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Nuestra experiencia — regla dorada al costado y no una tarjeta
          más: es la única sección de la página cuyo peso está en a quién se
          atiende, y con el mismo tratamiento que la historia (párrafo suelto
          sobre fondo alterno) las dos se leerían como el mismo bloque
          repetido dos veces. */}
      <section className="relative isolate overflow-hidden border-y border-border">
        {/* Mismo tratamiento de tres capas que ContactCta: el filtro desatura
            y oscurece la foto, el negro parejo asegura contraste para el
            texto y el degradado direccional hunde el lado donde cae el
            párrafo. Sin esto, los faroles cálidos de la foto se comen el
            texto blanco.

            El degradado direccional va sólo desde `md:`: en un teléfono el
            texto ocupa todo el ancho, así que no hay "lado seguro" — sumado
            al velo parejo dejaba la sección casi negra y la foto no se veía.
            Mismo criterio que el velo del Hero. */}
        <Image
          src={experienciaImageUrl}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover object-center [filter:grayscale(.3)_brightness(.5)_saturate(.85)]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/65" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 md:bg-[linear-gradient(90deg,rgba(0,0,0,.75)_0%,rgba(0,0,0,.5)_55%,transparent_100%)]"
        />

        <div className="mx-auto max-w-site px-5 py-20 sm:px-8 sm:py-28">
          <Reveal className="max-w-3xl border-l-2 border-gold/60 pl-6 sm:pl-10">
            <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-light leading-[1.2] tracking-wide">
              {t("experienciaTitulo")}
            </h2>
            <p className="mt-6 text-base leading-[1.8] text-foreground/90 sm:text-lg">
              {t("experienciaTexto")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5. Marcas y aliados: mismo tratamiento "logo suelto" que BrandStrip
          en la home — antes esta sección repetía las ~20 marcas como una
          grilla de tarjetas cuadradas grandes, que con ese volumen se volvía
          una página entera de solo logos. */}
      <section className="mx-auto max-w-site px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading>{t("marcasTitulo")}</SectionHeading>

        {/* Banda apaisada, no una foto al costado: la sección es título +
            muro de logos, y una columna de texto que no existe dejaría la
            mitad vacía. Además separa el título de los logos, que si no se
            pegan uno encima del otro. */}
        <Reveal className="relative mt-10 aspect-[16/9] w-full overflow-hidden border border-white/[0.07] shadow-lift sm:aspect-[3/1]">
          <Image
            src={alianzasImageUrl}
            alt={t("alianzasFotoAlt")}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </Reveal>

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
      </section>
    </div>
  );
}
