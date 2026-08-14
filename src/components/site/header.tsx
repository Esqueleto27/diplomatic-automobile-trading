"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site";
import { Wordmark } from "@/components/site/wordmark";

export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,height,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "h-16 border-b border-border bg-background/85 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)] backdrop-blur-md"
          : "h-20 bg-gradient-to-b from-black/70 to-transparent",
      )}
    >
      <div className="mx-auto grid h-full max-w-site grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Diplomatic Automobile Trading — Inicio"
          className="justify-self-start outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <Wordmark
            priority
            imgClassName={cn(
              "w-auto transition-[height] duration-300",
              // ~10% más chico que antes (h-8/h-10) — feedback del cliente:
              // un logo levemente más chico se lee más refinado.
              scrolled ? "h-7" : "h-9",
            )}
          />
        </Link>

        <nav
          className="hidden items-center gap-9 lg:flex"
          aria-label="Principal"
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
                  "relative py-1 text-[0.9rem] font-medium uppercase tracking-[0.08em] outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                  activo
                    ? "text-foreground"
                    : "text-foreground/60 hover:text-foreground",
                )}
              >
                {link.label}
                {activo && (
                  <span
                    aria-hidden
                    className="absolute -bottom-2 left-1/2 size-1 -translate-x-1/2 rounded-full bg-gold"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-5">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className="-mr-2 grid size-10 place-items-center text-foreground outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
          >
            {abierto ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Panel a pantalla completa, no un dropdown chico: con el header fijo
          y transparente sobre el hero, un menú angosto se perdía contra la
          foto. Arranca justo debajo de la franja del header (misma altura
          que tiene en ese momento) y cubre el resto del viewport. */}
      <div
        id="menu-movil"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        hidden={!abierto}
        className={cn(
          "fixed inset-x-0 bottom-0 flex flex-col overflow-y-auto bg-background lg:hidden",
          scrolled ? "top-16" : "top-20",
        )}
      >
        <nav
          className="flex flex-1 flex-col justify-center gap-2 px-6"
          aria-label="Principal (móvil)"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setAbierto(false)}
              className="border-b border-border/60 py-5 text-[1.375rem] font-medium uppercase tracking-[0.04em] text-foreground/85 outline-none transition-colors last:border-b-0 hover:text-gold focus-visible:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
