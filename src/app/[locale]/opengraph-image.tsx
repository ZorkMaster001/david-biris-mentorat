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
  Inainte era numai text pe negru: corect, dar arata a pagina goala, iar linkul trimis
  intr-o conversatie e de multe ori prima impresie, inaintea site-ului.

  Acum poarta aceeasi fotografie ca heroul, in dreapta, cu textul la stanga peste un
  degradeu care leaga cele doua jumatati. Sursa e un JPEG citit de pe disc din
  `src/media`, nu o adresa: `ImageResponse` se randeaza la build, in Node, si un fetch
  catre propriul site nu are ce sa raspunda inainte ca site-ul sa existe.

  JPEG, nu avif sau webp: compunerea trece prin resvg, care le trateaza inconstant.
  Fara fonturi proprii — `next/font` le tine sub amprente in `.next`, deci n-au o cale
  stabila de citit. Ierarhia o fac fotografia si culoarea de accent, nu corpul literei.
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
          width={550}
          height={630}
          style={{ position: "absolute", top: 0, right: 0, objectFit: "cover" }}
        />

        {/* Trecerea dintre text si fotografie. Capatul opac cade exact pe muchia din
            stanga a pozei (x=650), nu inaintea ei: pus peste negru, degradeul nu s-ar
            fi vazut deloc, iar poza ar fi inceput tot cu o taietura dreapta. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 646,
            width: 300,
            height: 630,
            background:
              "linear-gradient(90deg, #0A0A0B 0%, rgba(10,10,11,0.72) 38%, rgba(10,10,11,0) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 700,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 72,
          }}
        >
          <div style={{ fontSize: 24, color: "#2FE6C4", letterSpacing: 5 }}>DAVID BIRIȘ</div>

          {/* Titlul ramane impartit ca in hero: a doua propozitie duce promisiunea,
              deci ea poarta culoarea de accent. */}
          <div style={{ fontSize: 56, lineHeight: 1.08, marginTop: 24, maxWidth: 520 }}>
            {content.hero.headline}
          </div>
          <div
            style={{
              fontSize: 56,
              lineHeight: 1.08,
              marginTop: 4,
              maxWidth: 520,
              color: "#2FE6C4",
            }}
          >
            {content.hero.headlineAccent}
          </div>

          <div style={{ fontSize: 25, marginTop: 32, color: "#A3A099" }}>
            {content.business.serviceType}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
