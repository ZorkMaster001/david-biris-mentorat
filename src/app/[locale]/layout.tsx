import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SilkBackground } from "@/components/bg/SilkBackground";
import { BackButton } from "@/components/nav/BackButton";
import { BottomNav } from "@/components/nav/BottomNav";
import { ContactFab } from "@/components/nav/ContactFab";
import { LocaleSwitch } from "@/components/nav/LocaleSwitch";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import { CITY, KNOWS_ABOUT, REGION } from "@/lib/business";
import { PHONE_E164, instagramUrl } from "@/lib/contact";
import { display, body } from "@/lib/fonts";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getContent(locale);
  return {
    // Fara asta, Next construieste og:image relativ la localhost si previzualizarile
    // din WhatsApp si Instagram raman goale in productie.
    metadataBase: new URL(SITE_URL),
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: absoluteUrl(locale, ""),
      languages: {
        ro: absoluteUrl("ro", ""),
        en: absoluteUrl("en", ""),
        "x-default": absoluteUrl("ro", ""),
      },
    },
    // `og:locale` si `og:type` lipseau cu totul. Fara ele, retelele si motoarele
    // ghicesc limba previzualizarii dupa continut, iar pagina romaneasca aparea des
    // marcata ca engleza.
    openGraph: {
      type: "website",
      siteName: "David Biriș",
      locale: locale === "ro" ? "ro_RO" : "en_US",
      alternateLocale: locale === "ro" ? "en_US" : "ro_RO",
      url: absoluteUrl(locale, ""),
      title: content.meta.title,
      description: content.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  return (
    /*
      Layout-ul radacina sta chiar aici, sub segmentul dinamic, ca sa poata pune
      limba paginii pe `<html>`. Cat timp era la `app/layout.tsx`, `lang` era fixat
      pe „ro" si paginile englezesti se serveau marcate ca romanesti — iar Google
      citeste tocmai `<html lang>` cand potriveste versiunile de limba intre ele.
      Vezi `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`.
    */
    <html lang={locale} className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/*
          Marcheaza ca JavaScript ruleaza, inainte ca `<body>` sa fie desenat. Doar
          sub clasa asta se ascund elementele care asteapta sa intre la scroll, deci
          fara JavaScript — sau pentru un crawler care nu executa nimic — continutul
          e pur si simplu vizibil, nu blocat la opacitate zero.
          Trebuie sa fie blocant si inline: un script amanat ar rula dupa prima
          desenare si s-ar vedea continutul aparand si disparand.
        */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }}
        />
      </head>
      <body>
        <SilkBackground />
        <div className="pb-nav">{children}</div>
        <LocaleSwitch locale={locale} label={content.footer.languageLabel} />
        <BackButton locale={locale} label={content.backLabel} />
        <ScrollProgress />
        <BottomNav locale={locale} items={content.nav} />
        <ContactFab labels={content.contact} />

        {/*
          Un singur graf pentru toata pagina: persoana, afacerea locala si serviciul,
          legate prin `@id`. Fara legaturi, motoarele vad trei entitati fara nicio
          relatie intre ele si niciuna nu se ancoreaza de oras.

          Adresa are doar localitatea si judetul. Strada, coordonatele si programul
          lipsesc pentru ca nu le stim — vezi TODO(client) din `lib/business.ts`.
          O adresa inventata ar fi mai rea decat una lipsa: Google verifica datele
          locale si o nepotrivire strica increderea in tot restul.
        */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": `${SITE_URL}/#david`,
                name: "David Biriș",
                givenName: "David",
                familyName: "Biriș",
                jobTitle: locale === "ro" ? "Antrenor personal" : "Personal trainer",
                description: content.david.body.join(" "),
                knowsAbout: KNOWS_ABOUT,
                knowsLanguage: ["ro", "en"],
                image: `${SITE_URL}/media/img/david-formal.webp`,
                sameAs: [instagramUrl()],
                url: absoluteUrl(locale, "despre"),
                worksFor: { "@id": `${SITE_URL}/#business` },
              },
              {
                "@type": "LocalBusiness",
                "@id": `${SITE_URL}/#business`,
                name: `David Biriș · ${content.business.serviceType}`,
                description: content.meta.description,
                url: absoluteUrl(locale, ""),
                image: `${SITE_URL}/media/img/david-formal.webp`,
                telephone: `+${PHONE_E164}`,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: CITY,
                  addressRegion: REGION,
                  addressCountry: "RO",
                },
                areaServed: [
                  { "@type": "City", name: CITY },
                  { "@type": "AdministrativeArea", name: content.business.areaServed },
                ],
                availableLanguage: ["ro", "en"],
                knowsLanguage: ["ro", "en"],
                founder: { "@id": `${SITE_URL}/#david` },
                employee: { "@id": `${SITE_URL}/#david` },
                sameAs: [instagramUrl()],
              },
              {
                "@type": "Service",
                "@id": `${SITE_URL}/#mentorat`,
                name: content.business.serviceType,
                description: content.meta.description,
                serviceType: content.business.serviceType,
                provider: { "@id": `${SITE_URL}/#business` },
                areaServed: { "@type": "City", name: CITY },
                availableLanguage: ["ro", "en"],
                audience: { "@type": "Audience", audienceType: content.business.audience },
              },
            ],
          }}
        />
      </body>
    </html>
  );
}
