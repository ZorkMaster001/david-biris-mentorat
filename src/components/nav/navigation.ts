import type { Locale } from "@/content/types";
import type { RouteKey } from "@/lib/site";

export function isActiveTab(pathname: string, locale: Locale, href: RouteKey): boolean {
  const normalized = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const expected = href === "" ? `/${locale}` : `/${locale}/${href}`;
  return normalized === expected;
}
