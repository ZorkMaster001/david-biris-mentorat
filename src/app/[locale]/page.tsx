import { notFound } from "next/navigation";
import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/nav/Footer";
import { Balance } from "@/components/sections/Balance";
import { David } from "@/components/sections/David";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { FirstTime } from "@/components/sections/FirstTime";
import { Method } from "@/components/sections/Method";
import { Process } from "@/components/sections/Process";
import { Reel } from "@/components/sections/Reel";
import { Results } from "@/components/sections/Results";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/content";
import { isLocale } from "@/content/types";
import { localePath } from "@/lib/site";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <main>
      <Hero
        headline={content.hero.headline}
        headlineAccent={content.hero.headlineAccent}
        subheadline={content.hero.subheadline}
        ctaPrimary={content.hero.ctaPrimary}
        contact={content.contact}
        ctaSecondary={content.hero.ctaSecondary}
        ctaSecondaryHref={localePath(locale, "metoda")}
        image={content.hero.image}
        imageAlt={content.hero.imageAlt}
      />
      <FirstTime data={content.firstTime} />
      <Balance data={content.balance} />
      <Method data={content.method} />
      <Reel data={content.reel} />
      <David data={content.david} />
      <Results data={content.results} />
      <Process data={content.process} />
      <Faq data={content.faq} />
      <FinalCta data={content.finalCta} contact={content.contact} />
      <Footer data={content.footer} contact={content.contact} business={content.business} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.faq.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
    </main>
  );
}
