"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { setLocale } from "@/server/actions/locale";
import type { Locale } from "@/i18n/request";

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

  // Subrayado dorado en vez de recuadro con relleno: la versión anterior era
  // una caja con el idioma activo sobre dorado sólido, que al lado del serif
  // y del dorado como hairline del resto del sitio (la rayita de
  // SectionHeading, los bordes de las tarjetas) se leía como widget pegado
  // encima, no como parte de la marca.
  //
  // Sigue siendo evidente que es un control — que era el motivo del recuadro,
  // porque buena parte del público es extranjero y cambiar de idioma es de
  // las primeras acciones del sitio: el activo va en marfil pleno con la
  // línea dorada debajo, el inactivo apagado, y al pasar el mouse por el
  // inactivo su propia línea crece desde la izquierda anticipando el cambio.
  const opcion = (value: Locale, label: string) => {
    const activo = locale === value;

    return (
      <button
        type="button"
        onClick={() => cambiar(value)}
        aria-pressed={activo}
        disabled={isPending}
        className={cn(
          "group relative cursor-pointer pb-1.5 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:cursor-wait",
          activo
            ? "text-foreground"
            : "text-foreground/45 hover:text-foreground/85",
        )}
      >
        {label}
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 bottom-0 h-px origin-left bg-gold transition-transform duration-300 ease-out",
            activo ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
            !activo && "bg-gold/40",
          )}
        />
      </button>
    );
  };

  return (
    <div
      role="group"
      aria-label={t("aria")}
      // tracking 0.1em, no más: es el techo que ya se fijó para el texto de
      // 11–12px del sitio (ver la nota de tamaños en SiteButton) — por
      // encima de eso, a este cuerpo se lee espaciado en exceso.
      className="flex items-center gap-2.5 text-[0.75rem] font-medium uppercase tracking-[0.1em]"
    >
      {opcion("es", t("es"))}
      <span aria-hidden className="pb-1.5 text-foreground/20">
        ·
      </span>
      {opcion("en", t("en"))}
    </div>
  );
}
