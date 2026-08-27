"use client";

import type { Content } from "@/content/types";

/**
 * Cat de sus sta cardul fata de marginea de jos.
 *
 * Randul de butoane lipite (intoarcere in stanga, contact in dreapta) sta la
 * `--spacing-nav + 16px` si are 48px inaltime, deci se termina la 64px. 96px lasa
 * aproape 20px de aer deasupra lui — cifra e masurata, nu ghicita: la 76px marginea de jos
 * a cardului cadea exact peste butonul de intoarcere de pe paginile interioare.
 */
const BOTTOM_OFFSET = "calc(var(--spacing-nav) + env(safe-area-inset-bottom) + 96px)";

interface ConsentBannerProps {
  labels: Content["consent"];
  onChoice: (choice: "granted" | "denied") => void;
}

/**
 * Cardul prin care se cere acordul de masurare.
 *
 * Sta stanga-jos, dar **deasupra** randului de butoane lipite: jos-stanga e deja
 * butonul de intoarcere pe paginile interioare, iar jos-dreapta butonul de contact.
 * Pe telefon se intinde pe toata latimea, de la 640px in sus se stange la latimea
 * unui card.
 *
 * Cele doua butoane arata la fel de apasabil: „Refuz" nu e o legatura mica si gri
 * pusa ca sa fie ignorata. Un refuz mai greu de dat decat un accept nu e acord
 * liber, deci nici nu e acord.
 *
 * `aria-live="polite"` fiindca apare dupa hidratare, nu odata cu pagina: fara el,
 * un cititor de ecran care a terminat deja de anuntat pagina n-ar mai spune nimic
 * despre el.
 */
export function ConsentBanner({ labels, onChoice }: ConsentBannerProps) {
  return (
    <div
      role="region"
      aria-live="polite"
      aria-label={labels.title}
      className="consent-card fixed left-4 right-4 z-50 rounded-2xl border border-hairline bg-ink-raised/95 p-5 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:right-auto sm:max-w-[25rem]"
      style={{ bottom: BOTTOM_OFFSET }}
    >
      <p className="font-display text-base tracking-[0.03em]">{labels.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-bone-dim">{labels.body}</p>
      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={() => onChoice("granted")}
          className="min-h-[44px] flex-1 rounded-full bg-signal px-4 font-display text-sm tracking-[0.04em] text-ink transition-opacity duration-200 ease-[var(--ease-out-expo)] hover:opacity-90"
        >
          {labels.accept}
        </button>
        <button
          type="button"
          onClick={() => onChoice("denied")}
          className="min-h-[44px] flex-1 rounded-full border border-hairline px-4 font-display text-sm tracking-[0.04em] transition-colors duration-200 ease-[var(--ease-out-expo)] hover:border-bone/40 hover:bg-bone/5"
        >
          {labels.reject}
        </button>
      </div>
    </div>
  );
}
