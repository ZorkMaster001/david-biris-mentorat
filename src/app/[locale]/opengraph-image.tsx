import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "David Biriș · Mentorat 1-la-1";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/*
  Cardul care se vede cand cineva trimite linkul pe WhatsApp, Instagram sau Slack.
  E chiar heroul paginii, nu o compozitie facuta separat pentru previzualizare: aceeasi
  fotografie pe tot cadrul, acelasi degradeu care apasa de jos, acelasi titlu in coltul
  din stanga-jos, cu a doua propozitie in culoarea de accent. Cine deschide linkul dupa
  ce a vazut cardul nimereste exact imaginea pe care si-o aminteste.

  Fotografia nu e reincadrata aici: `src/media/og-hero.jpg` e taiat de scriptul de
  media exact la banda pe care `object-cover` cu `object-position: 50% 30%` o arata in
  hero pe ecran lat. Motivul e ca Satori trateaza inconstant `object-position`, deci
  incadrarea se face inainte, cu sharp, nu din CSS.

  Se citeste de pe disc, nu de la o adresa: `ImageResponse` se randeaza la build, iar
  un fetch catre propriul site n-ar avea ce sa raspunda inainte ca site-ul sa existe.

  Fara fonturi proprii — `next/font` le tine sub amprente in `.next`, deci n-au o cale
  stabila de citit. Si fara butoanele din hero: intr-o imagine nu se poate apasa nimic,
  iar un buton desenat care nu face nimic e mai rau decat lipsa lui.
*/
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : "ro");

  const photo = await readFile(path.join(process.cwd(), "src/media/og-hero.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#0A0A0B",
          color: "#F2EFE9",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori randeaza `img`, nu componenta Next */}
        <img
          src={photoSrc}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />

        {/* Acelasi degradeu ca in hero: `from-ink via-ink/55 to-ink/15`, catre sus.
            Subiectul sta in jumatatea de sus, deci intunericul apasa doar sub text. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background:
              "linear-gradient(0deg, #0A0A0B 0%, rgba(10,10,11,0.55) 55%, rgba(10,10,11,0.15) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 1200,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: 64,
          }}
        >
          <div style={{ fontSize: 60, lineHeight: 1.06, maxWidth: 760 }}>
            {content.hero.headline}
          </div>
          {/* A doua propozitie duce promisiunea, deci ea poarta accentul — ca in hero,
              pe randul ei. */}
          <div style={{ fontSize: 60, lineHeight: 1.06, maxWidth: 760, color: "#2FE6C4" }}>
            {content.hero.headlineAccent}
          </div>
          <div style={{ fontSize: 24, lineHeight: 1.4, marginTop: 26, maxWidth: 680, color: "#A3A099" }}>
            {content.hero.subheadline}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
