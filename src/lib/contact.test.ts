import { describe, expect, it } from "vitest";
import { INSTAGRAM_HANDLE, PHONE_E164, instagramUrl, whatsappUrl } from "./contact";

describe("whatsappUrl", () => {
  it("uses the wa.me short link with the E.164 number, digits only", () => {
    expect(whatsappUrl("hei")).toContain(`https://wa.me/${PHONE_E164}`);
    expect(PHONE_E164).toMatch(/^\d+$/);
  });

  it("encodes Romanian diacritics in the prefilled message", () => {
    const url = whatsappUrl("Salut, vreau să încep");
    expect(url).toContain("%C4%83"); // ă
    expect(url).toContain("%C3%AEn"); // î
    expect(url).not.toContain(" ");
  });

  it("does not double-encode", () => {
    const url = whatsappUrl("a&b");
    expect(url).toContain("a%26b");
    expect(url).not.toContain("%2526");
  });

  it("omits the text parameter for an empty message", () => {
    expect(whatsappUrl("")).toBe(`https://wa.me/${PHONE_E164}`);
  });
});

describe("instagramUrl", () => {
  it("builds a bare profile url without an @", () => {
    expect(instagramUrl()).toBe(`https://instagram.com/${INSTAGRAM_HANDLE}`);
    expect(INSTAGRAM_HANDLE).not.toContain("@");
  });
});
