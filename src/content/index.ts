import { en } from "./en";
import { ro } from "./ro";
import type { Content, Locale } from "./types";

const CONTENT: Record<Locale, Content> = { ro, en };

export function getContent(locale: Locale): Content {
  return CONTENT[locale];
}

export * from "./types";
