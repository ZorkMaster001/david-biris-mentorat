import type { MetadataRoute } from "next";
import { LOCALES } from "@/content/types";
import { CONTENT_UPDATED_AT, ROUTES, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // O data fixa, scrisa de mana in `lib/site.ts`, nu `new Date()`.
  //
  // Cat timp era momentul build-ului, fiecare redeploy ii spunea lui Google ca
  // s-au schimbat toate paginile deodata — inclusiv cand se schimbase o culoare.
  // Un `lastmod` care minte nu e doar ignorat: cand incepe sa fie ignorat, e
  // ignorat si atunci cand spune adevarul, deci se pierde tocmai semnalul pentru
  // care exista campul.
  const lastModified = new Date(CONTENT_UPDATED_AT);

  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: absoluteUrl(locale, route),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
      /*
        Fara `alternates.languages` aici, deci fara `xmlns:xhtml` si fara
        `<xhtml:link>` in fisier.

        Hreflang se poate declara in trei feluri — in `<head>`, in anteturi HTTP,
        sau in sitemap — si toate trei sunt echivalente. Site-ul le declara deja
        in `<head>`-ul fiecarei pagini (vezi `languageAlternates` din `lib/seo.ts`),
        cu autoreferinta si reciprocitate. A doua declaratie in sitemap ar spune
        exact acelasi lucru: nu adauga niciun semnal, doar inca un loc care poate
        ajunge sa se contrazica cu primul la o schimbare de rute.

        Varianta din sitemap isi merita locul cand ai zeci de limbi si vrei sa
        scapi paginile de greutatea etichetelor. La doua limbi si opt adrese, nu.
      */
    })),
  );
}
