import Image from "next/image";
import { ContactCta } from "@/components/contact/ContactCta";
import { CtaButton } from "@/components/ui/CtaButton";
import type { Content } from "@/content/types";
import type { CSSProperties } from "react";

interface HeroProps {
  headline: string;
  headlineAccent: string;
  subheadline: string;
  ctaPrimary: string;
  contact: Content["contact"];
  ctaSecondary: string;
  ctaSecondaryHref: string;
  image: string;
  imageAlt: string;
}

/**
 * O singura fotografie, servita ca LCP. Clipurile video au coborat in banda
 * derulanta din `components/reel` — heroul nu porneste nimic la incarcare, deci nu
 * depinde de autoplay, de save-data sau de decodoare video.
 *
 * Miscarea e toata din CSS si toata optionala: apropierea lenta a fotografiei
 * (`hero-image`), intrarea esalonata a textului (`hero-rise`) si sageata de derulare
 * cad odata cu blocul global de `prefers-reduced-motion`. Fara ele heroul e exact
 * aceeasi imagine cu acelasi text, doar nemiscat.
 */
export function Hero({
  headline,
  headlineAccent,
  subheadline,
  ctaPrimary,
  contact,
  ctaSecondary,
  ctaSecondaryHref,
  image,
  imageAlt,
}: HeroProps) {
  return (
    <section className="hero-stage relative h-[100dvh] w-full overflow-hidden">
      {/*
        Fotografia sta intr-un invelis propriu ca sa poata purta doua miscari
        independente: invelisul se stinge la derulare, iar imaginea dinauntru isi
        face apropierea lenta de la incarcare. Pe acelasi element nu s-ar fi putut,
        cele doua au cronologii diferite.
      */}
      <div className="hero-fade-media absolute inset-0">
        <Image
          src={`/media/img/${image}.avif`}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="hero-image object-cover object-[50%_45%]"
        />
        {/* Cerul si valea sunt jumatate din poza, deci degradeul apasa doar jos, sub text. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" />
      </div>

      <div className="hero-fade-text absolute inset-x-0 bottom-0 z-10 px-5 pb-[calc(var(--spacing-nav)+env(safe-area-inset-bottom)+2rem)]">
        <h1 className="hero-rise max-w-[16ch] font-display text-[clamp(2.25rem,8.5vw,5rem)]">
          {headline}{" "}
          {/* A doua propozitie duce promisiunea, deci ea poarta culoarea. */}
          <span className="text-signal">{headlineAccent}</span>
        </h1>

        <p className="hero-rise mt-5 max-w-[42ch] text-base text-bone-dim" style={{ "--hero-delay": "90ms" } as CSSProperties}>
          {subheadline}
        </p>

        <div
          className="hero-rise mt-7 flex flex-col gap-3 sm:flex-row"
          style={{ "--hero-delay": "180ms" } as CSSProperties}
        >
          <ContactCta labels={contact}>{ctaPrimary}</ContactCta>
          <CtaButton href={ctaSecondaryHref} variant="ghost">
            {ctaSecondary}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
