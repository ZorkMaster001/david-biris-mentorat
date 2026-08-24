import type { MetadataRoute } from "next";
import { LOCALES } from "@/content/types";
import { DEFAULT_LOCALE, ROUTES, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: absoluteUrl(locale, route),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(LOCALES.map((other) => [other, absoluteUrl(other, route)])),
          // Fara `x-default`, cine cauta dintr-o a treia limba nu are catre ce sa fie
          // trimis si Google alege singur. Romana e varianta principala.
          "x-default": absoluteUrl(DEFAULT_LOCALE, route),
        },
      },
    })),
  );
}
