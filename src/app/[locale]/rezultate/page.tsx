import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/nav/Footer";
import { Results } from "@/components/sections/Results";
import { ContactCta } from "@/components/contact/ContactCta";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import {
  breadcrumbSchema,
  pageMetadata,
  testimonialsSchema,
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

  return pageMetadata(locale, "rezultate", content.pageMeta.rezultate);
}

export default async function ResultsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  const crumb = breadcrumbSchema(locale, "rezultate", content.nav);

  return (
    <main>
      <Results data={content.results} headingLevel="h1" />
      <Section headline={content.finalCta.headline}>
        <p className="mt-6 max-w-[48ch] text-lg text-bone-dim">{content.finalCta.body}</p>
        <div className="mt-8 flex sm:justify-center">
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
              route: "rezultate",
              meta: content.pageMeta.rezultate,
              type: "CollectionPage",
              breadcrumb: crumb,
            }),
            crumb,
            testimonialsSchema(locale, content),
          ],
        }}
      />
    </main>
  );
}
