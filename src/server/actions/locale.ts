"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, LOCALES, type Locale } from "@/i18n/request";

/** Guarda el idioma elegido en una cookie de 1 año — sin sesión, sin
 * prefijo de URL: la misma dirección sirve el sitio en español o inglés
 * según lo que haya acá. El toggle llama a esto y hace router.refresh()
 * para que el árbol de Server Components se re-renderice con el idioma
 * nuevo (ver LanguageToggle). */
export async function setLocale(locale: Locale) {
  if (!LOCALES.includes(locale)) return;
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
