import { DEFAULT_LOCALE, type Locale } from "@/content/types";

/**
 * Originea de la care pleaca tot ce trebuie sa fie absolut: canonical, hreflang,
 * sitemap, `og:url`, `metadataBase` si fiecare `@id` din datele structurate.
 *
 * Valoarea de rezerva e domeniul real de pe Vercel. Cand apare un domeniu propriu,
 * se pune `NEXT_PUBLIC_SITE_URL` in mediu si nu se mai atinge nimic altceva —
 * dar se pune **inainte** de build, fiindca paginile sunt generate static si
 * adresele se coc in HTML.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://david-biris-mentorat.vercel.app";

export const ROUTES = ["", "metoda", "rezultate", "despre"] as const;
export type RouteKey = (typeof ROUTES)[number];

export function localePath(locale: Locale, route: RouteKey): string {
  return route === "" ? `/${locale}` : `/${locale}/${route}`;
}

export function absoluteUrl(locale: Locale, route: RouteKey): string {
  return `${SITE_URL}${localePath(locale, route)}`;
}

export { DEFAULT_LOCALE };
