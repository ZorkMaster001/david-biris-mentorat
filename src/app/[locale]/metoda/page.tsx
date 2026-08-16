import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/nav/Footer";
import { Method } from "@/components/sections/Method";
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
    title: `${content.method.headline} · ${content.meta.title}`,
    description: content.method.body,
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
        <div className="grid gap-4 sm:grid-cols-3">
          {gallery.map((item) => (
            <figure key={item.src}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={`/media/img/${item.src}.avif`}
                  alt={item.pillar?.angle ?? ""}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm uppercase tracking-wider text-bone-dim">
                {item.pillar?.name}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-12">
          <CtaButton href={whatsappUrl(content.contact.prefilledMessage)} external>
            {content.finalCta.cta}
          </CtaButton>
        </div>
      </Section>
      <Footer locale={locale} data={content.footer} route="metoda" />
    </main>
  );
}
