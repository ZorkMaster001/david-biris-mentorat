"use client";

import { useSyncExternalStore } from "react";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import type { Content } from "@/content/types";
import {
  META_PIXEL_ID,
  consentServerSnapshot,
  consentSnapshot,
  setConsent,
  subscribeConsent,
} from "@/lib/analytics";

/**
 * Decide daca se masoara ceva si daca se intreaba.
 *
 * Trei stari, nu doua: `undefined` inseamna „inca nu se stie ce a ales", si e
 * starea de pe server si din randarea de hidratare — vezi comentariul de la
 * magazinul de consimtamant din `lib/analytics.ts`. Bannerul apare deci cu o clipa
 * dupa ce pagina s-a asezat, si de asta intra cu o animatie in loc sa pocneasca pe
 * ecran (`.consent-card` din globals.css).
 *
 * Fara `NEXT_PUBLIC_META_PIXEL_ID` nu se intampla nimic: nici pixel, nici banner.
 * N-are rost sa ceri acord pentru o masurare care nu exista — si asa dev-ul si
 * preview-urile raman curate si nu intreaba nimic.
 */
export function Analytics({ labels }: { labels: Content["consent"] }) {
  const consent = useSyncExternalStore(subscribeConsent, consentSnapshot, consentServerSnapshot);

  if (META_PIXEL_ID.length === 0 || consent === undefined) return null;
  if (consent === null) return <ConsentBanner labels={labels} onChoice={setConsent} />;
  if (consent === "denied") return null;
  return <MetaPixel />;
}
