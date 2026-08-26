import { DEFAULT_LOCALE, type Locale } from "@/content/types";

/**
 * Originea de la care pleaca tot ce trebuie sa fie absolut: canonical, hreflang,
 * sitemap, `og:url`, `metadataBase` si fiecare `@id` din datele structurate.
 *
 * Valoarea de rezerva e domeniul propriu. `NEXT_PUBLIC_SITE_URL` exista in
 * continuare pentru previzualizarile de pe Vercel, dar se pune **inainte** de
 * build: paginile sunt generate static si adresele se coc in HTML.
 *
 * Cu `www` si fara bara la final, fiindca asa raspunde domeniul in Vercel:
 * `davidbiris.fit` face 308 catre `www.davidbiris.fit`. Pentru Google nu exista
 * nicio diferenta intre cele doua forme — conteaza doar sa fie *una* singura, si
 * ea sa fie cea care raspunde cu 200. Un canonical care arata catre o adresa ce
 * face redirect in alta parte e o contrazicere: motorul urmareste redirectul, dar
 * pana se lamureste ce e canonic pierde crawl si intarzie consolidarea.
 *
 * Daca se muta primary-ul in Vercel pe forma fara `www`, aici e singurul loc de
 * schimbat: canonical, hreflang, sitemap, robots.txt, og:url si fiecare `@id` din
 * datele structurate pleaca toate de aici.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "https://www.davidbiris.fit";

/**
 * Data ultimei modificari de continut, scrisa de mana.
 *
 * Sitemap-ul folosea `new Date()`, adica momentul build-ului: fiecare redeploy
 * ii spunea lui Google ca s-au schimbat toate paginile deodata. Un `lastmod` care
 * minte e ignorat, si odata cu el si cel care nu minte. Se actualizeaza cand se
 * schimba textul paginilor, nu la fiecare deploy.
 *
 * Aceeasi data alimenteaza `dateModified` din datele structurate si randul de
 * actualizare din `llms.txt`. Prospetimea e unul dintre semnalele grele pe care
 * asistentii de cautare le folosesc cand aleg pe cine sa citeze.
 */
export const CONTENT_UPDATED_AT = "2026-08-26";

export const ROUTES = ["", "metoda", "rezultate", "despre"] as const;
export type RouteKey = (typeof ROUTES)[number];

export function localePath(locale: Locale, route: RouteKey): string {
  return route === "" ? `/${locale}` : `/${locale}/${route}`;
}

export function absoluteUrl(locale: Locale, route: RouteKey): string {
  return `${SITE_URL}${localePath(locale, route)}`;
}

export { DEFAULT_LOCALE };
