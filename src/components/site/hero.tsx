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

      {/* Sin velo — a pedido explícito del cliente ("no opacar la imagen, me
          gusta así"). Antes había un degradado oscuro detrás del texto para
          contraste; se sacó del todo, así que el contraste del texto
          depende de que esta foto en particular ya sea oscura de por sí. Si
          en el futuro se cambia la foto del hero por una más clara, revisar
          la legibilidad del título/tagline sobre ella. */}

      {/* Fade en el borde inferior para fundir con la página — no es para
          contraste de texto, es para que el corte de la foto no quede una
          línea dura contra el fondo de la página. Se mantiene aparte del
          pedido de arriba. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent"
      />

      {/* Una sola columna, título + tagline + botones apilados — el cliente
          probó la versión en dos columnas (título a la izquierda, tagline y
          botones a la derecha) y pidió volver a tenerlo todo junto, debajo
          del título. Se mantiene igual el anclaje abajo (`items-end`, ver
          nota más abajo). */}
      <div className="mx-auto flex min-h-[100svh] max-w-site items-end px-5 pb-14 pt-24 sm:min-h-[clamp(34rem,84vh,52rem)] sm:pb-16 sm:px-8 sm:pt-24">
        <div className="max-w-xl">
          {/* Breakpoint móvil propio, no el mismo clamp que desktop: en
              ≤640px el título+párrafo+dos botones competían por muy poco
              alto de pantalla (feedback directo del cliente sobre un
              iPhone SE) — acá el tamaño/interlineado bajan de forma fija,
              desde sm: se recupera el clamp original sin tocar nada de
              tablet/desktop para arriba. */}
          <h1 className="animate-fade-up-in font-display text-[2.35rem] font-light uppercase leading-[1.15] tracking-[0.01em] sm:text-[clamp(2.2rem,6vw,4.2rem)] sm:leading-[0.88] sm:tracking-[0.02em]">
            Diplomatic
            <br />
            Automobile
            <br />
            Trading
          </h1>

          {/* A pedido del cliente, el mismo texto en inglés se usa en las
              dos versiones del sitio (ES y EN) — no es un olvido de
              traducción, es la frase elegida tal cual para ambos idiomas. */}
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
                border-gold/60 por default del variant outline. */}
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
