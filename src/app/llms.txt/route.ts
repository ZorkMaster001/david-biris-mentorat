import { getContent } from "@/content";
import { LOCALES } from "@/content/types";
import { CITY, REGION } from "@/lib/business";
import { PHONE_DISPLAY, instagramUrl } from "@/lib/contact";
import { ROUTES, absoluteUrl } from "@/lib/site";

/**
 * `llms.txt` — rezumatul site-ului pentru asistentii de cautare (ChatGPT, Claude,
 * Perplexity). Google spune explicit ca nu are nevoie de el, dar celelalte motoare
 * citesc fisiere de genul asta si citeaza mai des sursele pe care le pot parcurge
 * fara sa randeze pagina.
 *
 * E generat din acelasi modul de continut ca site-ul, nu scris de mana intr-un
 * fisier static: altfel ar fi ramas in urma la prima schimbare de text, iar un
 * rezumat invechit e mai rau decat niciunul.
 */
export const dynamic = "force-static";

function section(locale: (typeof LOCALES)[number]): string {
  const content = getContent(locale);
  const pages = ROUTES.map((route) => {
    const meta =
      route === ""
        ? content.meta
        : content.pageMeta[route as keyof typeof content.pageMeta];
    return `- [${meta.title}](${absoluteUrl(locale, route)}): ${meta.description}`;
  });

  return [
    `## ${locale === "ro" ? "Română" : "English"}`,
    "",
    content.meta.description,
    "",
    `${locale === "ro" ? "Piloni" : "Pillars"}: ${content.method.pillars
      .map((pillar) => `${pillar.name} (${pillar.angle})`)
      .join("; ")}`,
    "",
    ...pages,
    "",
    `### ${locale === "ro" ? "Întrebări frecvente" : "Frequently asked questions"}`,
    "",
    ...content.faq.items.map((item) => `**${item.question}** ${item.answer}`),
  ].join("\n");
}

export function GET(): Response {
  const body = [
    "# David Biriș",
    "",
    `> ${getContent("ro").business.serviceType} — ${CITY}, ${REGION}, România.`,
    "",
    `Antrenor personal în ${CITY}. Mentorat 1-la-1 pentru slăbit, forță și obiceiuri`,
    "care rămân, construit peste sportul pe care omul îl face deja (sală, box, înot,",
    "cățărat) plus nutriție realistă. Mentoratul se desfășoară în română și engleză.",
    "",
    `Public: ${getContent("ro").business.audience}.`,
    "În practică, cei mai mulți au între 17 și 27 de ani.",
    "",
    "Preț: nu este public. Prima discuție e gratuită și se stabilește pe WhatsApp sau Instagram.",
    "",
    `Contact: ${PHONE_DISPLAY} (WhatsApp) · ${instagramUrl()}`,
    "",
    ...LOCALES.map(section),
    "",
    "---",
    "",
    "David Biriș este student la Medicină, nu medic sau nutriționist licențiat.",
    "Mentoratul nu înlocuiește sfatul medical.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
