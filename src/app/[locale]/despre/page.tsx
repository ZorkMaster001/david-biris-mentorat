import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/nav/Footer";
import { David } from "@/components/sections/David";
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
    title: `${content.david.headline} · ${content.meta.title}`,
    description: content.david.body[0] ?? content.meta.description,
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

  const gallery = [
    { src: "hiking-peaks", alt: content.method.pillars[3]?.angle ?? "" },
    { src: "sea-rest", alt: content.method.pillars[2]?.angle ?? "" },
  ];

  return (
    <main>
      <David data={content.david} headingLevel="h1" />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {gallery.map((item) => (
            <div key={item.src} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={`/media/img/${item.src}.avif`}
                alt={item.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-12">
          <CtaButton href={whatsappUrl(content.contact.prefilledMessage)} external>
            {content.finalCta.cta}
          </CtaButton>
        </div>
      </Section>
      <Footer locale={locale} data={content.footer} route="despre" />
    </main>
  );
}
