"use client";

import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/types";
import { localePath } from "@/lib/site";
import { isActiveTab } from "./navigation";

/**
 * Buton lipit deasupra barei de jos, care apare doar cand esti pe o pagina
 * interioara. Stanga jos, la aceeasi inaltime cu butonul de contact din dreapta:
 * cele doua se echilibreaza, in loc sa stea unul peste altul.
 *
 * Duce la pagina principala a limbii curente, nu `history.back()`. Site-ul are
 * patru pagini si o bara de navigare permanenta, deci „inapoi" inseamna aici
 * intoarcerea la pagina de start. `history.back()` ar fi scos omul de pe site cu
 * totul daca a aterizat direct pe /metoda dintr-o cautare.
 *
 * E `Link`, nu buton: merge fara JavaScript, si click cu ctrl sau cu rotita
 * deschide in tab nou ca orice legatura.
 */
export function BackButton({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  if (isActiveTab(pathname, locale, "")) return null;

  return (
    <Link
      href={localePath(locale, "")}
      className="back-button group fixed left-4 z-50 flex min-h-[48px] items-center gap-2.5 rounded-full border border-hairline bg-ink-raised/90 py-2 pl-2 pr-5 backdrop-blur-xl transition-colors duration-200 ease-[var(--ease-out-expo)] hover:border-signal/50"
      style={{ bottom: "calc(var(--spacing-nav) + env(safe-area-inset-bottom) + 16px)" }}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal text-ink transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:-translate-x-0.5">
        <ArrowLeft size={17} weight="bold" aria-hidden="true" />
      </span>
      <span className="font-display text-sm tracking-[0.06em]">{label}</span>
    </Link>
  );
}
