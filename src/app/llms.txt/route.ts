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
    `${locale === "ro" ? "Metoda, pas cu pas" : "The method, step by step"}: ${content.method.pillars
      .map((pillar, index) => `${index + 1}. ${pillar.name} (${pillar.angle})`)
      .join(" ")}`,
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
    `> ${getContent("ro").business.serviceType}, din ${CITY}, ${REGION}, România.`,
    "",
    "Mentorat fitness 1-la-1, 100% online. Ideea centrală: te ajută să construiești un",
    "fizic de care ești mândru, fără să-ți sacrifici viața pentru el.",
    "",
    "Sala e instrumentul principal și baza metodei. Mentoratul e ghidarea, fizicul e",
    "rezultatul, iar stilul de viață activ e ce poți păstra în timp ce ajungi acolo.",
    "",
    "Ce include: program de sală personalizat, ghidare pe execuție, feedback pe filmări,",
    "nutriție de bază, urmărirea progresului cu ajustări săptămânale și acces direct la David.",
    "",
    "Nu predă box, înot sau cățărat. Le practică el însuși, ca dovadă că metoda încape",
    "într-o viață normală, cu facultate, job, relație și prieteni.",
    "",
    "Mentoratul se desfășoară exclusiv online, în română și engleză. Nu se țin antrenamente",
    `față în față; ${CITY} e orașul din care lucrează David, nu locul antrenamentelor.`,
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
