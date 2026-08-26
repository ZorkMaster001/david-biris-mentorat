import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Transformation } from "@/components/about/Transformation";
import { Footer } from "@/components/nav/Footer";
import { David } from "@/components/sections/David";
import { ContactCta } from "@/components/contact/ContactCta";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import { ID, breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

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

  return pageMetadata(locale, "despre", content.pageMeta.despre);
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  const crumb = breadcrumbSchema(locale, "despre", content.nav);

  return (
    <main>
      <David data={content.david} headingLevel="h1" />
      <Section>
        <Transformation
          data={content.david.transformation}
          beforeLabel={content.results.beforeLabel}
          afterLabel={content.results.afterLabel}
        />
        <div className="mt-12 flex sm:justify-center">
          <ContactCta labels={content.contact}>{content.finalCta.cta}</ContactCta>
        </div>
      </Section>
      <Footer data={content.footer} contact={content.contact} business={content.business} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              ...webPageSchema({
                locale,
                route: "despre",
                meta: content.pageMeta.despre,
                type: "ProfilePage",
                breadcrumb: crumb,
              }),
        mainEntity: { "@id": ID.person },
            },
            crumb,
          ],
        }}
      />
    </main>
  );
}
