"use client";

import type { Icon } from "@phosphor-icons/react";
import { Barbell, House, TrendUp, User } from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale, NavItem } from "@/content/types";
import { localePath } from "@/lib/site";
import { isActiveTab } from "./navigation";

const ICONS: Record<NavItem["href"], Icon> = {
  "": House,
  metoda: Barbell,
  rezultate: TrendUp,
  despre: User,
};

export function BottomNav({ locale, items }: { locale: Locale; items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={locale === "ro" ? "Navigare principală" : "Main navigation"}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ink/80 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex h-[var(--spacing-nav)] w-full max-w-[520px] items-stretch justify-around lg:max-w-[640px]">
        {items.map((item) => {
          const active = isActiveTab(pathname, locale, item.href);
          const IconComponent = ICONS[item.href];
          return (
            <li key={item.href} className="relative flex-1">
              <Link
                href={localePath(locale, item.href)}
                aria-current={active ? "page" : undefined}
                className="flex h-full min-h-[44px] flex-col items-center justify-center gap-1"
              >
                <IconComponent size={24} weight={active ? "fill" : "regular"} />
                <span
                  className={`text-[11px] tracking-wide ${active ? "text-bone" : "text-bone-dim"}`}
                >
                  {item.label}
                </span>
              </Link>
              {active ? (
                <motion.span
                  layoutId="tab-indicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-x-4 top-0 h-[2px] rounded-full bg-ember"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
