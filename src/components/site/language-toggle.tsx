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

  return (
    <div
      role="group"
      aria-label={t("aria")}
      className="flex items-center gap-1 text-[0.7rem] font-medium tracking-[0.08em]"
    >
      <button
        type="button"
        onClick={() => cambiar("es")}
        aria-pressed={locale === "es"}
        disabled={isPending}
        className={cn(
          "px-1.5 py-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-wait",
          locale === "es"
            ? "text-gold"
            : "text-foreground/50 hover:text-foreground",
        )}
      >
        {t("es")}
      </button>
      <span aria-hidden className="text-foreground/30">
        /
      </span>
      <button
        type="button"
        onClick={() => cambiar("en")}
        aria-pressed={locale === "en"}
        disabled={isPending}
        className={cn(
          "px-1.5 py-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-wait",
          locale === "en"
            ? "text-gold"
            : "text-foreground/50 hover:text-foreground",
        )}
      >
        {t("en")}
      </button>
    </div>
  );
}
