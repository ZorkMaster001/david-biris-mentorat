import { describe, expect, it } from "vitest";
import { leadChannel } from "./analytics";
import { instagramUrl, whatsappUrl } from "./contact";

describe("leadChannel", () => {
  it("recognises the real contact links from lib/contact", () => {
    // Legaturile chiar folosite in pagina, nu unele scrise de mana aici: daca se
    // schimba numarul, handle-ul sau mesajul precompletat, testul le urmeaza.
    expect(leadChannel(whatsappUrl("Salut David, am văzut site-ul."))).toBe("whatsapp");
    expect(leadChannel(whatsappUrl(""))).toBe("whatsapp");
    expect(leadChannel(instagramUrl())).toBe("instagram");
  });

  it("matches on host, not on the whole string", () => {
    expect(leadChannel("https://api.whatsapp.com/send?phone=40755659389")).toBe("whatsapp");
    expect(leadChannel("https://www.instagram.com/david_biris/")).toBe("instagram");
  });

  it("ignores everything else", () => {
    expect(leadChannel("https://www.davidbiris.fit/ro/metoda")).toBeNull();
    expect(leadChannel("mailto:cineva@example.com")).toBeNull();
    // O adresa care doar contine numele altui site nu e canalul acelui site.
    expect(leadChannel("https://example.com/?next=https://wa.me/40755659389")).toBeNull();
  });

  it("survives a href that is not a URL", () => {
    expect(leadChannel("")).toBeNull();
    expect(leadChannel("#")).toBeNull();
  });
});
