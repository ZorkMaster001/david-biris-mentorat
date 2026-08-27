/**
 * Meta Pixel — identificatorul contului de reclame.
 *
 * Se citeste din mediu, nu se scrie in cod: ID-ul difera intre contul real si
 * orice test, iar fara variabila pixelul pur si simplu nu se randeaza. Asa `next
 * dev` si preview-urile de pe Vercel nu trimit trafic fals in Events Manager.
 *
 * Ca orice `NEXT_PUBLIC_*`, valoarea se coace in HTML la build, deci trebuie pusa
 * in Vercel **inainte** de deploy — paginile sunt generate static. Vezi
 * `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

declare global {
  interface Window {
    /** Definit de fragmentul Meta; pana se incarca `fbevents.js`, apelurile se pun la coada. */
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Alegerea omului despre masurare. `null` inseamna „inca n-a raspuns" — atunci
 * bannerul e pe ecran si pixelul nu exista in pagina.
 *
 * Nu e o preferinta cosmetica: pana la „granted" nu se incarca `fbevents.js`, nu
 * se pune niciun cookie si nu pleaca niciun eveniment. Asta e diferenta dintre a
 * cere acordul si a-l simula.
 */
export type ConsentChoice = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "consent:meta-pixel";

/**
 * `localStorage`, nu cookie: alegerea trebuie citita de JavaScript pe client, nu
 * trimisa la fiecare cerere. Un cookie ar calatori degeaba cu fiecare poza si ar
 * strica raspunsurile statice din cache-ul CDN-ului.
 *
 * Totul e in `try`: in Safari privat si sub setari care blocheaza datele de site,
 * simpla citire arunca. Cand arunca, raspunsul e `null` — adica „intreaba din
 * nou", nu „are acord".
 */
function readStoredConsent(): ConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

/*
  Alegerea, ca magazin extern citit cu `useSyncExternalStore`.

  Nu e sofisticatie: `localStorage` nu exista la randarea pe server, deci valoarea
  nu poate fi citita in randare fara sa iasa alt HTML pe server decat pe client.
  Varianta „stare initiala goala, citesc in `useEffect`, chem `setState`" face exact
  acelasi lucru, dar printr-o a doua randare in lant — React o si semnaleaza acum
  prin regula `react-hooks/set-state-in-effect`.

  `consentServerSnapshot` raspunde `undefined` = „nu se stie inca". Pe server si in
  randarea de hidratare se foloseste el, deci HTML-ul iese identic; imediat dupa
  hidratare React trece pe instantaneul de pe client si componenta se reaseaza o
  singura data, cu raspunsul adevarat.

  Instantaneul se tine intr-o variabila de modul fiindca `useSyncExternalStore` cere
  o valoare stabila: o citire proaspata din `localStorage` la fiecare apel ar fi
  functionat pentru siruri, dar ar fi ascuns o bucla infinita in ziua in care aici
  s-ar intoarce un obiect.
*/
let snapshot: ConsentChoice | null | undefined;
const listeners = new Set<() => void>();

export function subscribeConsent(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function consentSnapshot(): ConsentChoice | null {
  if (snapshot === undefined) snapshot = readStoredConsent();
  return snapshot;
}

export function consentServerSnapshot(): undefined {
  return undefined;
}

export function setConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Alegerea se aplica oricum in pagina curenta; doar nu supravietuieste
    // reincarcarii. Mai bine asa decat o eroare in fata omului.
  }
  snapshot = choice;
  for (const listener of listeners) listener();
}

export type LeadChannel = "whatsapp" | "instagram";

/**
 * Ce canal de contact reprezinta o legatura — sau `null` daca nu e una.
 *
 * Evenimentul `Lead` se prinde printr-un singur ascultator pe `document`, nu prin
 * `onClick` pe fiecare buton. Legaturile de contact apar in patru locuri diferite
 * (butonul lipit, fereastra de alegere, subsolul, indemnul final), iar subsolul e
 * server component: un `onClick` acolo ar fi obligat toata bucata aia sa plece cu
 * JavaScript catre browser, pentru o singura linie de masurare.
 *
 * Se compara pe gazda, nu pe sirul intreg: legatura de WhatsApp poarta mesajul
 * precompletat in query, iar un `startsWith` pe adresa completa s-ar fi rupt la
 * prima schimbare de text.
 */
export function leadChannel(href: string): LeadChannel | null {
  let host: string;
  try {
    host = new URL(href).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (host === "wa.me" || host === "api.whatsapp.com" || host.endsWith(".whatsapp.com")) {
    return "whatsapp";
  }
  if (host === "instagram.com" || host.endsWith(".instagram.com")) return "instagram";
  return null;
}
