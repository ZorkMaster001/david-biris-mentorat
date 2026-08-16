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

  it("has the same number of hero slides", () => {
    expect(en.hero.slides).toHaveLength(ro.hero.slides.length);
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

describe("isLocale", () => {
  it("accepts known locales", () => {
    for (const locale of LOCALES) expect(isLocale(locale)).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});
