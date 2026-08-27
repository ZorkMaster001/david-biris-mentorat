import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Analytics } from "@/components/analytics/Analytics";
import { SilkBackground } from "@/components/bg/SilkBackground";
import { BackButton } from "@/components/nav/BackButton";
import { BottomNav } from "@/components/nav/BottomNav";
import { ContactFab } from "@/components/nav/ContactFab";
import { LocaleSwitch } from "@/components/nav/LocaleSwitch";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import {
  CITY,
  KNOWS_ABOUT,
  PRICE_AMOUNT,
  PRICE_CURRENCY,
  PRICE_PERIOD,
  REGION,
} from "@/lib/business";
import { PHONE_E164, instagramUrl } from "@/lib/contact";
import { display, body } from "@/lib/fonts";
import { ID, pageMetadata, webSiteSchema } from "@/lib/seo";
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
    // Titlu, descriere, canonical, hreflang, Open Graph si Twitter, dintr-un singur
    // loc — vezi `lib/seo.ts`. Paginile secundare cheama acelasi ajutor, ca sa nu
    // mai mosteneasca `og:url`-ul paginii de start.
    ...pageMetadata(locale, "", content.meta),
    applicationName: "David Biriș",
    authors: [{ name: "David Biriș", url: absoluteUrl(locale, "despre") }],
    creator: "David Biriș",
    publisher: "David Biriș",
    // Google isi ia limita implicita de fragment din capul lui, iar implicita e
    // scurta. `max-snippet: -1` ridica plafonul, `max-image-preview: large` lasa
    // poza mare in rezultat. Amandoua conteaza pentru rezumatele generate (AI
    // Overviews): ce nu are voie sa fie aratat lung nu are cum sa fie citat lung.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    // Se scrie doar daca exista codul in mediu. O eticheta de verificare goala e
    // o eticheta pe care Search Console o respinge.
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
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
          Cererea de acord si, doar dupa un „da" explicit, Meta Pixel. Fara acord nu
          se incarca `fbevents.js` si nu se pune niciun cookie — vezi
          `components/analytics/Analytics.tsx`. Se randeaza doar cand exista
          `NEXT_PUBLIC_META_PIXEL_ID` in mediu, deci dev-ul si preview-urile raman
          curate si nu intreaba nimic.
        */}
        <Analytics labels={content.consent} />

        {/*
          Entitatile valabile pe tot site-ul: site-ul, persoana, afacerea si
          serviciul, legate intre ele prin `@id`. Fara legaturi, motoarele vad
          entitati fara nicio relatie intre ele si niciuna nu se ancoreaza de om.

          Nodul care descrie *pagina* nu sta aici, ci in fiecare pagina. Cat timp
          statea in layout, fiecare subpagina purta si nodul paginii de start, deci
          /ro/metoda continea doua noduri de pagina, dintre care unul se dadea drept
          alta adresa. Vezi `webPageSchema` din `lib/seo.ts`.

          Adresa are doar localitatea si judetul, si spune de unde lucreaza, nu unde
          vin clientii: mentoratul e doar online, deci raza de actiune sta separat, in
          `areaServed`. Strada, coordonatele si programul lipsesc — vezi TODO(client)
          din `lib/business.ts`. O adresa inventata ar fi mai rea decat una lipsa:
          Google verifica datele locale si o nepotrivire strica increderea in tot restul.
        */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              webSiteSchema(content),
              {
                "@type": "Person",
                "@id": ID.person,
                name: "David Biriș",
                givenName: "David",
                familyName: "Biriș",
                jobTitle: locale === "ro" ? "Antrenor personal" : "Personal trainer",
                description: content.david.body.join(" "),
                knowsAbout: KNOWS_ABOUT,
                knowsLanguage: ["ro", "en"],
                image: `${SITE_URL}/media/img/david-promenade.webp`,
                sameAs: [instagramUrl()],
                url: absoluteUrl(locale, "despre"),
                mainEntityOfPage: { "@id": `${absoluteUrl(locale, "despre")}#webpage` },
                worksFor: { "@id": ID.business },
              },
              {
                "@type": "LocalBusiness",
                "@id": ID.business,
                name: `David Biriș · ${content.business.serviceType}`,
                description: content.meta.description,
                url: absoluteUrl(locale, ""),
                image: `${SITE_URL}/media/img/david-promenade.webp`,
                telephone: `+${PHONE_E164}`,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: CITY,
                  addressRegion: REGION,
                  addressCountry: "RO",
                },
                // Adresa spune de unde lucreaza, `areaServed` spune pe cine
                // serveste. Mentoratul e doar online, deci raza de actiune e tara,
                // nu orasul: un `City` aici ar promite antrenamente fata in fata.
                areaServed: { "@type": "Country", name: content.business.areaServed },
                availableLanguage: ["ro", "en"],
                knowsLanguage: ["ro", "en"],
                priceRange: `${PRICE_AMOUNT} ${PRICE_CURRENCY}`,
                founder: { "@id": ID.person },
                employee: { "@id": ID.person },
                sameAs: [instagramUrl()],
              },
              {
                "@type": "Service",
                "@id": ID.service,
                name: content.business.serviceType,
                description: content.meta.description,
                serviceType: content.business.serviceType,
                provider: { "@id": ID.business },
                // Serviciul se livreaza integral online, deci acopera toata tara.
                // `serviceOutput` si canalul de mai jos spun explicit ca nu exista
                // locatie fizica: fara ele, un motor deduce din adresa afacerii ca
                // antrenamentele se tin acolo.
                areaServed: { "@type": "Country", name: content.business.areaServed },
                availableChannel: {
                  "@type": "ServiceChannel",
                  serviceUrl: absoluteUrl(locale, ""),
                  availableLanguage: ["ro", "en"],
                },
                availableLanguage: ["ro", "en"],
                audience: { "@type": "Audience", audienceType: content.business.audience },
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: content.offer.headline,
                  itemListElement: content.offer.items.map((item) => ({
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: item.label,
                      description: item.detail,
                    },
                  })),
                },
                // Pretul e afisat pe pagina, deci are ce cauta si aici. Cifra vine
                // din `lib/business.ts`, nu din textul tradus: schema cere un numar
                // si un cod ISO, iar un pret care nu se potriveste cu cel de pe
                // pagina e mai rau decat unul lipsa.
                offers: {
                  "@type": "Offer",
                  priceCurrency: PRICE_CURRENCY,
                  price: PRICE_AMOUNT,
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    priceCurrency: PRICE_CURRENCY,
                    price: PRICE_AMOUNT,
                    unitCode: PRICE_PERIOD,
                    billingDuration: 1,
                  },
                  availability: "https://schema.org/InStock",
                  url: absoluteUrl(locale, ""),
                },
              },
            ],
          }}
        />
      </body>
    </html>
  );
}
