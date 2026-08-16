import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/nav/Footer";
import { Results } from "@/components/sections/Results";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import { whatsappUrl } from "@/lib/contact";
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
    title: `${content.results.headline} · ${content.meta.title}`,
    description: content.results.headline,
    alternates: {
      canonical: absoluteUrl(locale, "rezultate"),
      languages: {
        ...Object.fromEntries(LOCALES.map((other) => [other, absoluteUrl(other, "rezultate")])),
        "x-default": absoluteUrl("ro", "rezultate"),
      },
    },
  };
}

export default async function ResultsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <main>
      <Results data={content.results} headingLevel="h1" />
      <Section headline={content.finalCta.headline}>
        <p className="mt-6 max-w-[48ch] text-lg text-bone-dim">{content.finalCta.body}</p>
        <div className="mt-8">
          <CtaButton href={whatsappUrl(content.contact.prefilledMessage)} external>
            {content.finalCta.cta}
          </CtaButton>
        </div>
      </Section>
      <Footer locale={locale} data={content.footer} route="rezultate" />
    </main>
  );
}
