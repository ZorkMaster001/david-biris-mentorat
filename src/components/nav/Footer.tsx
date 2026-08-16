import Link from "next/link";
import type { Content, Locale } from "@/content/types";
import { LOCALES } from "@/content/types";
import type { RouteKey } from "@/lib/site";

interface FooterProps {
  locale: Locale;
  data: Content["footer"];
  route: RouteKey;
}

/**
 * Ramane server component, deci nu poate citi usePathname. Ruta curenta i se da
 * explicit prin `route`: un footer static n-are de ce sa trimita JavaScript doar
 * ca sa afle unde se afla. Comutatorul de limba trebuie sa pastreze pagina.
 */
export function Footer({ locale, data, route }: FooterProps) {
  const suffix = route === "" ? "" : `/${route}`;

  return (
    <footer className="border-t border-hairline px-5 py-12">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-bone-dim">{data.languageLabel}</span>
          {LOCALES.map((candidate) => (
            <Link
              key={candidate}
              href={`/${candidate}${suffix}`}
              hrefLang={candidate}
              aria-current={candidate === locale ? "true" : undefined}
              className={`min-h-[44px] px-2 text-sm uppercase leading-[44px] ${
                candidate === locale ? "text-bone underline underline-offset-4" : "text-bone-dim"
              }`}
            >
              {candidate}
            </Link>
          ))}
        </div>
        <p className="mt-8 max-w-[70ch] text-xs leading-relaxed text-bone-dim">{data.disclaimer}</p>
        <p className="mt-6 text-xs text-bone-dim">
          © {new Date().getFullYear()} {data.rights}
        </p>
      </div>
    </footer>
  );
}
