import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Transformation } from "@/components/about/Transformation";
import { Footer } from "@/components/nav/Footer";
import { David } from "@/components/sections/David";
import { ContactCta } from "@/components/contact/ContactCta";
import { Section } from "@/components/ui/Section";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import { absoluteUrl } from "@/lib/site";

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
    title: content.pageMeta.despre.title,
    description: content.pageMeta.despre.description,
    alternates: {
      canonical: absoluteUrl(locale, "despre"),
      languages: {
        ...Object.fromEntries(LOCALES.map((other) => [other, absoluteUrl(other, "despre")])),
        "x-default": absoluteUrl("ro", "despre"),
      },
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

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
    </main>
  );
}
