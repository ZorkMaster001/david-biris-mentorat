/*
  Stilul butoanelor mari, tinut separat ca sa fie acelasi si pe `CtaButton` (server,
  o simpla legatura) si pe `ContactCta` (client, deschide fereastra de alegere).
  Butoanele imprumuta fontul de display al titlurilor: acelasi caracter condensat
  si versal, deci nu arata a control generic lipit peste layout.
*/
export const CTA_BASE =
  "group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full px-8 font-display text-base tracking-[0.04em] transition-[background-color,color,box-shadow,border-color,transform] duration-200 ease-[var(--ease-out-expo)] active:scale-[0.97]";

export const CTA_VARIANTS = {
  primary: "bg-signal text-ink hover:bg-bone hover:shadow-[0_10px_36px_-12px_var(--color-signal)]",
  ghost: "border border-bone/25 text-bone hover:border-bone hover:bg-bone/5",
} as const;

export type CtaVariant = keyof typeof CTA_VARIANTS;
