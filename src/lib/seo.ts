import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/content/types";
import type { Content, PageMeta } from "@/content/types";
import { CONTENT_UPDATED_AT, SITE_URL, type RouteKey, absoluteUrl } from "@/lib/site";

/**
 * Identificatorii stabili ai grafului de date structurate.
 *
 * Toate nodurile din site — de pe orice pagina si in orice limba — trimit la
 * *aceleasi* `@id`. Asa vede un motor de cautare o singura persoana, o singura
 * afacere si un singur serviciu, descrise din patru locuri, in loc de patru
 * perechi de entitati fara nicio legatura intre ele. Ancorarea asta e ce leaga
 * numele „David Biriș" de subiectele pe care le acopera; fara ea, fiecare pagina
 * ar fi o insula.
 *
 * Nu poarta limba in `@id` anume: persoana e aceeasi si in romana si in engleza.
 */
export const ID = {
  website: `${SITE_URL}/#website`,
  person: `${SITE_URL}/#david`,
  business: `${SITE_URL}/#business`,
  service: `${SITE_URL}/#mentorat`,
} as const;

export function pageId(locale: Locale, route: RouteKey): string {
  return `${absoluteUrl(locale, route)}#webpage`;
}

function ogLocale(locale: Locale): string {
  return locale === "ro" ? "ro_RO" : "en_US";
}

/**
 * Harta `hreflang` a unei rute, plus `x-default`.
 *
 * Fiecare pagina se enumera si pe sine — cerinta explicita a lui Google: daca
 * pagina lipseste din propriul set, tot setul e ignorat, nu doar intrarea lipsa.
 * `x-default` trimite spre romana, varianta principala, ca sa nu aleaga Google
 * singur pentru cine cauta dintr-o a treia limba.
 */
export function languageAlternates(route: RouteKey): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map((locale) => [locale, absoluteUrl(locale, route)])),
    "x-default": absoluteUrl("ro", route),
  };
}

/**
 * Metadatele complete ale unei pagini: canonical, hreflang, Open Graph si Twitter.
 *
 * Sta intr-un singur loc fiindca metadatele Next se imbina *superficial* intre
 * segmente — vezi `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`,
 * sectiunea „Merging". Cat timp paginile secundare isi puneau doar `title` si
 * `description`, ele mosteneau intreg obiectul `openGraph` al layout-ului, cu tot
 * cu `url`. Adica `/ro/metoda`, `/ro/rezultate` si `/ro/despre` se anuntau toate
 * trei ca fiind pagina principala: orice distribuire pe WhatsApp sau Instagram
 * arata cardul paginii de start, iar motoarele primeau trei adrese care se dau
 * drept una singura.
 */
export function pageMetadata(locale: Locale, route: RouteKey, meta: PageMeta): Metadata {
  const url = absoluteUrl(locale, route);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: languageAlternates(route),
    },
    openGraph: {
      type: "website",
      siteName: "David Biriș",
      locale: ogLocale(locale),
      alternateLocale: LOCALES.filter((other) => other !== locale).map(ogLocale),
      url,
      title: meta.title,
      description: meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

/**
 * Firimiturile de navigare.
 *
 * Google le foloseste ca sa inlocuiasca adresa cruda din rezultat cu o cale
 * citibila, iar asistentii de cautare ca sa inteleaga unde sta pagina in site.
 * Pagina principala nu primeste: un singur nivel nu e o cale.
 */
export function breadcrumbSchema(
  locale: Locale,
  route: Exclude<RouteKey, "">,
  nav: Content["nav"],
): Record<string, unknown> {
  const label = nav.find((item) => item.href === route)?.label ?? route;
  const home = nav.find((item) => item.href === "")?.label ?? "Acasă";
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(locale, route)}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: home, item: absoluteUrl(locale, "") },
      { "@type": "ListItem", position: 2, name: label, item: absoluteUrl(locale, route) },
    ],
  };
}

/**
 * Nodul care descrie pagina ca pagina: ce e, in ce limba, din ce site face parte,
 * despre cine e si cand a fost actualizata ultima data.
 *
 * `dateModified` nu e decor. Cand doua surse spun acelasi lucru, asistentii de
 * cautare o prefera pe cea datata si recenta — iar o pagina fara nicio data
 * pierde in fata uneia care are una, chiar mai slaba.
 *
 * `@type` se schimba dupa natura paginii: `ProfilePage` pentru /despre ii spune
 * unui motor „aici e descrisa o persoana", ceea ce o pagina generica nu spune.
 */
export function webPageSchema({
  locale,
  route,
  meta,
  type = "WebPage",
  breadcrumb,
  primaryImage,
}: {
  locale: Locale;
  route: RouteKey;
  meta: PageMeta;
  type?: "WebPage" | "ProfilePage" | "CollectionPage" | "AboutPage";
  breadcrumb?: Record<string, unknown>;
  primaryImage?: string;
}): Record<string, unknown> {
  return {
    "@type": type,
    "@id": pageId(locale, route),
    url: absoluteUrl(locale, route),
    name: meta.title,
    description: meta.description,
    inLanguage: locale,
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.service },
    // Cine raspunde de continut. Fara asta, E-E-A-T n-are de cine sa se prinda:
    // un text fara autor e un text pe care nu-l garanteaza nimeni.
    author: { "@id": ID.person },
    publisher: { "@id": ID.business },
    dateModified: CONTENT_UPDATED_AT,
    ...(primaryImage ? { primaryImageOfPage: primaryImage } : {}),
    ...(breadcrumb ? { breadcrumb: { "@id": breadcrumb["@id"] } } : {}),
  };
}

/**
 * Site-ul ca entitate, cu limbile in care exista.
 *
 * Lipsea cu totul: existau persoana, afacerea si serviciul, dar nimic care sa
 * spuna „paginile astea sunt acelasi site". `WebPage.isPartOf` are acum unde sa
 * arate, iar cele doua versiuni de limba se leaga una de alta si aici, nu doar
 * prin `hreflang`.
 */
export function webSiteSchema(content: Content): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE_URL,
    name: "David Biriș",
    description: content.meta.description,
    inLanguage: LOCALES.map((value) => value),
    publisher: { "@id": ID.business },
    // Fara `SearchAction`: site-ul nu are cautare interna, iar o actiune
    // declarata care nu exista e o promisiune pe care Google o verifica.
  };
}

/**
 * Cei cinci piloni ai metodei, ca lista ordonata.
 *
 * Nu `HowTo`: pilonii descriu ce acopera mentoratul, nu pasii pe care ii executa
 * cititorul singur acasa. `HowTo` ar fi promis instructiuni de urmat, iar Google
 * oricum a scos rezultatele imbogatite pentru el in 2023 — castigul ar fi fost zero
 * si descrierea falsa. `ItemList` spune exact ce e: o lista cu cinci parti, in
 * ordine, fiecare cu numele si explicatia ei, gata de extras intr-un raspuns.
 */
export function methodListSchema(locale: Locale, content: Content): Record<string, unknown> {
  return {
    "@type": "ItemList",
    "@id": `${absoluteUrl(locale, "metoda")}#metoda`,
    name: content.method.headline,
    description: content.method.body,
    numberOfItems: content.method.pillars.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: content.method.pillars.map((pillar, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: pillar.name,
      description: pillar.angle,
    })),
  };
}

/**
 * Testimonialele, ca recenzii.
 *
 * Intra doar cele care sunt chiar vorbele omului (`attribution === null`). Cel
 * despre fratele lui David e povestit de David, nu spus de Sergiu: pus aici, ar fi
 * fost o recenzie semnata cu numele cuiva care n-a scris-o. Schema.org o numeste
 * recenzie a autorului, iar Google verifica autorul.
 *
 * Fara `aggregateRating` si fara `reviewRating`: nimeni n-a dat note. O medie
 * inventata e exact genul de nepotrivire pentru care Google retrage rezultatele
 * imbogatite pe tot domeniul, nu doar pe pagina.
 */
export function testimonialsSchema(locale: Locale, content: Content): Record<string, unknown> {
  const own = content.results.testimonials.filter((item) => item.attribution === null);
  return {
    "@type": "ItemList",
    "@id": `${absoluteUrl(locale, "rezultate")}#testimoniale`,
    name: content.results.headline,
    numberOfItems: own.length,
    itemListElement: own.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        author: { "@type": "Person", name: item.name },
        reviewBody: item.quote,
        inLanguage: locale,
        itemReviewed: { "@id": ID.service },
      },
    })),
  };
}
