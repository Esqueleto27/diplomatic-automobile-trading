import { useTranslations } from "next-intl";
import { HeroImage } from "@/components/site/hero-image";
import { SiteButton } from "@/components/site/button";

export function Hero() {
  const t = useTranslations("hero");

  return (
    // svh y no dvh: `dvh` es la altura del viewport *en este instante*, que
    // en un teléfono cambia sola mientras se scrollea porque el navegador
    // esconde y muestra su barra de direcciones. Con dvh el hero se estiraba
    // y encogía durante el scroll, empujando todo lo de abajo — se lee como
    // que la página "salta" justo al empezar a bajar. `svh` es la altura con
    // la barra visible: no cambia nunca, así que nada se mueve.
    <section className="relative isolate -mt-24 min-h-[100svh] overflow-hidden sm:min-h-[clamp(34rem,84vh,52rem)]">
      {/* -mt-24 cancela el `pt-24` que el layout del sitio agrega para
          compensar el header `fixed` (ver SiteLayout): así la foto arranca
          en el borde superior real de la ventana, debajo del header
          transparente, en vez de dejar un hueco de fondo sólido arriba. */}
      <HeroImage />

      {/* El velo es direccional en los dos tamaños, y en cada uno apunta a
          donde vive el texto — no es un oscurecido parejo de la foto.

          Móvil: el contenido está anclado abajo (`items-end`, ver más
          abajo), así que el degradado es VERTICAL: arriba apenas 22% para
          que el auto se vea claro y con color, y recién baja a 84% en la
          franja inferior donde caen título, párrafo y botones. Un velo
          plano al 62% (lo que había) apagaba la foto entera para proteger
          un texto que sólo ocupa el tercio de abajo.

          Desktop: el texto vive a la izquierda, así que el degradado es
          HORIZONTAL. Arranca en 72% sobre la columna de texto y se abre a
          transparente pasado el 72% del ancho, dejando el auto limpio. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,.22)_0%,rgba(0,0,0,.28)_30%,rgba(0,0,0,.62)_58%,rgba(0,0,0,.86)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,.72)_0%,rgba(0,0,0,.60)_34%,rgba(0,0,0,.30)_52%,rgba(0,0,0,.08)_72%,transparent_88%)]"
      />

      {/* Fade en el borde inferior para fundir con la página. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent"
      />

      {/* En móvil el contenido se ancla abajo (`items-end` + `pb-14`), no al
          centro: con `items-center` en una sección que ahora ocupa toda la
          pantalla (100svh, ver arriba) quedaba mucho aire oscuro parejo
          arriba y abajo del bloque de texto — se sentía "flotando" en vez
          de cinematográfico. Anclado abajo, se ve más foto del auto arriba
          antes de llegar al título, que es el efecto que se buscaba. Desde
          `sm:` se recupera el centrado vertical original. */}
      <div className="mx-auto flex min-h-[100svh] max-w-site items-end px-5 pb-14 pt-24 sm:min-h-[clamp(34rem,84vh,52rem)] sm:items-center sm:px-8 sm:py-24">
        <div className="max-w-xl">
          {/* Breakpoint móvil propio, no el mismo clamp que desktop: en
              ≤640px el título+párrafo+dos botones competían por muy poco
              alto de pantalla (feedback directo del cliente sobre un
              iPhone SE) — acá el tamaño/interlineado bajan de forma fija,
              desde sm: se recupera el clamp original sin tocar nada de
              tablet/desktop para arriba. Segunda ronda de feedback: el
              título todavía se sentía grande ("AUTOMOBILE" tocaba los dos
              bordes) — se bajó un poco más y se le dio más interlineado
              (antes leading-[1], pegado línea con línea). */}
          <h1 className="animate-fade-up-in font-display text-[2.35rem] font-light uppercase leading-[1.15] tracking-[0.01em] sm:text-[clamp(2.2rem,6vw,4.2rem)] sm:leading-[0.88] sm:tracking-[0.02em]">
            Diplomatic
            <br />
            Automobile
            <br />
            Trading
          </h1>

          {/* Un solo texto para todos los tamaños: al acortar el tagline a
              esta frase corta ("A luxury car sales company") ya no hace
              falta la versión "corta" aparte para móvil que existía cuando
              el párrafo era mucho más largo. A pedido del cliente, el mismo
              texto en inglés se usa en las dos versiones del sitio (ES y
              EN) — no es un olvido de traducción, es la frase elegida tal
              cual para ambos idiomas. */}
          {/* Sin `/85`: sobre una foto (no un fondo plano) ese 15% de
              transparencia dejaba el texto lavado — es el único párrafo del
              hero y tiene que leerse de una. */}
          <p
            style={{ animationDelay: "0.1s" }}
            className="animate-fade-up-in mt-5 max-w-[22rem] text-[1.0625rem] leading-[1.55] tracking-wide text-foreground sm:mt-6 sm:max-w-xl sm:text-[1.5rem] sm:leading-relaxed"
          >
            {t("tagline")}
          </p>

          {/* gap-3 (12px) en móvil, no gap-2 (8px): más separación entre
              botones para que se toquen cómodos sin errar de uno a otro. */}
          <div
            style={{ animationDelay: "0.2s" }}
            className="animate-fade-up-in mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4"
          >
            {/* Antes iba a /contacto con "Hablar con un Asesor" — el
                cliente lo cambió por un llamado a explorar los servicios
                primero, no a hablar con alguien de entrada. */}
            <SiteButton
              href="/servicios"
              size="xl"
              className="h-[3.625rem] w-full sm:h-14 sm:w-auto"
            >
              {t("ctaServicios")}
            </SiteButton>
            {/* Fondo/borde más marcados sólo en móvil (bg-black/45,
                border-gold/80): sobre zonas claras de la foto "VER
                INVENTARIO" quedaba casi ilegible con el bg-black/30 +
                border-gold/60 por default del variant outline. Desde `sm:`
                se restaura el contraste original — en desktop ya se leía
                bien según el feedback. */}
            <SiteButton
              href="/inventario"
              size="xl"
              variant="outline"
              className="w-full border-gold/80 bg-black/45 backdrop-blur-sm sm:w-auto sm:border-gold/60 sm:bg-black/30"
            >
              {t("ctaInventario")}
            </SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}
