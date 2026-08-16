import { notFound } from "next/navigation";
import { HeroStories } from "@/components/hero/HeroStories";
import { Footer } from "@/components/nav/Footer";
import { Balance } from "@/components/sections/Balance";
import { David } from "@/components/sections/David";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { FirstTime } from "@/components/sections/FirstTime";
import { Method } from "@/components/sections/Method";
import { Process } from "@/components/sections/Process";
import { Results } from "@/components/sections/Results";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/content";
import { isLocale } from "@/content/types";
import { whatsappUrl } from "@/lib/contact";
import { localePath } from "@/lib/site";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  const contactHref = whatsappUrl(content.contact.prefilledMessage);

  return (
    <main>
      <HeroStories
        slides={content.hero.slides}
        headline={content.hero.headline}
        subheadline={content.hero.subheadline}
        ctaPrimary={content.hero.ctaPrimary}
        ctaPrimaryHref={contactHref}
        ctaSecondary={content.hero.ctaSecondary}
        ctaSecondaryHref={localePath(locale, "metoda")}
        prevSlideLabel={content.hero.prevSlideLabel}
        nextSlideLabel={content.hero.nextSlideLabel}
        pauseLabel={content.hero.pauseLabel}
        resumeLabel={content.hero.resumeLabel}
      />
      <FirstTime data={content.firstTime} />
      <Balance data={content.balance} />
      <Method data={content.method} />
      <David data={content.david} />
      <Results data={content.results} />
      <Process data={content.process} />
      <Faq data={content.faq} />
      <FinalCta data={content.finalCta} href={contactHref} />
      <Footer locale={locale} data={content.footer} route="" />

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
