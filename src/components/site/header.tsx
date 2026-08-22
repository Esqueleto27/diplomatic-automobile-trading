"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site";
import { Wordmark } from "@/components/site/wordmark";
import { LanguageToggle } from "@/components/site/language-toggle";

export function SiteHeader() {
  const t = useTranslations("header");
  const tNav = useTranslations("nav");
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Progreso de lectura de la página, para el hilo dorado del borde inferior
  // del header (ver más abajo). `useScroll` sin target mide el documento
  // entero; `scaleX` sobre una barra de 1px es de las poquísimas animaciones
  // que el navegador resuelve en la GPU sin recalcular layout, así que puede
  // seguir al scroll cuadro a cuadro sin costo.
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // Histéresis a propósito: el header cambia de alto (h-20 → h-16, 16px)
    // al activar "scrolled". Con un solo umbral, ese cambio de alto dispara
    // scroll anchoring del navegador (reacomoda scrollY para no mover el
    // contenido visualmente), lo que cruza el mismo umbral en sentido
    // contrario y vuelve a disparar el evento — bucle infinito que se ve
    // como temblor. Con dos umbrales separados (más que la diferencia de
    // alto) ese reacomodo nunca alcanza a cruzar el umbral opuesto.
    const onScroll = () => {
      setScrolled((prev) => {
        if (window.scrollY > 64) return true;
        if (window.scrollY < 16) return false;
        return prev;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú al cambiar de página (evita quedarse abierto tras
  // navegar por teclado o back/forward).
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  useEffect(() => {
    if (!abierto) return;

    // Bloquea el scroll del body mientras el panel a pantalla completa está
    // abierto — si no, el visitante puede arrastrar la página de fondo por
    // detrás del menú.
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [abierto]);

  return (
    <>
      <header
        className={cn(
          // Sólo el alto se anima acá. El fondo vive en dos capas hermanas
          // (abajo) que se cruzan por opacidad en vez de intercambiarse.
          "fixed inset-x-0 top-0 z-50 transition-[height] duration-300 ease-out",
          scrolled ? "h-20" : "h-24",
        )}
      >
        {/* Dos capas de fondo superpuestas que hacen cross-fade, en vez de
            cambiar las clases de fondo del propio header.
            `background-image` (el degradado sobre el hero) no es animable:
            al cruzar el umbral de scroll desaparecía de golpe mientras el
            color sólido recién empezaba a aparecer, y eso es el parpadeo que
            se veía al empezar a bajar en el teléfono. Dos capas con
            `transition-opacity` sí se funden, y de paso el desenfoque deja
            de animarse (animar `backdrop-filter` es de lo más caro que hay
            en un móvil y entrecortaba el scroll). */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ease-out",
            scrolled || abierto ? "opacity-0" : "opacity-100",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 border-b border-border shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)] backdrop-blur-md transition-[opacity,background-color] duration-300 ease-out",
            scrolled || abierto ? "opacity-100" : "opacity-0",
            // Con el menú abierto arriba del hero, la franja translúcida
            // dejaba ver la foto justo encima de un panel opaco.
            abierto ? "bg-background" : "bg-background/85",
          )}
        />
        {/* Hilo dorado de progreso pegado al canto inferior del header.
            Aparece sólo cuando el header ya está sólido (arriba del todo el
            progreso es cero y sería una línea invisible de todas formas).
            Es el único elemento del sitio que reacciona al scroll de forma
            continua: da la sensación de instrumento, no de página. */}
        <motion.span
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className={cn(
            "absolute inset-x-0 bottom-0 -z-10 h-px origin-left bg-gradient-to-r from-gold via-gold-strong to-gold transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Dos columnas en móvil, tres desde lg. El nav del medio es
            `hidden lg:flex`, o sea `display:none` en móvil — y un ítem con
            display:none desaparece del grid por completo. Con tres columnas
            fijas, el botón del menú caía en la columna 2 (`auto`) y quedaba
            flotando en el centro de la pantalla con la tercera columna vacía
            a su derecha. */}
        <div className="mx-auto grid h-full max-w-site grid-cols-[1fr_auto] items-center gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          <Link
            href="/"
            aria-label={t("inicio")}
            className="justify-self-start outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <Wordmark
              priority
              imgClassName={cn(
                "w-auto transition-[height] duration-300",
                // Navbar agrandado a pedido del cliente (antes h-7/h-9).
                scrolled ? "h-9" : "h-11",
              )}
            />
          </Link>

          <nav
            className="hidden items-center gap-10 lg:flex"
            aria-label={t("menuPrincipal")}
          >
            {navLinks.map((link) => {
              const activo =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "group/nav relative py-1 text-base font-medium uppercase tracking-[0.08em] outline-none transition-colors duration-300",
                    "focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                    activo
                      ? "text-foreground"
                      : "text-foreground/60 hover:text-foreground",
                  )}
                >
                  {tNav(link.key)}
                  {/* Subrayado que crece desde la izquierda, en vez del
                      puntito que marcaba la página activa. Un punto no
                      responde al mouse: el link no daba ninguna señal hasta
                      que cambiaba de color. Acá el mismo trazo sirve para
                      las dos cosas — fijo si estás en esa página, dibujado
                      al pasar por encima si no. Se anima `scale-x` y no
                      `width` porque scale no recalcula layout. */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-500 ease-out",
                      activo
                        ? "scale-x-100"
                        : "scale-x-0 group-hover/nav:scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-4 sm:gap-5">
            <LanguageToggle />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? t("cerrarMenu") : t("abrirMenu")}
              className="-mr-2 grid size-11 place-items-center text-foreground outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
            >
              {abierto ? <X className="size-7" /> : <Menu className="size-7" />}
            </button>
          </div>
        </div>
      </header>

      {/* Panel a pantalla completa, no un dropdown chico: con el header fijo
          y transparente sobre el hero, un menú angosto se perdía contra la
          foto. Arranca justo debajo de la franja del header (misma altura
          que tiene en ese momento) y cubre el resto del viewport.

          Va como hermano del <header>, no adentro: el header lleva
          `backdrop-blur` cuando está sólido, y un filtro CSS convierte al
          elemento en bloque contenedor de sus descendientes `fixed`. Estando
          adentro, `inset-x-0 bottom-0 top-20` se resolvía contra la franja de
          80px del header en vez de contra la ventana y el panel quedaba de
          alto 0 — el menú no se abría después de scrollear. */}
      <div
        id="menu-movil"
        role="dialog"
        aria-modal="true"
        aria-label={t("menuDialogo")}
        hidden={!abierto}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 flex flex-col overflow-y-auto bg-background transition-[top] duration-300 ease-out lg:hidden",
          scrolled ? "top-20" : "top-24",
        )}
      >
        <nav
          className="flex flex-1 flex-col justify-center gap-2 px-6"
          aria-label={t("menuPrincipalMovil")}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setAbierto(false)}
              className="border-b border-border/60 py-5 text-[1.375rem] font-medium uppercase tracking-[0.04em] text-foreground/85 outline-none transition-colors last:border-b-0 hover:text-gold focus-visible:text-gold"
            >
              {tNav(link.key)}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
