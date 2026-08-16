export const LOCALES = ["ro", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ro";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export interface HeroSlide {
  id: string;
  word: string;
  video: string;
  poster: string;
  alt: string;
}

export interface Pillar {
  id: string;
  name: string;
  angle: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  note: string | null;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

export interface Step {
  index: string;
  title: string;
  body: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface NavItem {
  href: "" | "metoda" | "rezultate" | "despre";
  label: string;
}

export interface Content {
  meta: {
    title: string;
    description: string;
  };
  nav: NavItem[];
  contact: {
    fabLabel: string;
    whatsappLabel: string;
    instagramLabel: string;
    prefilledMessage: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    prevSlideLabel: string;
    nextSlideLabel: string;
    slides: HeroSlide[];
  };
  firstTime: { eyebrow: string; headline: string; body: string[]; image: string; imageAlt: string };
  balance: {
    headline: string;
    beerCaption: string;
    fastfoodCaption: string;
    closing: string;
  };
  method: { eyebrow: string; headline: string; body: string; pillars: Pillar[] };
  david: { eyebrow: string; headline: string; body: string[]; image: string; imageAlt: string };
  results: { eyebrow: string; headline: string; testimonials: Testimonial[]; beforeLabel: string; afterLabel: string };
  process: { eyebrow: string; headline: string; steps: Step[] };
  faq: { eyebrow: string; headline: string; items: Faq[] };
  finalCta: { headline: string; body: string; cta: string };
  footer: { disclaimer: string; languageLabel: string; rights: string };
}
