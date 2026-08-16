import { DEFAULT_LOCALE, type Locale } from "@/content/types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://david-biris.vercel.app";

export const ROUTES = ["", "metoda", "rezultate", "despre"] as const;
export type RouteKey = (typeof ROUTES)[number];

export function localePath(locale: Locale, route: RouteKey): string {
  return route === "" ? `/${locale}` : `/${locale}/${route}`;
}

export function absoluteUrl(locale: Locale, route: RouteKey): string {
  return `${SITE_URL}${localePath(locale, route)}`;
}

export { DEFAULT_LOCALE };
