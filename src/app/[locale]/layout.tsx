import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/nav/BottomNav";
import { ContactFab } from "@/components/nav/ContactFab";
import { MotionProvider } from "@/components/motion-provider";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getContent(locale);
  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: absoluteUrl(locale, ""),
      languages: {
        ro: absoluteUrl("ro", ""),
        en: absoluteUrl("en", ""),
        "x-default": absoluteUrl("ro", ""),
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  return (
    <MotionProvider>
      <div className="pb-nav">{children}</div>
      <BottomNav locale={locale} items={content.nav} />
      <ContactFab labels={content.contact} />
    </MotionProvider>
  );
}
