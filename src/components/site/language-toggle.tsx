"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { setLocale } from "@/server/actions/locale";
import type { Locale } from "@/i18n/request";
import { FlagES, FlagUS } from "@/components/site/flag-icons";

const BANDERAS: Record<Locale, typeof FlagES> = { es: FlagES, en: FlagUS };

/**
 * ES/EN en la misma URL (sin /en/...): guarda la elección en cookie
 * (setLocale) y pide un router.refresh() — el árbol de Server Components se
 * re-renderiza con los mensajes nuevos, y como NextIntlClientProvider vive
 * en el layout del sitio (ver SiteLayout), los Client Components debajo
 * (este mismo botón, el menú móvil) también reciben el idioma actualizado.
 */
export function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations("idioma");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function cambiar(next: Locale) {
    if (next === locale || isPending) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  // Bandera en vez de texto ES/EN, a pedido del cliente — el nombre del
  // idioma sigue existiendo como aria-label (accesible), la bandera sola no
  // es una etiqueta suficiente por su cuenta.
  //
  // Tres decisiones para que no desentonen con el resto del sitio, donde
  // todo es marfil, dorado y negro cálido:
  //
  // 1. Sólo la bandera del idioma ACTIVO tiene color; la otra va en gris.
  //    Antes las dos iban a todo color y la inactiva sólo bajaba de
  //    opacidad, así que el rincón del header tenía cuatro colores
  //    saturados compitiendo con el logo. Con una sola en color, además,
  //    el estado se lee de un vistazo en vez de por una diferencia de
  //    opacidad que hay que buscar.
  // 2. Más chicas (20px de alto contra 28px): un selector de idioma es un
  //    control de servicio, no un elemento de marca. Antes pesaban más que
  //    los links del nav.
  // 3. El aro pasa de blanco frío al hairline cálido del tema, y se le suma
  //    un borde interior oscuro: la bandera queda embutida en la página en
  //    vez de pegada encima.
  //
  // El subrayado dorado se queda aunque el color ya distinga el activo: el
  // color por sí solo no puede ser el único indicador de estado.
  const opcion = (value: Locale) => {
    const activo = locale === value;
    const Bandera = BANDERAS[value];

    return (
      <button
        type="button"
        onClick={() => cambiar(value)}
        aria-pressed={activo}
        aria-label={t(value)}
        disabled={isPending}
        className="group relative cursor-pointer p-1 pb-2 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:cursor-wait"
      >
        <Bandera
          className={cn(
            "h-[1.125rem] w-[1.6875rem] rounded-[1px] shadow-[0_0_0_1px_var(--hairline-strong),inset_0_0_0_1px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out sm:h-5 sm:w-[1.875rem]",
            activo
              // `saturate(.85)`: los colores oficiales de bandera son de una
              // viveza que ninguna otra cosa del sitio tiene. Bajarlos un
              // punto los mete en la misma familia sin volverlos otro color.
              ? "[filter:saturate(.85)]"
              : "opacity-45 [filter:grayscale(1)] group-hover:opacity-80 group-hover:[filter:grayscale(.4)_saturate(.85)]",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-1 bottom-0 h-px origin-left bg-gold transition-transform duration-300 ease-out",
            activo ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
            !activo && "bg-gold/40",
          )}
        />
      </button>
    );
  };

  return (
    <div role="group" aria-label={t("aria")} className="flex items-center gap-2">
      {opcion("es")}
      {/* Filete vertical entre las dos: las convierte en un control único
          con dos posiciones, en vez de dos botones sueltos al lado del
          menú. Es el mismo hairline que separa todo lo demás del sitio. */}
      <span aria-hidden className="h-3 w-px bg-hairline-strong" />
      {opcion("en")}
    </div>
  );
}
