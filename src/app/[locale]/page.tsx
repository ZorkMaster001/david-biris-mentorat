import { getContent } from "@/content";
import { isLocale } from "@/content/types";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  return (
    <main className="px-5 py-20">
      <h1 className="font-display text-5xl">{content.hero.headline}</h1>
    </main>
  );
}
