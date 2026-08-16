import { describe, expect, it } from "vitest";
import { isActiveTab } from "./navigation";

describe("isActiveTab", () => {
  it("marks home active only on the locale root", () => {
    expect(isActiveTab("/ro", "ro", "")).toBe(true);
    expect(isActiveTab("/ro/metoda", "ro", "")).toBe(false);
  });

  it("marks a sub-route active on exact match", () => {
    expect(isActiveTab("/ro/metoda", "ro", "metoda")).toBe(true);
    expect(isActiveTab("/ro/rezultate", "ro", "metoda")).toBe(false);
  });

  it("tolerates a trailing slash", () => {
    expect(isActiveTab("/ro/", "ro", "")).toBe(true);
    expect(isActiveTab("/ro/metoda/", "ro", "metoda")).toBe(true);
  });

  it("does not leak across locales", () => {
    expect(isActiveTab("/en/metoda", "ro", "metoda")).toBe(false);
    expect(isActiveTab("/en/metoda", "en", "metoda")).toBe(true);
  });

  it("does not match a prefix of a longer route", () => {
    expect(isActiveTab("/ro/rezultate", "ro", "")).toBe(false);
  });
});
