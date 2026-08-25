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

  Fonturile sunt chiar ale site-ului, tinute in `src/media/fonts`. Fara ele, Satori
  desena titlul cu un sans oarecare, la corp normal si cu litere mici, in timp ce in
  pagina `.font-display` inseamna Archivo 700, latit la 115%, cu majuscule si spatiere
  stransa — adica exact ce facea cardul sa arate a alta pagina. `next/font` tine
  aceleasi fonturi sub amprente in `.next`, in woff2, pe care Satori nu le citeste;
  de-aia stau aici, ca .ttf, si se citesc de pe disc la build.

  Fara butoanele din hero: intr-o imagine nu se poate apasa nimic, iar un buton desenat
  care nu face nimic e mai rau decat lipsa lui. Si fara linia de sub accent: in pagina
  se opreste la capatul cuvintelor (`width: fit-content`), iar Satori n-are cum sa masoare
  asta — o linie de latime ghicita s-ar fi vazut ca greseala, nu ca detaliu.
*/
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(isLocale(locale) ? locale : "ro");

  const asset = (file: string) => readFile(path.join(process.cwd(), "src/media", file));
  const [photo, display, body] = await Promise.all([
    asset("og-hero.jpg"),
    asset("fonts/archivo-700.ttf"),
    asset("fonts/inter-400.ttf"),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  // Aceleasi valori ca `.font-display` din globals.css.
  const displayFont = {
    fontFamily: "Archivo",
    fontSize: 54,
    lineHeight: 0.92,
    letterSpacing: -1,
    textTransform: "uppercase" as const,
    maxWidth: 900,
  };

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
          <div style={displayFont}>{content.hero.headline}</div>
          {/* A doua propozitie duce promisiunea, deci ea poarta accentul — ca in hero,
              pe randul ei, in culoarea de semnal si cu aura care o desprinde de poza. */}
          <div
            style={{
              ...displayFont,
              marginTop: 6,
              color: "#2FE6C4",
              textShadow: "0 0 34px rgba(47,230,196,0.45)",
            }}
          >
            {content.hero.headlineAccent}
          </div>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 23,
              lineHeight: 1.45,
              marginTop: 24,
              maxWidth: 660,
              color: "#A3A099",
            }}
          >
            {content.hero.subheadline}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: display, weight: 700, style: "normal" },
        { name: "Inter", data: body, weight: 400, style: "normal" },
      ],
    },
  );
}
