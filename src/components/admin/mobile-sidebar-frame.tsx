"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

/**
 * AdminSidebar es un server component async (consulta mensajes sin leer),
 * así que el estado de apertura/cierre del menú móvil vive acá, envolviendo
 * el contenido ya renderizado en vez de forzar todo el sidebar a "use
 * client". Antes el sidebar era `w-64` fijo siempre visible — en pantallas
 * angostas eso dejaba menos de la mitad del viewport para el contenido; acá
 * pasa a un drawer que se abre con un botón hamburguesa en `< lg`.
 *
 * Se cierra solo al navegar (usePathname) — sin esto, como el layout
 * persiste entre rutas hermanas en el App Router, el drawer quedaba abierto
 * después de tocar un link del menú.
 */
export function MobileSidebarFrame({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  // La traslación fuera de pantalla (`-translate-x-full`) es sólo visual:
  // sin saber si estamos en el breakpoint `lg` (donde el mismo bloque queda
  // siempre visible, estático), no se puede decidir si hace falta sacarlo
  // del orden de tabulación.
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const actualizar = () => setIsDesktop(mql.matches);
    actualizar();
    mql.addEventListener("change", actualizar);
    return () => mql.removeEventListener("change", actualizar);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Mismo tratamiento que el menú móvil del sitio público (ver SiteHeader):
  // bloquea el scroll del fondo y cierra con Escape mientras el drawer está
  // abierto.
  useEffect(() => {
    if (!open) return;

    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Cerrado y fuera de la pantalla ancha: sigue en el DOM (translate-x-full
  // es sólo visual) pero no debe ser alcanzable con Tab ni por lectores de
  // pantalla — antes quedaba tabulable estando "cerrado", llevando el foco a
  // un menú invisible.
  const offscreen = !open && !isDesktop;

  return (
    <>
      <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
        <span className="text-sm font-medium text-sidebar-foreground">
          Panel de administración
        </span>
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent"
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div
        inert={offscreen}
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transform transition-transform duration-200 ease-out lg:static lg:z-auto lg:translate-x-0 lg:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="size-4" aria-hidden />
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
