import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/nav/Footer";
import { Method } from "@/components/sections/Method";
import { ContactCta } from "@/components/contact/ContactCta";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import {
  breadcrumbSchema,
  methodListSchema,
  pageMetadata,
  webPageSchema,
} from "@/lib/seo";

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

  return pageMetadata(locale, "metoda", content.pageMeta.metoda);
}

export default async function MethodPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  const crumb = breadcrumbSchema(locale, "metoda", content.nav);

  return (
    <main>
      <Method data={content.method} headingLevel="h1" />
      <Section>
        {/* Fara legende sub poze: numele pilonilor sunt deja in lista de mai sus, iar
            repetate aici aratau a subtitrari de catalog. Raman doar in `alt`. */}
        <div className="grid gap-4 sm:grid-cols-3">
          {content.method.gallery.map((item, index) => (
            <Reveal key={item.id} delay={index * 110}>
              <div className="media-zoom relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={`/media/img/${item.src}.avif`}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex sm:justify-center">
          <ContactCta labels={content.contact}>{content.finalCta.cta}</ContactCta>
        </div>
      </Section>
      <Footer data={content.footer} contact={content.contact} business={content.business} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            webPageSchema({
              locale,
              route: "metoda",
              meta: content.pageMeta.metoda,
              type: "WebPage",
              breadcrumb: crumb,
            }),
            crumb,
            methodListSchema(locale, content),
          ],
        }}
      />
    </main>
  );
}
