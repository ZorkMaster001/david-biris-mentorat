"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/content/types";
import { Flag } from "./Flag";

/**
 * Comutatorul de limba sta fixat sus-dreapta, deasupra continutului, ca sa fie
 * gasit imediat: bara de jos e deja plina cu cele patru tabu-ri.
 *
 * Ruta curenta se pastreaza: se schimba doar segmentul de limba din cale, deci
 * cine e pe /ro/metoda ajunge pe /en/metoda, nu pe pagina de start.
 */
export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(ro|en)(?=\/|$)/, "");

  return (
    <div
      aria-label={label}
      className="fixed right-4 top-[calc(env(safe-area-inset-top)+1rem)] z-40 flex items-center gap-0.5 rounded-full border border-hairline bg-ink/70 p-1 backdrop-blur-xl"
    >
      {LOCALES.map((candidate) => {
        const active = candidate === locale;
        return (
          <Link
            key={candidate}
            href={`/${candidate}${rest}`}
            hrefLang={candidate}
            aria-current={active ? "true" : undefined}
            className={`flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs uppercase tracking-wider transition-colors duration-200 ${
              active ? "bg-signal text-ink" : "text-bone-dim hover:text-bone"
            }`}
          >
            <Flag locale={candidate} />
            {candidate}
          </Link>
        );
      })}
    </div>
  );
}
