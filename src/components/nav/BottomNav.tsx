"use client";

import type { Icon } from "@phosphor-icons/react";
import { Barbell, House, TrendUp } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale, NavItem } from "@/content/types";
import { localePath } from "@/lib/site";
import { isActiveTab } from "./navigation";

// „Despre" nu are pictograma: are chipul lui David. Restul tabului e navigatie,
// acela e omul.
const ICONS: Partial<Record<NavItem["href"], Icon>> = {
  "": House,
  metoda: Barbell,
  rezultate: TrendUp,
};

export function BottomNav({ locale, items }: { locale: Locale; items: NavItem[] }) {
  const pathname = usePathname();
  const activeIndex = items.findIndex((item) => isActiveTab(pathname, locale, item.href));

  return (
    <nav
      aria-label={locale === "ro" ? "Navigare principală" : "Main navigation"}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ink/80 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="relative mx-auto w-full max-w-[520px] lg:max-w-[640px]">
        {/*
          Indicatorul e un singur element care aluneca, pozitionat din indexul tabului
          activ. Inainte era o animatie de layout dintr-o biblioteca; o tranzitie CSS
          face acelasi lucru, respecta blocul global de reduced-motion, si nu costa
          niciun kilobyte de JavaScript.
        */}
        {activeIndex >= 0 ? (
          <span
            aria-hidden="true"
            className="absolute top-0 h-[2px] rounded-full bg-signal transition-[left] duration-300 ease-[var(--ease-out-expo)]"
            style={{
              width: `calc(${100 / items.length}% - 2rem)`,
              left: `calc(${(activeIndex * 100) / items.length}% + 1rem)`,
            }}
          />
        ) : null}

        <ul className="flex h-[var(--spacing-nav)] items-stretch justify-around">
          {items.map((item) => {
            const active = isActiveTab(pathname, locale, item.href);
            const IconComponent = ICONS[item.href];
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={localePath(locale, item.href)}
                  aria-current={active ? "page" : undefined}
                  className="flex h-full min-h-[44px] flex-col items-center justify-center gap-1"
                >
                  {IconComponent ? (
                    <IconComponent size={24} weight={active ? "fill" : "regular"} />
                  ) : (
                    <span
                      className={`relative block h-6 w-6 overflow-hidden rounded-full ring-1 transition-colors duration-200 ${
                        active ? "ring-signal" : "ring-bone/25"
                      }`}
                    >
                      <Image
                        src="/media/img/david-avatar.avif"
                        alt=""
                        width={24}
                        height={24}
                        className={`h-full w-full object-cover transition-[filter,opacity] duration-200 ${
                          active ? "" : "opacity-75 grayscale"
                        }`}
                      />
                    </span>
                  )}
                  <span
                    className={`text-[11px] tracking-wide ${active ? "text-bone" : "text-bone-dim"}`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
