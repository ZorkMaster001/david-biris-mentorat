import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/nav/BottomNav";
import { ContactFab } from "@/components/nav/ContactFab";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import { instagramUrl } from "@/lib/contact";
import { SITE_URL, absoluteUrl } from "@/lib/site";

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
    <>
      <div className="pb-nav">{children}</div>
      <BottomNav locale={locale} items={content.nav} />
      <ContactFab labels={content.contact} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": `${SITE_URL}/#david`,
              name: "David Biriș",
              jobTitle: locale === "ro" ? "Mentor de fitness" : "Fitness mentor",
              knowsAbout: ["strength training", "nutrition", "boxing", "climbing", "swimming"],
              knowsLanguage: ["ro", "en"],
              // Depinde de INSTAGRAM_HANDLE, inca provizoriu — vezi TODO(client).
              sameAs: [instagramUrl()],
              url: absoluteUrl(locale, ""),
            },
            {
              "@type": "Service",
              "@id": `${SITE_URL}/#mentorat`,
              name: content.meta.title,
              description: content.meta.description,
              serviceType:
                locale === "ro" ? "Mentorat fitness 1-la-1" : "One-on-one fitness mentoring",
              provider: { "@id": `${SITE_URL}/#david` },
              areaServed: "RO",
              availableLanguage: ["ro", "en"],
            },
          ],
        }}
      />
    </>
  );
}
