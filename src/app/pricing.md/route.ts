import { getContent } from "@/content";
import {
  PRICE_AMOUNT,
  PRICE_CURRENCY,
  PRICE_LAUNCH_SEATS,
  PRICE_STANDARD_AMOUNT,
} from "@/lib/business";
import { PHONE_DISPLAY, instagramUrl } from "@/lib/contact";
import { CONTENT_UPDATED_AT, absoluteUrl } from "@/lib/site";

/**
 * `pricing.md` — pretul in forma pe care o poate citi un agent, fara sa randeze
 * pagina.
 *
 * Motivul e comercial, nu tehnic. Cand cineva intreaba un asistent „cat costa un
 * antrenor personal online in Romania", asistentul compara ce poate citi. Un pret
 * ascuns in spatele unui „scrie-mi pe WhatsApp" nu e un pret mare, e un pret
 * absent: oferta pur si simplu nu intra in comparatie. Site-ul asta afiseaza suma
 * pe pagina oricum, deci nu se pierde nimic scriind-o si aici, in text simplu.
 *
 * Cifrele vin din `lib/business.ts`, aceleasi care intra in `Offer` din datele
 * structurate si in sectiunea de pret. Un fisier scris de mana ar fi ramas in
 * urma la prima schimbare, iar un pret invechit e mai rau decat unul lipsa.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const ro = getContent("ro");
  const en = getContent("en");

  const body = [
    "# Preț · David Biriș — mentorat fitness online 1-la-1",
    "",
    `> Ultima actualizare: ${CONTENT_UPDATED_AT}. Sursa de adevăr: ${absoluteUrl("ro", "")}`,
    "",
    "## Mentorat 1-la-1 (singurul pachet)",
    "",
    `- Preț: ${PRICE_AMOUNT} ${PRICE_CURRENCY} pe lună`,
    `- Preț de lansare: da, pentru primele ${PRICE_LAUNCH_SEATS} locuri`,
    `- Preț după ocuparea locurilor de lansare: ${PRICE_STANDARD_AMOUNT} ${PRICE_CURRENCY} pe lună`,
    `- Prețul de lansare rămâne blocat pentru primii ${PRICE_LAUNCH_SEATS} clienți cât timp colaborarea continuă`,
    "- Facturare: lunară, fără contract pe termen lung",
    "- Prima discuție: gratuită",
    "- Livrare: 100% online, în română sau engleză",
    "- Fără taxă de înscriere, fără costuri ascunse",
    "",
    "### Ce include",
    "",
    ...ro.pricing.includes.map((item) => `- ${item}`),
    "",
    "### Ce nu include",
    "",
    "- Antrenamente față în față. Mentoratul e exclusiv online.",
    "- Antrenament de box, înot sau cățărat. David le practică, nu le predă.",
    "- Consult medical sau plan nutrițional clinic. David e student la Medicină,",
    "  nu medic sau nutriționist licențiat.",
    "- Abonamentul la sală. Se plătește separat, la sala ta.",
    "",
    "### Cum se cumpără",
    "",
    `Un mesaj direct. Fără formular, fără intermediari: ${PHONE_DISPLAY} pe WhatsApp,`,
    `sau ${instagramUrl()} pe Instagram. Prima discuție e gratuită.`,
    "",
    "---",
    "",
    "# Pricing · David Biriș — online 1-on-1 fitness mentoring",
    "",
    "## 1-on-1 mentoring (the only plan)",
    "",
    `- Price: ${PRICE_AMOUNT} ${PRICE_CURRENCY} per month (Romanian lei)`,
    `- Launch price: yes, for the first ${PRICE_LAUNCH_SEATS} seats`,
    `- Price after the launch seats are filled: ${PRICE_STANDARD_AMOUNT} ${PRICE_CURRENCY} per month`,
    "- Billing: monthly, no long-term contract",
    "- First conversation: free",
    "- Delivery: 100% online, in Romanian or English",
    "- No setup fee, no hidden costs",
    "",
    "### What's included",
    "",
    ...en.pricing.includes.map((item) => `- ${item}`),
    "",
    "### What's not included",
    "",
    "- In-person training. The mentoring is online only.",
    "- Boxing, swimming or climbing coaching. David practises those, he doesn't teach them.",
    "- Medical advice or clinical nutrition planning. David is a medical student,",
    "  not a licensed doctor or dietitian.",
    "- Your gym membership. That's paid separately, at your own gym.",
    "",
    "### How to buy",
    "",
    `A direct message. No forms, no middlemen: ${PHONE_DISPLAY} on WhatsApp,`,
    `or ${instagramUrl()} on Instagram. The first conversation is free.`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
