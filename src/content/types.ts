export const LOCALES = ["ro", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ro";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export interface ReelClip {
  id: string;
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

export interface OfferItem {
  /**
   * Si cheia dupa care `sections/Offer` isi alege pictograma. Pictogramele nu stau in
   * continut: sunt desen, nu text, si n-au ce cauta intr-un fisier care se traduce.
   * Un `id` nou fara pereche in harta de acolo ramane pur si simplu fara pictograma.
   */
  id: string;
  label: string;
  detail: string;
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

export interface PageMeta {
  title: string;
  description: string;
}

export interface Content {
  meta: PageMeta;
  /**
   * Titlurile si descrierile paginilor secundare. Stau explicit aici, nu se
   * compun din titlul sectiunii plus numele site-ului: asa ieseau peste 60 de
   * caractere si Google le taia exact acolo unde erau cuvintele care conteaza.
   */
  pageMeta: {
    metoda: PageMeta;
    rezultate: PageMeta;
    despre: PageMeta;
  };
  /**
   * Datele care descriu afacerea pentru motoarele de cautare si pentru subsol.
   * Orasul in sine sta in `lib/business.ts`, ca sa fie acelasi in ambele limbi.
   */
  business: {
    serviceType: string;
    areaServed: string;
    audience: string;
    /** Randul vizibil din subsol. Orasul trebuie sa apara si in text, nu doar in schema. */
    locationLine: string;
  };
  nav: NavItem[];
  /** Eticheta butonului lipit care duce inapoi la pagina principala. */
  backLabel: string;
  contact: {
    fabLabel: string;
    whatsappLabel: string;
    instagramLabel: string;
    prefilledMessage: string;
    /** Fereastra de alegere care se deschide din butoanele mari de contact. */
    pickerTitle: string;
    pickerBody: string;
    whatsappNote: string;
    instagramNote: string;
    closeLabel: string;
  };
  hero: {
    headline: string;
    /**
     * A doua propozitie din titlu, scrisa in culoarea de accent. Sta separat, nu
     * taiata din `headline` la randare: o impartire dupa punct s-ar fi rupt la
     * prima schimbare de text sau la o limba noua. Amandoua intra in acelasi `h1`.
     */
    headlineAccent: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    image: string;
    imageAlt: string;
  };
  /**
   * Lista concreta cu ce primeste omul, asezata imediat sub hero. Vizitatorul venit
   * din TikTok pleaca daca nu intelege in primele secunde ce cumpara, iar restul
   * paginii vinde senzatia — asta e singurul loc unde scrie negru pe alb ce contine
   * mentoratul. `closing` e beneficiul final, nu inca un serviciu: de aceea sta in
   * camp separat si se randeaza mai luminos decat lista.
   */
  offer: {
    headline: string;
    body: string;
    items: OfferItem[];
    /** Eticheta mica de deasupra concluziei, in culoarea de accent. */
    closingLabel: string;
    closing: string;
  };
  firstTime: { headline: string; body: string[]; image: string; imageAlt: string };
  balance: {
    headline: string;
    beerCaption: string;
    fastfoodCaption: string;
    closing: string;
  };
  method: {
    headline: string;
    body: string;
    pillars: Pillar[];
    /** Fotografiile de pe /metoda. Textul alternativ nu se mai imprumuta de la piloni. */
    gallery: { id: string; src: string; alt: string }[];
  };
  reel: {
    headline: string;
    /**
     * Clipurile sunt dovada ca David face el insusi sporturile alea, nu un meniu de
     * lucruri pe care le preda. Randul asta spune diferenta, ca sa nu ramana ambigua.
     */
    body: string;
    pauseLabel: string;
    resumeLabel: string;
    clips: ReelClip[];
  };
  david: {
    headline: string;
    body: string[];
    image: string;
    imageAlt: string;
    /**
     * Transformarea lui, pe /despre. Etichetele nu se repeta aici: sunt aceleasi
     * cuvinte ca la testimoniale, deci vin din `results.beforeLabel` / `afterLabel`.
     */
    transformation: {
      headline: string;
      beforeSrc: string;
      afterSrc: string;
      beforeAlt: string;
      afterAlt: string;
    };
  };
  results: {
    headline: string;
    testimonials: Testimonial[];
    beforeLabel: string;
    afterLabel: string;
    quoteOpen: string;
    quoteClose: string;
  };
  process: { headline: string; steps: Step[] };
  faq: { headline: string; items: Faq[] };
  finalCta: { headline: string; body: string; cta: string };
  footer: {
    disclaimer: string;
    languageLabel: string;
    rights: string;
    /** Eticheta de deasupra legaturilor de contact din subsol. */
    contactLabel: string;
    /** Semnatura mare de la baza paginii. */
    wordmark: string;
  };
}
