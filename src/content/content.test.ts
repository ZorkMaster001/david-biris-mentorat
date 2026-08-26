import { describe, expect, it } from "vitest";
import { en } from "./en";
import { ro } from "./ro";
import { LOCALES, isLocale } from "./types";

function deepKeys(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => deepKeys(item, `${prefix}[${index}]`));
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return [path, ...deepKeys(child, path)];
    });
  }
  return [];
}

describe("content parity", () => {
  it("has the same shape in both locales", () => {
    expect(deepKeys(en)).toEqual(deepKeys(ro));
  });

  it("has the same number of reel clips", () => {
    expect(en.reel.clips).toHaveLength(ro.reel.clips.length);
  });

  it("keeps route slugs untranslated", () => {
    expect(en.nav.map((item) => item.href)).toEqual(ro.nav.map((item) => item.href));
  });

  it("has no empty strings", () => {
    // nav[].href is legitimately "" for the home route (see NavItem["href"]
    // in types.ts), so it's excluded from this check via the replacer.
    for (const locale of [ro, en]) {
      const flat = JSON.stringify(locale, (key, value: unknown) => (key === "href" ? undefined : value));
      expect(flat).not.toContain('""');
    }
  });
});

describe("meta lengths", () => {
  /*
    Google taie titlul pe la ~60 de caractere si descrierea pe la ~160, iar taietura
    cade unde se nimereste, nu la capat de idee. Un titlu care se termina cu „Antrenor
    personal online · Mentorat 1-la-…" pierde exact numele care ar fi facut omul sa
    dea clic.

    Pragurile sunt in caractere, nu in pixeli: Google masoara in pixeli, deci sunt o
    aproximare — dar o aproximare care prinde derapajul de la 45 la 90 de caractere,
    care e felul in care se strica in practica.
  */
  const pages = (locale: typeof ro) => [
    ["meta", locale.meta] as const,
    ...Object.entries(locale.pageMeta).map(([key, value]) => [key, value] as const),
  ];

  it("keeps titles short enough to survive the SERP", () => {
    for (const locale of [ro, en]) {
      for (const [name, meta] of pages(locale)) {
        expect(`${name}: ${meta.title.length}`).toBe(`${name}: ${Math.min(meta.title.length, 60)}`);
      }
    }
  });

  it("keeps descriptions short enough to survive the SERP", () => {
    for (const locale of [ro, en]) {
      for (const [name, meta] of pages(locale)) {
        expect(`${name}: ${meta.description.length}`).toBe(
          `${name}: ${Math.min(meta.description.length, 160)}`,
        );
      }
    }
  });
});

describe("isLocale", () => {
  it("accepts known locales", () => {
    for (const locale of LOCALES) expect(isLocale(locale)).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});
