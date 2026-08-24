import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/nav/Footer";
import { Method } from "@/components/sections/Method";
import { ContactCta } from "@/components/contact/ContactCta";
import { Reveal } from "@/components/ui/Reveal";
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
    title: content.pageMeta.metoda.title,
    description: content.pageMeta.metoda.description,
    alternates: {
      canonical: absoluteUrl(locale, "metoda"),
      languages: {
        ...Object.fromEntries(LOCALES.map((other) => [other, absoluteUrl(other, "metoda")])),
        "x-default": absoluteUrl("ro", "metoda"),
      },
    },
  };
}

export default async function MethodPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  // Textul alternativ e chiar unghiul pilonului: o singura sursa de adevar,
  // tradusa automat in ambele limbi.
  const gallery = [
    { src: "climbing-wall", pillar: content.method.pillars[3] },
    { src: "nutrition-plate", pillar: content.method.pillars[4] },
    { src: "outdoor-summit", pillar: content.method.pillars[1] },
  ];

  return (
    <main>
      <Method data={content.method} headingLevel="h1" />
      <Section>
        {/* Fara legende sub poze: numele pilonilor sunt deja in lista de mai sus, iar
            repetate aici aratau a subtitrari de catalog. Raman doar in `alt`. */}
        <div className="grid gap-4 sm:grid-cols-3">
          {gallery.map((item, index) => (
            <Reveal key={item.src} delay={index * 110}>
              <div className="media-zoom relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={`/media/img/${item.src}.avif`}
                  alt={item.pillar?.angle ?? ""}
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
    </main>
  );
}
