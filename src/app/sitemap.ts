import type { MetadataRoute } from "next";
import { LOCALES } from "@/content/types";
import { languageAlternates } from "@/lib/seo";
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
      // Aceeasi harta de limbi ca in `<head>`. Daca cele doua s-ar contrazice,
      // Google arunca perechea in conflict cu totul — vezi `lib/seo.ts`.
      alternates: { languages: languageAlternates(route) },
    })),
  );
}
