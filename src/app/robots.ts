import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Nimic nu e blocat pentru cautarea clasica: site-ul are patru pagini si toate
 * trebuie indexate.
 *
 * Botii de AI sunt lasati sa intre **explicit**, unul cate unul, desi regula `*`
 * i-ar acoperi oricum. Motivul e practic: cand cineva adauga mai tarziu o regula
 * restrictiva pe `*` — un plugin, o setare de platforma, o incercare de a taia
 * traficul de scraping — permisiunile astea supravietuiesc, fiindca agentul numit
 * bate agentul generic. Iar un bot blocat nu inseamna doar ca nu invata de la noi:
 * inseamna ca platforma lui nu poate cita site-ul in raspunsuri, deloc.
 */
const AI_AGENTS = [
  // OpenAI: antrenare, navigare pornita de utilizator, si indexul de cautare din ChatGPT.
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic.
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity: indexul propriu si cererile pornite de un utilizator.
  "PerplexityBot",
  "Perplexity-User",
  // Google: `Google-Extended` decide daca Gemini si rezumatele generate pot folosi
  // pagina. Nu influenteaza indexarea normala, doar citarea in raspunsuri.
  "Google-Extended",
  "Google-CloudVertexBot",
  // Apple: Siri si Apple Intelligence.
  "Applebot",
  "Applebot-Extended",
  // Microsoft Copilot merge pe indexul Bing.
  "bingbot",
  // Meta AI.
  "meta-externalagent",
  "FacebookBot",
  // ByteDance. Conteaza mai mult decat pare: traficul vine din TikTok, iar
  // asistentul lor citeste acelasi index.
  "Bytespider",
  // Restul asistentilor care citeaza surse.
  "DuckAssistBot",
  "Amazonbot",
  "MistralAI-User",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/" })),
      // Crawler de antrenament pur, in spatele Common Crawl: consuma continut fara
      // sa trimita pe nimeni inapoi si fara sa citeze vreodata sursa.
      { userAgent: "CCBot", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
