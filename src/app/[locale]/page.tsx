import { notFound } from "next/navigation";
import { HeroStories } from "@/components/hero/HeroStories";
import { getContent } from "@/content";
import { isLocale } from "@/content/types";
import { whatsappUrl } from "@/lib/contact";
import { localePath } from "@/lib/site";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  return (
    <main>
      <HeroStories
        slides={content.hero.slides}
        headline={content.hero.headline}
        subheadline={content.hero.subheadline}
        ctaPrimary={content.hero.ctaPrimary}
        ctaPrimaryHref={whatsappUrl(content.contact.prefilledMessage)}
        ctaSecondary={content.hero.ctaSecondary}
        ctaSecondaryHref={localePath(locale, "metoda")}
        prevSlideLabel={content.hero.prevSlideLabel}
        nextSlideLabel={content.hero.nextSlideLabel}
      />
    </main>
  );
}
