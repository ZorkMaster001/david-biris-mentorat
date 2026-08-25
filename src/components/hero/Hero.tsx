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
          /*
            30% pe verticala, nu 45%: pe ecran lat `object-cover` pastreaza din poza
            portret o banda de vreo 35% din inaltime, centrata in punctul asta. La 45%
            banda incepea sub barbie si taia capul. La 30% intra cap, umeri si piept,
            adica exact ce trebuie sa vada omul in prima secunda.
            Pe telefon poza se vede pe toata inaltimea, deci valoarea nu conteaza acolo.
          */
          className="hero-image object-cover object-[50%_30%]"
        />
        {/* Subiectul sta in jumatatea de sus, deci degradeul apasa doar jos, sub text. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" />
      </div>

      {/*
        `hero-copy` duce distantele, nu clasele de aici: pe ecran scund se strang
        toate deodata, ca sa se elibereze fotografia. Vezi `.hero-copy` in globals.css.
      */}
      <div className="hero-fade-text hero-copy absolute inset-x-0 bottom-0 z-10 px-5">
        <h1 className="hero-rise max-w-[16ch] font-display text-[clamp(2.25rem,8.5vw,5rem)]">
          {headline}{" "}
          {/* A doua propozitie duce promisiunea, deci ea poarta accentul: rand
              propriu, aura in culoarea de semnal si linia care se trage sub ea.
              Toate stau in `.hero-accent`, vezi `globals.css`. */}
          <span className="hero-accent">{headlineAccent}</span>
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
