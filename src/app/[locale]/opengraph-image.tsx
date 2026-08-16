import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "David Biriș · Mentorat 1-la-1";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : "ro");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "#0A0A0B",
          color: "#F2EFE9",
        }}
      >
        <div
          style={{
            fontSize: 26,
            color: "#FF5C1A",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          David Biriș
        </div>
        <div style={{ fontSize: 68, lineHeight: 1.05, marginTop: 20, maxWidth: 900 }}>
          {content.hero.headline}
        </div>
      </div>
    ),
    size,
  );
}
