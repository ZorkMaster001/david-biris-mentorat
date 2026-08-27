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
  /**
   * Si cheia dupa care `results/BeforeAfter` isi alege fotografiile. Pozele nu mai
   * stau in continut ca nume de fisier: sunt importate din `src/media/testimonials`,
   * ca sa treaca prin bundler si sa iasa la o adresa cu amprenta in loc de una curata
   * si ghicibila sub `/media/img`. Textul alternativ ramane aici — ala se traduce.
   */
  id: string;
  name: string;
  /** Textul de sub fotografii. Cine il spune se decide din `attribution`. */
  quote: string;
  /**
   * Cine vorbeste. `null` inseamna ca `quote` sunt chiar vorbele omului, deci se
   * randeaza intre ghilimele. Un text aici inseamna ca vorbeste altcineva despre el —
   * la fratele lui David nu exista un citat primit, iar a-i pune vorbe in gura ar fi
   * insemnat sa inventam un testimonial. Atunci ghilimelele dispar si sub text apare
   * cine a spus-o.
   */
  attribution: string | null;
  note: string | null;
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
    /**
     * Randul vizibil din subsol. Nu numeste orasul: mentoratul e 100% online, iar
     * pentru cineva care citeste subsolul „din Targu Mures” nu spune nimic despre
     * ce cumpara — mai rau, sugereaza ca trebuie sa fie prin zona. Orasul ramane
     * unde conteaza: in `LocalBusiness` din layout si in `llms.txt`, ca adresa de
     * la care lucreaza David, nu ca loc al antrenamentelor.
     */
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
  /**
   * Pretul, scris pe pagina. Nu sta langa lista de servicii din `offer`, ci in
   * treimea de jos, dupa ce omul a citit ce primeste si a vazut ca a functionat la
   * altii: acolo intrebarea „cat costa?” e deja pusa, iar un pret ascuns o amana
   * pana pe WhatsApp — si cine nu scrie pleaca fara raspuns.
   *
   * Cifrele pentru datele structurate stau in `lib/business.ts`, nu se citesc din
   * textele de mai jos: schema are nevoie de un numar si de un cod ISO, care nu se
   * traduc. Cand se schimba pretul, se schimba in amandoua locurile — un pret
   * afisat diferit de cel din schema e o nepotrivire pe care Google o vede.
   */
  pricing: {
    headline: string;
    /** Numele pachetului, deasupra sumei. */
    planLabel: string;
    /** Suma cu moneda, asa cum se citeste: „299 lei”. */
    amount: string;
    /** Perioada, tinuta separat ca sa se randeze mai mic langa suma. */
    period: string;
    /** Eticheta de lansare, pe fundal de accent. */
    launchLabel: string;
    /** Ce se intampla dupa ce se ocupa locurile. */
    launchNote: string;
    /**
     * Suma impartita la zi. Nu e o justificare a pretului, ci o schimbare de unitate:
     * de aceea sta separat de suma si se randeza discret, nu ca argument de vanzare.
     */
    perDay: string;
    includesLabel: string;
    includes: string[];
    cta: string;
    /** Randul de sub buton: ce se intampla dupa ce scrie. */
    ctaNote: string;
    /** Promisiunea ca pretul de lansare nu creste sub primii clienti. */
    lockNote: string;
  };
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
  /**
   * Cardul prin care se cere acordul pentru Meta Pixel. Textul spune ce se
   * masoara si ce se intampla la refuz: „cookie-uri, ca sa fie mai bine" nu e
   * informare, iar un acord dat fara sa stii pentru ce nu e acord.
   *
   * Apare doar cand exista `NEXT_PUBLIC_META_PIXEL_ID` in mediu — vezi
   * `components/analytics/Analytics.tsx`.
   */
  consent: {
    title: string;
    body: string;
    accept: string;
    /** La fel de vizibil ca `accept`. Un refuz mai greu de dat nu e acord liber. */
    reject: string;
  };
}
