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
  // idioma sigue existiendo como aria-label (accesible) y como texto visual
  // sr-only, la bandera sola no es una etiqueta suficiente por su cuenta.
  // Mismo subrayado dorado de antes bajo la bandera para marcar el activo,
  // ahora con más padding porque la bandera es bastante más grande que el
  // texto que reemplaza.
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
        className={cn(
          "group relative cursor-pointer rounded-sm p-1 pb-2 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:cursor-wait",
          activo
            ? "opacity-100"
            : "opacity-50 hover:opacity-90",
        )}
      >
        <Bandera className="h-6 w-9 rounded-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.15)] sm:h-7 sm:w-10" />
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
    <div role="group" aria-label={t("aria")} className="flex items-center gap-3">
      {opcion("es")}
      {opcion("en")}
    </div>
  );
}
