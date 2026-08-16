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

  // El idioma activo va con fondo dorado lleno, no sólo con el texto en
  // dorado: buena parte del público es extranjero (cuerpo diplomático,
  // organismos internacionales) y para ellos cambiar de idioma es de las
  // primeras acciones del sitio, no un ajuste secundario. Antes era texto
  // de 11px al 50% de opacidad en la esquina — se perdía contra el header.
  // El recuadro además lo identifica como control y no como dos palabras
  // sueltas del menú.
  const opcion = (value: Locale, label: string) => (
    <button
      type="button"
      onClick={() => cambiar(value)}
      aria-pressed={locale === value}
      disabled={isPending}
      className={cn(
        "px-2.5 py-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-wait",
        locale === value
          ? "bg-gold text-gold-foreground"
          : "text-foreground/75 hover:bg-white/10 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );

  return (
    <div
      role="group"
      aria-label={t("aria")}
      className="flex items-center overflow-hidden border border-white/20 text-[0.78rem] font-medium tracking-[0.08em]"
    >
      {opcion("es", t("es"))}
      {opcion("en", t("en"))}
    </div>
  );
}
