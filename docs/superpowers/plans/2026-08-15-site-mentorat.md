# Site Mentorat David Biriș — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un site de mentorat fitness 1-la-1 pentru David Biriș, mobile-first, în română și engleză, al cărui unic obiectiv e să deschidă o conversație pe WhatsApp sau Instagram.

**Architecture:** Next.js 16 App Router, complet static (fără backend, fără API routes). Homepage-ul poartă argumentul de vânzare integral; trei rute secundare (`metoda`, `rezultate`, `despre`) duc în adâncime și dau bottom nav-ului destinații reale. Localizarea se face nativ printr-un segment `[locale]` și un modul de conținut tipat, nu printr-o bibliotecă de i18n. Media brută se procesează o singură dată, offline, printr-un script care scrie în `public/media/`.

**Tech Stack:** Next.js 16.3.1 · React 19.2 · TypeScript strict · Tailwind CSS 4.3 · motion 13 · three 0.185 + @react-three/fiber 9 + @react-three/drei 10 · @phosphor-icons/react 2.1 · Vitest 3 · sharp · ffmpeg (doar la build de media)

**Spec:** `docs/superpowers/specs/2026-08-15-david-biris-mentorat-design.md`

---

## Abateri de la spec

Trei decizii luate la scrierea planului, toate simplificări:

1. **Fără `next-intl`** (spec §11 îl menționa). Avem nevoie doar de rute prefixate cu locale, un redirect și `hreflang`. Un segment `[locale]` nativ plus un modul de conținut tipat face asta în ~30 de linii, fără middleware, fără dependență, fără JS trimis la client, și cu verificare de tip la compilare pentru chei lipsă. Rutele rămân complet statice.
2. **Se adaugă Vitest** (spec §15 spunea „fără teste unitare"). Rămâne adevărat pentru componentele de prezentare, dar există logică pură care merită teste și le are: construirea link-urilor de contact, aritmetica de navigare a slideshow-ului, porțile de capabilitate ale device-ului, paritatea RO/EN. Sunt rapide și prind exact bug-urile pe care verificarea manuală le ratează.
3. **Pozele de testimonial se normalizează la 9:16** (spec nu preciza raportul). Necesar: `darius/before` e landscape 4608×2240, `darius/after` e portret 3024×4032. Decupajele sunt măsurate, nu ghicite — vezi Task 2.

---

## Global Constraints

Fiecare task moștenește implicit constrângerile de mai jos. Sunt copiate din spec cu valorile exacte.

- **Versiuni minime:** Next 16.3.1, React 19.2, Tailwind 4.3, three 0.185, @react-three/fiber 9.7, motion 13.1, @phosphor-icons/react 2.1.10
- **TypeScript strict.** `strict: true`, fără `any`, fără `@ts-ignore`. `tsc --noEmit` trebuie să fie curat la fiecare commit
- **Fără backend.** Zero API routes, zero server actions, zero baze de date. Toate CTA-urile sunt link-uri externe
- **Fără cifre inventate.** Interzis: număr de clienți, statistici, promisiuni de kilograme sau de interval de timp. Doar ce e verificabil: 7 ani de sală de la 13 ani, anul 2 la Medicină, două testimoniale reale
- **Fără limbaj care sugerează calificare medicală.** David e student la Medicină, nu medic sau nutriționist licențiat. Disclaimer obligatoriu în footer
- **Copy-ul nu se scrie niciodată în componente.** Vine exclusiv din `src/content/{ro,en}.ts`. O componentă cu string vizibil hardcodat e un bug
- **Datele de contact există într-un singur loc:** `src/lib/contact.ts`. Numărul `+40 755 659 389` → `wa.me/40755659389`
- **Bugete de performanță** (Lighthouse mobil, toate cele 8 combinații rută×locale): LCP < 2.5s, INP < 200ms, CLS < 0.05, JS inițial fără 3D < 180KB gz, bundle 3D lazy < 200KB gz, Performance ≥ 90
- **Accesibilitate:** contrast ≥ 4.5:1 pe text, ținte de atins ≥ 44×44px, focus vizibil peste tot, nicio informație transmisă doar prin culoare
- **`prefers-reduced-motion` se respectă în fiecare animație.** Fără excepții
- **Commit la finalul fiecărui task.** Mesaje în română, prefix convențional (`feat:`, `chore:`, `docs:`)

---

## File Structure

```
scripts/
  process-media.mjs          # transcodare video + imagini, rulat manual, o dată
src/
  app/
    layout.tsx               # <html lang> minimal, doar shell
    page.tsx                 # redirect permanent la /ro
    robots.ts
    sitemap.ts
    [locale]/
      layout.tsx             # fonturi, BottomNav, ContactFab, Footer, JSON-LD
      page.tsx               # homepage
      metoda/page.tsx
      rezultate/page.tsx
      despre/page.tsx
      opengraph-image.tsx
  components/
    nav/BottomNav.tsx        # client — tab bar fix
    nav/navigation.ts        # pur — construire href + detecție tab activ
    nav/ContactFab.tsx       # client — FAB care se desface
    nav/Footer.tsx           # server — disclaimer + comutator de limbă
    hero/HeroStories.tsx     # client — orchestrator
    hero/StoryProgress.tsx   # client — barele de progres
    hero/StoryVideo.tsx      # client — un singur clip + degradări
    hero/storyNavigation.ts  # pur — aritmetica de index și zone de tap
    method/BarbellScene.tsx  # client, dynamic ssr:false
    method/BarbellFallback.tsx
    method/PillarList.tsx    # client — observă pilonii, raportează câți sunt vizibili
    results/BeforeAfter.tsx  # client — slider comparativ
    ui/Section.tsx           # server
    ui/Reveal.tsx            # client — intrare cu respect pentru reduced-motion
    ui/CtaButton.tsx         # server
    seo/JsonLd.tsx           # server
  content/
    types.ts                 # contractul de conținut
    ro.ts
    en.ts
    index.ts                 # getContent(locale)
  lib/
    contact.ts               # pur — numărul, handle-ul, construirea URL-urilor
    device.ts                # pur — porți de capabilitate + hook
    site.ts                  # baseUrl din env, lista de rute
public/
  media/video/*.mp4|webm
  media/img/*.avif|webp
  llms.txt
```

**Regula de limită:** fiecare fișier are un singur motiv de existență. Logica pură stă în module fără JSX (`navigation.ts`, `storyNavigation.ts`, `contact.ts`, `device.ts`) exact ca să poată fi testată fără DOM. Componentele primesc conținutul prin props.

---

### Task 1: Schelet de proiect și lanț de unelte

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `.gitignore`, `src/app/layout.tsx`, `src/app/globals.css`
- Test: `src/lib/smoke.test.ts`

**Interfaces:**
- Consumes: nimic
- Produces: proiect care compilează și rulează; comenzile `npm run dev`, `npm run build`, `npm run test`, `npm run typecheck`

- [ ] **Step 1: Creează proiectul**

Rulează din `D:\TailWindProjects\david-biris-mentorat`. Directorul conține deja `assets/`, `testimonial_*/`, `docs/`, `LICENSE` și `.git`, deci `create-next-app` trebuie să scrie în loc, nu într-un subdirector.

```bash
npx create-next-app@16.3.1 . --typescript --tailwind --app --src-dir --turbopack --eslint --no-import-alias
```

Dacă refuză din cauza directorului nevid, creează într-un director temporar și mută:

```bash
npx create-next-app@16.3.1 .tmp-scaffold --typescript --tailwind --app --src-dir --turbopack --eslint --no-import-alias
cp -r .tmp-scaffold/. .
rm -rf .tmp-scaffold
```

- [ ] **Step 2: Instalează dependențele proiectului**

```bash
npm install motion@^13.1.0 three@^0.185.1 @react-three/fiber@^9.7.0 @react-three/drei@^10.7.8 @phosphor-icons/react@^2.1.10
npm install -D vitest@^3 @types/three sharp
```

- [ ] **Step 3: Configurează TypeScript strict**

`tsconfig.json` — asigură-te că `compilerOptions` conține exact aceste valori (păstrează restul generat de create-next-app):

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

`noUncheckedIndexedAccess` e intenționat: indexăm des în listele de conținut și de slide-uri, iar el forțează tratarea cazului `undefined`.

- [ ] **Step 4: Configurează Next**

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
```

`optimizePackageImports` pe `@phosphor-icons/react` e obligatoriu — fără el, un singur import trage tot setul de iconițe în bundle.

- [ ] **Step 5: Configurează Vitest**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

Mediul e `node`, nu `jsdom`: testăm doar module pure. Componentele se verifică în browser, nu în teste.

- [ ] **Step 6: Adaugă scripturile în `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "media": "node scripts/process-media.mjs"
  }
}
```

- [ ] **Step 7: Scrie testul de fum**

`src/lib/smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("toolchain", () => {
  it("runs typescript under vitest", () => {
    const value: string = "ok";
    expect(value).toBe("ok");
  });
});
```

- [ ] **Step 8: Rulează testul și verifică că trece**

Run: `npm run test`
Expected: PASS, 1 test.

- [ ] **Step 9: Ignoră media brută și artefactele**

`.gitignore` — adaugă la ce a generat create-next-app:

```
# media brută, procesată local prin npm run media
/assets
/testimonial_darius
/testimonial_meril
.tmp-scaffold
```

Media sursă rămâne pe disc local dar nu intră în repo — sunt 42MB de fișiere WhatsApp care n-au ce căuta în istoric. Ieșirea procesată din `public/media/` **se comite**, ca deploy-ul pe Vercel să nu depindă de ffmpeg.

- [ ] **Step 10: Verifică build-ul**

Run: `npm run typecheck && npm run build`
Expected: ambele curate, fără warnings.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: schelet Next 16 cu Tailwind 4, TypeScript strict si Vitest"
```

---

### Task 2: Pipeline de media

**Files:**
- Create: `scripts/process-media.mjs`
- Output: `public/media/video/*`, `public/media/img/*`

**Interfaces:**
- Consumes: nimic
- Produces: fișierele din `public/media/`, referite prin nume în `src/content/*`. Numele exacte sunt cele din tabelele de mai jos și nu se schimbă ulterior.

**Context măsurat.** Trei clipuri poartă `rotation=-90` în metadate (`11.54.03 (1)`, `(2)`, `(5)`): sunt stocate 1280×720 dar se afișează portret. ffmpeg le rotește automat la decodare, deci `scale=-2:1080` produce corect 608×1080. Pasul 5 verifică asta explicit, pentru că dacă autorotația nu se aplică ies clipuri culcate.

- [ ] **Step 1: Scrie scriptul**

`scripts/process-media.mjs`:

```js
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_VIDEO = path.join(ROOT, "public/media/video");
const OUT_IMG = path.join(ROOT, "public/media/img");

const VIDEOS = [
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03.mp4", out: "01-sala", trim: null },
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03 (4).mp4", out: "02-box", trim: null },
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03 (2).mp4", out: "03-catarat", trim: 8 },
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03 (1).mp4", out: "04-apa", trim: null },
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03 (5).mp4", out: "05-alergare", trim: null },
  { src: "assets/WhatsApp Video 2026-08-15 at 11.54.03 (3).mp4", out: "06-catarat-larg", trim: 8 },
];

// crop: [w, h, x, y] sau null. Valorile sunt masurate pe fiecare imagine, nu ghicite.
const IMAGES = [
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.05.jpeg", out: "balance-beer", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.23 (1).jpeg", out: "balance-fastfood", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (6).jpeg", out: "nutrition-plate", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (2).jpeg", out: "physique-gym", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (3).jpeg", out: "outdoor-summit", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (9).jpeg", out: "climbing-wall", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (7).jpeg", out: "training-bench", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.05 (3).jpeg", out: "hiking-peaks", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.05 (4).jpeg", out: "physique-mirror", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.23.jpeg", out: "david-formal", crop: null },
  { src: "assets/WhatsApp Image 2026-08-15 at 11.54.04 (8).jpeg", out: "sea-rest", crop: null },

  // Testimoniale, normalizate la 9:16. Decupajele sunt masurate pe fiecare sursa.
  { src: "testimonial_darius/before.jpeg", out: "darius-before", crop: [1260, 2240, 2342, 0] },
  { src: "testimonial_darius/after.jpeg", out: "darius-after", crop: [2268, 4032, 378, 0] },
  { src: "testimonial_meril/before.jpeg", out: "meril-before", crop: [796, 1415, 23, 176] },
  { src: "testimonial_meril/after.jpeg", out: "meril-after", crop: [790, 1404, 39, 0] },
];

const ffmpeg = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

function processVideo({ src, out, trim }) {
  const input = path.join(ROOT, src);
  if (!existsSync(input)) throw new Error(`Lipseste sursa video: ${src}`);

  const trimArgs = trim ? ["-t", String(trim)] : [];
  const scale = "scale=-2:1080";

  ffmpeg([
    "-i", input, ...trimArgs,
    "-vf", scale,
    "-c:v", "libx264", "-profile:v", "main", "-crf", "27", "-preset", "slow",
    "-movflags", "+faststart", "-an",
    path.join(OUT_VIDEO, `${out}.mp4`),
  ]);

  ffmpeg([
    "-i", input, ...trimArgs,
    "-vf", scale,
    "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0", "-an",
    path.join(OUT_VIDEO, `${out}.webm`),
  ]);

  const posterPng = path.join(OUT_VIDEO, `${out}.poster.png`);
  ffmpeg(["-i", input, "-frames:v", "1", "-vf", scale, posterPng]);
  return posterPng;
}

async function toWebFormats(inputBuffer, outName) {
  const base = path.join(OUT_IMG, outName);
  await sharp(inputBuffer).avif({ quality: 55 }).toFile(`${base}.avif`);
  await sharp(inputBuffer).webp({ quality: 78 }).toFile(`${base}.webp`);
}

async function processImage({ src, out, crop }) {
  const input = path.join(ROOT, src);
  if (!existsSync(input)) throw new Error(`Lipseste sursa imagine: ${src}`);

  let pipeline = sharp(input).rotate(); // .rotate() fara argument aplica orientarea EXIF
  if (crop) {
    const [width, height, left, top] = crop;
    pipeline = pipeline.extract({ width, height, left, top });
  }
  const buffer = await pipeline.resize({ width: 1440, withoutEnlargement: true }).toBuffer();
  await toWebFormats(buffer, out);
}

async function main() {
  mkdirSync(OUT_VIDEO, { recursive: true });
  mkdirSync(OUT_IMG, { recursive: true });

  for (const video of VIDEOS) {
    const posterPng = processVideo(video);
    const buffer = await sharp(posterPng).resize({ width: 1080 }).toBuffer();
    await toWebFormats(buffer, `poster-${video.out}`);
    execFileSync("node", ["-e", `require("node:fs").unlinkSync(${JSON.stringify(posterPng)})`]);
    const mp4 = path.join(OUT_VIDEO, `${video.out}.mp4`);
    console.log(`${video.out}.mp4  ${(statSync(mp4).size / 1_048_576).toFixed(2)} MB`);
  }

  for (const image of IMAGES) await processImage(image);
  console.log("Gata.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 2: Rulează scriptul**

Run: `npm run media`
Expected: 6 clipuri MP4 + WebM, 6 postere, 15 imagini în AVIF și WebP. Fiecare MP4 raportat sub 2.00 MB.

- [ ] **Step 3: Verifică bugetul de mărime**

```bash
ls -la public/media/video/*.mp4
du -sh public/media
```

Expected: fiecare `.mp4` sub 2MB. Dacă unul depășește, crește `-crf` de la 27 la 29 pentru clipul respectiv și rerulează. Nu coborî rezoluția sub 1080 pe latura lungă.

- [ ] **Step 4: Verifică orientarea clipurilor**

```bash
for f in public/media/video/*.mp4; do echo -n "$(basename $f) "; ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$f"; done
```

Expected: **toate** sunt portret (înălțimea mai mare decât lățimea, tipic `608x1080`). Dacă vreunul iese `1080x608`, autorotația nu s-a aplicat — adaugă `-noautorotate` **nu**, ci dimpotrivă, forțează explicit rotația cu `-vf "transpose=1,scale=-2:1080"` pentru clipul respectiv și rerulează.

- [ ] **Step 5: Verifică vizual decupajele testimonialelor**

Deschide cele patru fișiere `public/media/img/{darius,meril}-{before,after}.webp`.

Expected, pentru fiecare: persoana e întreagă în cadru (cap și picioare vizibile), raportul e 9:16, iar la `meril-before` **nu se mai vede** nimic din interfața Snapchat — nici bara de status de sus, nici coloana de unelte din dreapta, nici bara albastră de trimitere de jos. Dacă a rămas interfață vizibilă, ajustează valorile `crop` pentru `meril-before` și rerulează doar acea imagine.

- [ ] **Step 6: Commit**

```bash
git add scripts/process-media.mjs public/media
git commit -m "feat: pipeline de media si assets procesate pentru web"
```

---

### Task 3: Tokeni de design, fonturi și CSS global

**Files:**
- Create: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/lib/fonts.ts`

**Interfaces:**
- Consumes: nimic
- Produces: variabilele CSS `--color-ink`, `--color-ink-raised`, `--color-bone`, `--color-bone-dim`, `--color-ember`, `--color-deep`, `--color-hairline`; clasele utilitare `.font-display` și `.font-body`; variabilele de font `--font-display` și `--font-body` puse pe `<html>`

- [ ] **Step 1: Definește fonturile**

`src/lib/fonts.ts`:

```ts
import { Archivo, Inter } from "next/font/google";

export const display = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

export const body = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});
```

`latin-ext` e obligatoriu — fără el diacriticele românești (ă, â, î, ș, ț) cad pe un font de rezervă și textul arată rupt.

- [ ] **Step 2: Scrie CSS-ul global**

`src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-ink: #0a0a0b;
  --color-ink-raised: #141416;
  --color-bone: #f2efe9;
  --color-bone-dim: #a3a099;
  --color-ember: #ff5c1a;
  --color-deep: #0e4a4f;
  --color-hairline: rgba(242, 239, 233, 0.1);

  --font-display: var(--font-display), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-body), ui-sans-serif, system-ui, sans-serif;

  --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);

  --spacing-nav: 64px;
}

:root {
  color-scheme: dark;
}

html {
  background-color: var(--color-ink);
  -webkit-text-size-adjust: 100%;
}

body {
  background-color: var(--color-ink);
  color: var(--color-bone);
  font-family: var(--font-body);
  font-synthesis-weight: none;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}

/* Spatiu sub continut cat sa nu intre nimic sub bottom nav. */
.pb-nav {
  padding-bottom: calc(var(--spacing-nav) + env(safe-area-inset-bottom) + 1.5rem);
}

.font-display {
  font-family: var(--font-display);
  font-weight: 700;
  font-stretch: 115%;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  line-height: 0.92;
}

:where(a, button, [tabindex]):focus-visible {
  outline: 2px solid var(--color-ember);
  outline-offset: 3px;
  border-radius: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Leagă fonturile în layout-ul rădăcină**

`src/app/layout.tsx`:

```tsx
import type { ReactNode } from "react";
import { body, display } from "@/lib/fonts";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
```

`lang` se suprascrie în layout-ul de locale prin metadata; aici e doar valoarea implicită.

- [ ] **Step 4: Verifică vizual**

Înlocuiește temporar `src/app/page.tsx` cu:

```tsx
export default function Page() {
  return (
    <main className="px-5 py-20">
      <h1 className="font-display text-6xl">Ridică. Lovește. Cațără.</h1>
      <p className="mt-6 text-bone-dim">Diacritice: ăâîșț ĂÂÎȘȚ</p>
      <button className="mt-8 rounded-full bg-ember px-6 py-3 font-semibold text-ink">Buton</button>
    </main>
  );
}
```

Run: `npm run dev`, deschide `http://localhost:3000`
Expected: fundal aproape negru, titlu uppercase lat și îngust ca spațiere, diacriticele redate corect în ambele fonturi, butonul portocaliu. Tab pe buton arată un contur portocaliu.

- [ ] **Step 5: Verifică contrastul accentului**

Măsoară contrastul `--color-ember` (#FF5C1A) pe `--color-ink` (#0A0A0B) cu DevTools sau un contrast checker.

Expected: raportul e ~5.5:1, deci trece 4.5:1 și ember-ul **poate** fi folosit ca text. Dacă măsurătoarea iese sub 4.5:1, ember-ul rămâne exclusiv culoare de fundal cu text `--color-ink` peste el, iar textul accentuat folosește `--color-bone`. Notează rezultatul măsurătorii în commit.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/lib/fonts.ts src/app/page.tsx
git commit -m "feat: tokeni de design, fonturi variabile si CSS global"
```

---

### Task 4: Rutare pe locale și contractul de conținut

**Files:**
- Create: `src/content/types.ts`, `src/content/ro.ts`, `src/content/en.ts`, `src/content/index.ts`
- Create: `src/lib/site.ts`
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
- Modify: `src/app/page.tsx` (devine redirect)
- Test: `src/content/content.test.ts`

**Interfaces:**
- Consumes: nimic
- Produces:
  - `type Locale = "ro" | "en"`, `LOCALES: readonly Locale[]`, `DEFAULT_LOCALE: Locale`
  - `getContent(locale: Locale): Content`
  - `isLocale(value: string): value is Locale`
  - `interface Content` cu câmpurile folosite de toate task-urile următoare
  - `SITE_URL: string`, `ROUTES: readonly RouteKey[]` unde `RouteKey = "" | "metoda" | "rezultate" | "despre"`

- [ ] **Step 1: Scrie contractul de tipuri**

`src/content/types.ts`:

```ts
export const LOCALES = ["ro", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ro";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export interface HeroSlide {
  id: string;
  word: string;
  video: string;
  poster: string;
  alt: string;
}

export interface Pillar {
  id: string;
  name: string;
  angle: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  note: string | null;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

export interface Step {
  index: string;
  title: string;
  body: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface NavItem {
  href: "" | "metoda" | "rezultate" | "despre";
  label: string;
}

export interface Content {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };
  nav: NavItem[];
  contact: {
    fabLabel: string;
    whatsappLabel: string;
    instagramLabel: string;
    prefilledMessage: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    slides: HeroSlide[];
  };
  firstTime: { eyebrow: string; headline: string; body: string[]; image: string; imageAlt: string };
  balance: {
    headline: string;
    beerCaption: string;
    fastfoodCaption: string;
    closing: string;
  };
  method: { eyebrow: string; headline: string; body: string; pillars: Pillar[] };
  david: { eyebrow: string; headline: string; body: string[]; image: string; imageAlt: string };
  results: { eyebrow: string; headline: string; testimonials: Testimonial[]; beforeLabel: string; afterLabel: string };
  process: { eyebrow: string; headline: string; steps: Step[] };
  faq: { eyebrow: string; headline: string; items: Faq[] };
  finalCta: { headline: string; body: string; cta: string };
  footer: { disclaimer: string; languageLabel: string; rights: string };
}
```

- [ ] **Step 2: Scrie conținutul românesc**

`src/content/ro.ts`. Textele vin din spec §5 și **nu se rescriu creativ** la implementare.

```ts
import type { Content } from "./types";

export const ro: Content = {
  meta: {
    title: "David Biriș · Mentorat 1-la-1",
    description:
      "Mentorat 1-la-1 care îmbină sportul pe care îl faci deja — sală, box, înot, cățărat — cu un plan de nutriție care nu îți cere să renunți la viața ta.",
    ogAlt: "David Biriș, mentorat 1-la-1",
  },
  nav: [
    { href: "", label: "Acasă" },
    { href: "metoda", label: "Metoda" },
    { href: "rezultate", label: "Rezultate" },
    { href: "despre", label: "Despre" },
  ],
  contact: {
    fabLabel: "Contact",
    whatsappLabel: "WhatsApp",
    instagramLabel: "Instagram",
    prefilledMessage: "Salut David, am văzut site-ul și vreau să aflu mai multe despre mentorat.",
  },
  hero: {
    headline: "Nu te învăț să faci sală. Te învăț să îți placă.",
    subheadline:
      "Mentorat 1-la-1 care îmbină sportul pe care îl faci deja — box, înot, cățărat, sală — cu un plan de nutriție care nu îți cere să renunți la viața ta.",
    ctaPrimary: "Scrie-i lui David pe WhatsApp",
    ctaSecondary: "Vezi metoda",
    slides: [
      { id: "sala", word: "Ridică", video: "01-sala", poster: "poster-01-sala", alt: "David antrenându-se în sală" },
      { id: "box", word: "Lovește", video: "02-box", poster: "poster-02-box", alt: "Antrenament de box în doi" },
      { id: "catarat", word: "Cațără", video: "03-catarat", poster: "poster-03-catarat", alt: "Cățărare pe stâncă, cu coardă și cască" },
      { id: "apa", word: "Sari", video: "04-apa", poster: "poster-04-apa", alt: "Săritură de pe stâncă în mare" },
      { id: "alergare", word: "Aleargă", video: "05-alergare", poster: "poster-05-alergare", alt: "Alergare pe plajă în zori" },
    ],
  },
  firstTime: {
    eyebrow: "Pentru prima dată",
    headline: "Cineva te învață cum să începi să îți placă sala — nu cum să o suporți.",
    body: [
      "Majoritatea programelor îți dau exerciții și te lasă să te descurci cu partea grea, care e să te întorci săptămâna viitoare.",
      "Aici lucrăm invers. Construim întâi obiceiul și motivul, apoi încărcăm greutatea.",
      "Ținta nu e să reziști opt săptămâni. E ca peste doi ani să ți se pară ciudat să nu te antrenezi.",
    ],
    image: "training-bench",
    imageAlt: "David în sală, între serii",
  },
  balance: {
    headline: "Nu trebuie să lași totul în urmă ca să îți schimbi fizicul.",
    beerCaption: "Berea de pe plajă nu îți anulează luna. Bere în fiecare seară, da.",
    fastfoodCaption: "Nici burgerul din aeroport. Ce contează e ce faci în restul săptămânii.",
    closing:
      "Ai nevoie de o balanță, nu de o pedeapsă. Planurile care interzic tot funcționează trei săptămâni și apoi te lasă mai rău decât te-au găsit. Un plan bun are loc în el pentru viața pe care o trăiești deja.",
  },
  method: {
    eyebrow: "Metoda",
    headline: "Se construiește peste ce faci deja.",
    body: "Nu îți cerem să renunți la sportul tău ca să faci sală. Sala devine structura care le face pe toate celelalte mai bune.",
    pillars: [
      { id: "sala", name: "Sală", angle: "Baza. Structura peste care se așază tot restul." },
      { id: "box", name: "Box", angle: "Condiție, coordonare, capul limpede." },
      { id: "inot", name: "Înot", angle: "Recuperare activă, plămâni, articulații odihnite." },
      { id: "catarat", name: "Cățărat", angle: "Forță reală, priză, control al corpului." },
      { id: "nutritie", name: "Nutriție", angle: "Mâncare pe care o mănânci și peste un an, nu doar în deficit." },
      { id: "consistenta", name: "Consistență", angle: "Singura variabilă care contează pe termen lung." },
    ],
  },
  david: {
    eyebrow: "Cine te învață",
    headline: "7 ani în sală. Anul 2 la Medicină.",
    body: [
      "A intrat în sală la 13 ani și nu s-a mai oprit.",
      "Studiază Medicina, deci înțelege ce se întâmplă în corp când ridici greutatea, nu doar câte repetări să faci.",
      "Antrenează oameni pentru că a fost și el la început și știe exact unde se rupe firul.",
    ],
    image: "david-formal",
    imageAlt: "David Biriș",
  },
  results: {
    eyebrow: "Rezultate",
    headline: "Doi oameni, două puncte de plecare diferite.",
    beforeLabel: "Înainte",
    afterLabel: "După",
    testimonials: [
      {
        id: "darius",
        name: "Darius B.",
        quote:
          "Cu ajutorul lui David nu doar că mi-am schimbat corpul. Sala a devenit un hobby adevărat — și, mai important, ideea de a te îmbunătăți puțin în fiecare zi.",
        note: null,
        beforeSrc: "darius-before",
        afterSrc: "darius-after",
        beforeAlt: "Darius înainte de mentorat",
        afterAlt: "Darius după mentorat",
      },
      {
        id: "meril",
        name: "Meril",
        quote:
          "Am venit din Elveția ca să studiez Medicina și nu vorbesc română. Cu David ne-am înțeles perfect de la început și am făcut un progres mare în scurt timp.",
        note: "Mentoratul funcționează și în engleză.",
        beforeSrc: "meril-before",
        afterSrc: "meril-after",
        beforeAlt: "Meril înainte de mentorat",
        afterAlt: "Meril după mentorat",
      },
    ],
  },
  process: {
    eyebrow: "Cum decurge",
    headline: "Trei pași, fără formulare.",
    steps: [
      { index: "01", title: "Scrii", body: "Un mesaj pe WhatsApp sau Instagram. Prima discuție e gratuită." },
      { index: "02", title: "Construim planul", body: "Pornind de la ce sport faci, cât timp ai și ce mănânci acum." },
      { index: "03", title: "Ajustăm", body: "Săptămână de săptămână, cu acces direct la David." },
    ],
  },
  faq: {
    eyebrow: "Întrebări",
    headline: "Ce te oprește, de fapt.",
    items: [
      { question: "N-am timp, am facultate.", answer: "Și David are. Planul se construiește în jurul orarului tău, nu invers." },
      { question: "N-am mai fost niciodată în sală.", answer: "E cazul cel mai bun. N-ai obiceiuri proaste de dezvățat." },
      {
        question: "Trebuie să renunț la ieșiri și la bere?",
        answer:
          "Nu. Un plan care interzice tot ține trei săptămâni. Construim unul în care încap și ieșirile, pentru că altfel nu îl ții.",
      },
      { question: "Nu vorbesc română.", answer: "Meril nu vorbește nici el. Mentoratul merge în engleză." },
    ],
  },
  finalCta: {
    headline: "Prima discuție e gratuită.",
    body: "Scrii, vorbim, îți spun sincer dacă te pot ajuta. Dacă nu simți că e pentru tine, nu se întâmplă nimic.",
    cta: "Scrie-i lui David pe WhatsApp",
  },
  footer: {
    disclaimer:
      "David Biriș este student la Medicină, nu medic sau nutriționist licențiat. Mentoratul nu înlocuiește sfatul medical. Dacă ai o afecțiune, vorbește întâi cu medicul tău.",
    languageLabel: "Limbă",
    rights: "David Biriș",
  },
};
```

- [ ] **Step 3: Scrie conținutul englezesc**

`src/content/en.ts` — tipat `Content`, cu aceeași formă ca `ro.ts`. Traducerea e adaptată, nu literală: „7 ani în sală" devine „7 years under the bar", nu „7 years in the gym room". Conținutul complet e mai jos; nu-l rescrie creativ.

```ts
import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "David Biriș · 1-on-1 Mentoring",
    description:
      "One-on-one mentoring that combines the sport you already do — lifting, boxing, swimming, climbing — with a nutrition plan that doesn't ask you to give up your life.",
    ogAlt: "David Biriș, one-on-one mentoring",
  },
  nav: [
    { href: "", label: "Home" },
    { href: "metoda", label: "Method" },
    { href: "rezultate", label: "Results" },
    { href: "despre", label: "About" },
  ],
  contact: {
    fabLabel: "Contact",
    whatsappLabel: "WhatsApp",
    instagramLabel: "Instagram",
    prefilledMessage: "Hi David, I saw your site and I'd like to know more about the mentoring.",
  },
  hero: {
    headline: "I won't teach you to train. I'll teach you to want to.",
    subheadline:
      "One-on-one mentoring that combines the sport you already do — boxing, swimming, climbing, lifting — with a nutrition plan that doesn't ask you to give up your life.",
    ctaPrimary: "Message David on WhatsApp",
    ctaSecondary: "See the method",
    slides: [
      { id: "sala", word: "Lift", video: "01-sala", poster: "poster-01-sala", alt: "David training in the gym" },
      { id: "box", word: "Strike", video: "02-box", poster: "poster-02-box", alt: "Boxing session for two" },
      { id: "catarat", word: "Climb", video: "03-catarat", poster: "poster-03-catarat", alt: "Rock climbing with rope and helmet" },
      { id: "apa", word: "Jump", video: "04-apa", poster: "poster-04-apa", alt: "Cliff jump into the sea" },
      { id: "alergare", word: "Run", video: "05-alergare", poster: "poster-05-alergare", alt: "Running on the beach at dawn" },
    ],
  },
  firstTime: {
    eyebrow: "For the first time",
    headline: "Someone teaches you how to start enjoying the gym — not how to endure it.",
    body: [
      "Most programmes hand you exercises and leave you alone with the hard part, which is coming back next week.",
      "Here we work the other way round. We build the habit and the reason first, then we add the weight.",
      "The goal isn't to survive eight weeks. It's that in two years, not training feels strange.",
    ],
    image: "training-bench",
    imageAlt: "David in the gym, between sets",
  },
  balance: {
    headline: "You don't have to give everything up to change your body.",
    beerCaption: "A beer on the beach doesn't undo your month. A beer every night does.",
    fastfoodCaption: "Neither does the airport burger. What counts is the rest of the week.",
    closing:
      "You need balance, not punishment. Plans that ban everything work for three weeks and then leave you worse off than they found you. A good plan has room in it for the life you already live.",
  },
  method: {
    eyebrow: "The method",
    headline: "It builds on what you already do.",
    body: "We're not asking you to drop your sport to make room for the gym. The gym becomes the structure that makes everything else better.",
    pillars: [
      { id: "sala", name: "Lifting", angle: "The base. The structure everything else sits on." },
      { id: "box", name: "Boxing", angle: "Conditioning, coordination, a clear head." },
      { id: "inot", name: "Swimming", angle: "Active recovery, lungs, joints that get a break." },
      { id: "catarat", name: "Climbing", angle: "Real strength, grip, control over your own body." },
      { id: "nutritie", name: "Nutrition", angle: "Food you'll still be eating in a year, not just while cutting." },
      { id: "consistenta", name: "Consistency", angle: "The only variable that matters long term." },
    ],
  },
  david: {
    eyebrow: "Who teaches you",
    headline: "7 years under the bar. Second year of medical school.",
    body: [
      "He walked into a gym at 13 and never stopped.",
      "He studies medicine, so he understands what happens inside the body when you lift — not just how many reps to do.",
      "He coaches people because he started where you are and knows exactly where it falls apart.",
    ],
    image: "david-formal",
    imageAlt: "David Biriș",
  },
  results: {
    eyebrow: "Results",
    headline: "Two people, two different starting points.",
    beforeLabel: "Before",
    afterLabel: "After",
    testimonials: [
      {
        id: "darius",
        name: "Darius B.",
        quote:
          "With David's help I didn't just change my body. The gym turned into a real hobby — and, more than that, so did the idea of getting a little better every day.",
        note: null,
        beforeSrc: "darius-before",
        afterSrc: "darius-after",
        beforeAlt: "Darius before the mentoring",
        afterAlt: "Darius after the mentoring",
      },
      {
        id: "meril",
        name: "Meril",
        quote:
          "I came from Switzerland to study medicine and I don't speak Romanian. David and I understood each other perfectly from the start, and I made a lot of progress in a short time.",
        note: "The mentoring works in English too.",
        beforeSrc: "meril-before",
        afterSrc: "meril-after",
        beforeAlt: "Meril before the mentoring",
        afterAlt: "Meril after the mentoring",
      },
    ],
  },
  process: {
    eyebrow: "How it works",
    headline: "Three steps, no forms.",
    steps: [
      { index: "01", title: "You write", body: "A message on WhatsApp or Instagram. The first conversation is free." },
      { index: "02", title: "We build the plan", body: "Starting from the sport you do, the time you have and what you eat now." },
      { index: "03", title: "We adjust", body: "Week by week, with direct access to David." },
    ],
  },
  faq: {
    eyebrow: "Questions",
    headline: "What's actually stopping you.",
    items: [
      { question: "I don't have time, I'm at university.", answer: "So is David. The plan is built around your schedule, not the other way round." },
      { question: "I've never set foot in a gym.", answer: "That's the best case. You have no bad habits to unlearn." },
      {
        question: "Do I have to give up going out and drinking?",
        answer:
          "No. A plan that bans everything lasts three weeks. We build one that has room for going out, because otherwise you won't stick to it.",
      },
      { question: "I don't speak Romanian.", answer: "Neither does Meril. The mentoring runs in English." },
    ],
  },
  finalCta: {
    headline: "The first conversation is free.",
    body: "You write, we talk, and I'll tell you honestly whether I can help. If it doesn't feel right for you, nothing happens.",
    cta: "Message David on WhatsApp",
  },
  footer: {
    disclaimer:
      "David Biriș is a medical student, not a doctor or a licensed nutritionist. This mentoring does not replace medical advice. If you have a health condition, talk to your doctor first.",
    languageLabel: "Language",
    rights: "David Biriș",
  },
};
```

Notă pentru traducere: în EN, slug-urile din `nav[].href` rămân neschimbate (`metoda`, `rezultate`, `despre`) — se traduc doar etichetele. Rutele sunt segmente tehnice, nu cuvinte cheie.

Notă pentru `pillars`: `id`-urile rămân în română în ambele limbi. Sunt chei de identitate, nu text vizibil — testul de paritate din pasul 5 se bazează pe asta.

- [ ] **Step 4: Scrie selectorul de conținut**

`src/content/index.ts`:

```ts
import { en } from "./en";
import { ro } from "./ro";
import type { Content, Locale } from "./types";

const CONTENT: Record<Locale, Content> = { ro, en };

export function getContent(locale: Locale): Content {
  return CONTENT[locale];
}

export * from "./types";
```

- [ ] **Step 5: Scrie testul de paritate**

`src/content/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { en } from "./en";
import { ro } from "./ro";
import { LOCALES, isLocale } from "./types";

function deepKeys(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => deepKeys(item, `${prefix}[${index}]`));
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return [path, ...deepKeys(child, path)];
    });
  }
  return [];
}

describe("content parity", () => {
  it("has the same shape in both locales", () => {
    expect(deepKeys(en)).toEqual(deepKeys(ro));
  });

  it("has the same number of hero slides", () => {
    expect(en.hero.slides).toHaveLength(ro.hero.slides.length);
  });

  it("keeps route slugs untranslated", () => {
    expect(en.nav.map((item) => item.href)).toEqual(ro.nav.map((item) => item.href));
  });

  it("has no empty strings", () => {
    for (const locale of [ro, en]) {
      const flat = JSON.stringify(locale);
      expect(flat).not.toContain('""');
    }
  });
});

describe("isLocale", () => {
  it("accepts known locales", () => {
    for (const locale of LOCALES) expect(isLocale(locale)).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});
```

- [ ] **Step 6: Rulează testul**

Run: `npm run test`
Expected: PASS. Conținutul EN e deja complet din pasul 3, deci testul trece din prima. Rolul lui nu e să conducă scrierea, ci să prindă desincronizarea de mai târziu — momentul în care cineva adaugă un câmp în `ro.ts` și uită de `en.ts`.

- [ ] **Step 7: Verifică că testul chiar poate să pice**

Un test care n-a picat niciodată nu e un test. Șterge temporar câmpul `finalCta.body` din `en.ts`.

Run: `npm run test && npm run typecheck`
Expected: FAIL la „has the same shape in both locales", **și** eroare de la `tsc` pentru câmp lipsă. Pune câmpul la loc și rulează din nou — PASS.

Notă de traducere: citatul lui Meril e vorbirea lui directă, deci versiunea EN e cea firească și cea RO e traducerea. Nu inventa detalii care nu-s în spec — știm doar că nu vorbește română, nu ce limbă vorbește nativ.

- [ ] **Step 8: Scrie modulul de site**

`src/lib/site.ts`:

```ts
import { DEFAULT_LOCALE, type Locale } from "@/content/types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://david-biris.vercel.app";

export const ROUTES = ["", "metoda", "rezultate", "despre"] as const;
export type RouteKey = (typeof ROUTES)[number];

export function localePath(locale: Locale, route: RouteKey): string {
  return route === "" ? `/${locale}` : `/${locale}/${route}`;
}

export function absoluteUrl(locale: Locale, route: RouteKey): string {
  return `${SITE_URL}${localePath(locale, route)}`;
}

export { DEFAULT_LOCALE };
```

`SITE_URL` vine din env exact ca schimbarea domeniului să fie o singură variabilă în Vercel, nu o căutare prin cod.

- [ ] **Step 9: Creează layout-ul de locale și redirectul**

`src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getContent } from "@/content";
import { LOCALES, isLocale, type Locale } from "@/content/types";
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
  return <div data-locale={locale satisfies Locale}>{children}</div>;
}
```

`src/app/page.tsx` devine:

```tsx
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/site";

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
```

`src/app/[locale]/page.tsx`, provizoriu:

```tsx
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
```

- [ ] **Step 10: Verifică rutarea**

Run: `npm run dev`
Expected: `/` redirectează la `/ro`; `/ro` afișează headline-ul românesc; `/en` pe cel englezesc; `/fr` dă 404.

- [ ] **Step 11: Verifică generarea statică**

Run: `npm run build`
Expected: în raportul de build, `/ro` și `/en` apar ca statice (`○` sau `●`), nu dinamice (`ƒ`). Dacă sunt dinamice, `generateStaticParams` nu e văzut — verifică-i poziția în fișier.

- [ ] **Step 12: Commit**

```bash
git add src/content src/lib/site.ts src/app
git commit -m "feat: rutare pe locale si contract de continut tipat RO/EN"
```

---

### Task 5: Contact și capabilități de device

**Files:**
- Create: `src/lib/contact.ts`, `src/lib/device.ts`
- Test: `src/lib/contact.test.ts`, `src/lib/device.test.ts`

**Interfaces:**
- Consumes: nimic
- Produces:
  - `PHONE_E164: string`, `PHONE_DISPLAY: string`, `INSTAGRAM_HANDLE: string`
  - `whatsappUrl(message: string): string`
  - `instagramUrl(): string`
  - `interface DeviceCapabilities { reducedMotion: boolean; saveData: boolean; slowNetwork: boolean; lowEndCpu: boolean; webgl: boolean }`
  - `shouldPlayVideo(caps: DeviceCapabilities): boolean`
  - `shouldRender3D(caps: DeviceCapabilities): boolean`
  - `useDeviceCapabilities(): DeviceCapabilities` (hook client)

- [ ] **Step 1: Scrie testele de contact — trebuie să pice**

`src/lib/contact.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { INSTAGRAM_HANDLE, PHONE_E164, instagramUrl, whatsappUrl } from "./contact";

describe("whatsappUrl", () => {
  it("uses the wa.me short link with the E.164 number, digits only", () => {
    expect(whatsappUrl("hei")).toContain(`https://wa.me/${PHONE_E164}`);
    expect(PHONE_E164).toMatch(/^\d+$/);
  });

  it("encodes Romanian diacritics in the prefilled message", () => {
    const url = whatsappUrl("Salut, vreau să încep");
    expect(url).toContain("%C4%83"); // ă
    expect(url).toContain("%C3%AEn"); // î
    expect(url).not.toContain(" ");
  });

  it("does not double-encode", () => {
    const url = whatsappUrl("a&b");
    expect(url).toContain("a%26b");
    expect(url).not.toContain("%2526");
  });

  it("omits the text parameter for an empty message", () => {
    expect(whatsappUrl("")).toBe(`https://wa.me/${PHONE_E164}`);
  });
});

describe("instagramUrl", () => {
  it("builds a bare profile url without an @", () => {
    expect(instagramUrl()).toBe(`https://instagram.com/${INSTAGRAM_HANDLE}`);
    expect(INSTAGRAM_HANDLE).not.toContain("@");
  });
});
```

- [ ] **Step 2: Rulează și verifică că pică**

Run: `npm run test src/lib/contact.test.ts`
Expected: FAIL — modulul nu există.

- [ ] **Step 3: Implementează contactul**

`src/lib/contact.ts`:

```ts
export const PHONE_E164 = "40755659389";
export const PHONE_DISPLAY = "+40 755 659 389";

/**
 * TODO(client): handle-ul de Instagram nu a fost furnizat inca.
 * Trebuie inlocuit inainte de publicare — apare si in JSON-LD (sameAs).
 */
export const INSTAGRAM_HANDLE = "davidbiris";

export function whatsappUrl(message: string): string {
  const base = `https://wa.me/${PHONE_E164}`;
  if (message.length === 0) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function instagramUrl(): string {
  return `https://instagram.com/${INSTAGRAM_HANDLE}`;
}
```

- [ ] **Step 4: Rulează și verifică că trece**

Run: `npm run test src/lib/contact.test.ts`
Expected: PASS.

- [ ] **Step 5: Scrie testele de capabilitate — trebuie să pice**

`src/lib/device.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { shouldPlayVideo, shouldRender3D, type DeviceCapabilities } from "./device";

const capable: DeviceCapabilities = {
  reducedMotion: false,
  saveData: false,
  slowNetwork: false,
  lowEndCpu: false,
  webgl: true,
};

describe("shouldPlayVideo", () => {
  it("plays on a capable device", () => {
    expect(shouldPlayVideo(capable)).toBe(true);
  });

  it("refuses when the user asked for reduced motion", () => {
    expect(shouldPlayVideo({ ...capable, reducedMotion: true })).toBe(false);
  });

  it("refuses on data saver", () => {
    expect(shouldPlayVideo({ ...capable, saveData: true })).toBe(false);
  });

  it("refuses on a slow network", () => {
    expect(shouldPlayVideo({ ...capable, slowNetwork: true })).toBe(false);
  });

  it("still plays on a weak cpu — video decoding is hardware accelerated", () => {
    expect(shouldPlayVideo({ ...capable, lowEndCpu: true })).toBe(true);
  });
});

describe("shouldRender3D", () => {
  it("renders on a capable device", () => {
    expect(shouldRender3D(capable)).toBe(true);
  });

  it("refuses without webgl", () => {
    expect(shouldRender3D({ ...capable, webgl: false })).toBe(false);
  });

  it("refuses on a weak cpu", () => {
    expect(shouldRender3D({ ...capable, lowEndCpu: true })).toBe(false);
  });

  it("refuses on reduced motion", () => {
    expect(shouldRender3D({ ...capable, reducedMotion: true })).toBe(false);
  });

  it("refuses on data saver", () => {
    expect(shouldRender3D({ ...capable, saveData: true })).toBe(false);
  });
});
```

Observă asimetria intenționată: un CPU slab oprește 3D-ul dar **nu** oprește video-ul, pentru că decodarea video e accelerată hardware și pe telefoane ieftine, în timp ce WebGL nu e.

- [ ] **Step 6: Rulează și verifică că pică**

Run: `npm run test src/lib/device.test.ts`
Expected: FAIL — modulul nu există.

- [ ] **Step 7: Implementează capabilitățile**

`src/lib/device.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export interface DeviceCapabilities {
  reducedMotion: boolean;
  saveData: boolean;
  slowNetwork: boolean;
  lowEndCpu: boolean;
  webgl: boolean;
}

export const OPTIMISTIC_CAPABILITIES: DeviceCapabilities = {
  reducedMotion: false,
  saveData: false,
  slowNetwork: false,
  lowEndCpu: false,
  webgl: true,
};

export function shouldPlayVideo(caps: DeviceCapabilities): boolean {
  return !caps.reducedMotion && !caps.saveData && !caps.slowNetwork;
}

export function shouldRender3D(caps: DeviceCapabilities): boolean {
  return caps.webgl && !caps.lowEndCpu && !caps.reducedMotion && !caps.saveData;
}

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

function detectWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function detect(): DeviceCapabilities {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  const effectiveType = connection?.effectiveType ?? "4g";
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: connection?.saveData === true,
    slowNetwork: effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g",
    lowEndCpu: navigator.hardwareConcurrency <= 4 || memory <= 4,
    webgl: detectWebgl(),
  };
}

/**
 * Porneste optimist ca sa nu blocheze primul render, apoi corecteaza dupa montare.
 * Consecinta: pe un device slab, 3D-ul nu se monteaza niciodata (se decide dupa efect),
 * iar video-ul poate porni si apoi sa fie oprit — acceptabil, e un singur cadru.
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(OPTIMISTIC_CAPABILITIES);

  useEffect(() => {
    setCapabilities(detect());

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setCapabilities(detect());
    motionQuery.addEventListener("change", onChange);
    return () => motionQuery.removeEventListener("change", onChange);
  }, []);

  return capabilities;
}
```

Directiva `"use client"` la începutul fișierului nu împiedică testarea funcțiilor pure sub Vitest — e ignorată în afara bundler-ului Next.

- [ ] **Step 8: Rulează toate testele**

Run: `npm run test`
Expected: PASS, toate suitele.

- [ ] **Step 9: Commit**

```bash
git add src/lib/contact.ts src/lib/contact.test.ts src/lib/device.ts src/lib/device.test.ts
git commit -m "feat: modul de contact si porti de capabilitate pentru device"
```

---

### Task 6: Primitive de interfață

**Files:**
- Create: `src/components/ui/Section.tsx`, `src/components/ui/Reveal.tsx`, `src/components/ui/CtaButton.tsx`

**Interfaces:**
- Consumes: `whatsappUrl` din Task 5
- Produces:
  - `<Section id?: string; eyebrow?: string; headline?: string; tone?: "ink" | "deep"; className?: string; children>` — server component
  - `<Reveal delay?: number; children>` — client, intrare cu 16px translate + fade, dezactivată la reduced motion
  - `<CtaButton href: string; variant?: "primary" | "ghost"; external?: boolean; children>` — server component

- [ ] **Step 1: Scrie `Section`**

`src/components/ui/Section.tsx`:

```tsx
import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  headline?: string;
  tone?: "ink" | "deep";
  className?: string;
  children?: ReactNode;
}

export function Section({ id, eyebrow, headline, tone = "ink", className = "", children }: SectionProps) {
  const background = tone === "deep" ? "bg-deep/25" : "bg-ink";
  return (
    <section id={id} className={`${background} px-5 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1200px]">
        {eyebrow ? (
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ember">{eyebrow}</p>
        ) : null}
        {headline ? (
          <h2 className="font-display text-[clamp(2rem,7vw,4.5rem)] max-w-[18ch]">{headline}</h2>
        ) : null}
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Scrie `Reveal`**

`src/components/ui/Reveal.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

Când `prefers-reduced-motion` e activ, componenta iese complet din drum și randează copiii direct — fără wrapper, fără `opacity: 0` rămas blocat dacă `whileInView` nu se declanșează.

- [ ] **Step 3: Scrie `CtaButton`**

`src/components/ui/CtaButton.tsx`:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

interface CtaButtonProps {
  href: string;
  variant?: "primary" | "ghost";
  external?: boolean;
  children: ReactNode;
}

const STYLES = {
  primary: "bg-ember text-ink hover:brightness-110",
  ghost: "border border-hairline text-bone hover:border-bone/40",
} as const;

export function CtaButton({ href, variant = "primary", external = false, children }: CtaButtonProps) {
  const className = `inline-flex min-h-[52px] items-center justify-center rounded-full px-7 text-base font-semibold transition-[filter,border-color] duration-200 ${STYLES[variant]}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
```

Înălțimea minimă 52px depășește pragul de 44px din constrângeri, cu marjă pentru degete mari.

- [ ] **Step 4: Verifică**

Run: `npm run typecheck && npm run dev`
Expected: compilează; folosește temporar primitivele în `[locale]/page.tsx` și confirmă vizual că butonul primar e portocaliu, cel ghost are contur subțire, iar `Reveal` produce o intrare lină la scroll.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui
git commit -m "feat: primitive de interfata Section, Reveal si CtaButton"
```

---

### Task 7: Bottom nav

**Files:**
- Create: `src/components/nav/navigation.ts`, `src/components/nav/BottomNav.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Test: `src/components/nav/navigation.test.ts`

**Interfaces:**
- Consumes: `getContent`, `localePath`, `type RouteKey`
- Produces:
  - `isActiveTab(pathname: string, locale: Locale, href: RouteKey): boolean`
  - `<BottomNav locale: Locale; items: NavItem[]>` — client

- [ ] **Step 1: Scrie testele de navigare — trebuie să pice**

`src/components/nav/navigation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { isActiveTab } from "./navigation";

describe("isActiveTab", () => {
  it("marks home active only on the locale root", () => {
    expect(isActiveTab("/ro", "ro", "")).toBe(true);
    expect(isActiveTab("/ro/metoda", "ro", "")).toBe(false);
  });

  it("marks a sub-route active on exact match", () => {
    expect(isActiveTab("/ro/metoda", "ro", "metoda")).toBe(true);
    expect(isActiveTab("/ro/rezultate", "ro", "metoda")).toBe(false);
  });

  it("tolerates a trailing slash", () => {
    expect(isActiveTab("/ro/", "ro", "")).toBe(true);
    expect(isActiveTab("/ro/metoda/", "ro", "metoda")).toBe(true);
  });

  it("does not leak across locales", () => {
    expect(isActiveTab("/en/metoda", "ro", "metoda")).toBe(false);
    expect(isActiveTab("/en/metoda", "en", "metoda")).toBe(true);
  });

  it("does not match a prefix of a longer route", () => {
    expect(isActiveTab("/ro/rezultate", "ro", "")).toBe(false);
  });
});
```

- [ ] **Step 2: Rulează și verifică că pică**

Run: `npm run test src/components/nav/navigation.test.ts`
Expected: FAIL — modulul nu există.

- [ ] **Step 3: Implementează**

`src/components/nav/navigation.ts`:

```ts
import type { Locale } from "@/content/types";
import type { RouteKey } from "@/lib/site";

export function isActiveTab(pathname: string, locale: Locale, href: RouteKey): boolean {
  const normalized = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const expected = href === "" ? `/${locale}` : `/${locale}/${href}`;
  return normalized === expected;
}
```

- [ ] **Step 4: Rulează și verifică că trece**

Run: `npm run test src/components/nav/navigation.test.ts`
Expected: PASS.

- [ ] **Step 5: Scrie `BottomNav`**

`src/components/nav/BottomNav.tsx`:

```tsx
"use client";

import type { Icon } from "@phosphor-icons/react";
import { Barbell, House, TrendUp, User } from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale, NavItem } from "@/content/types";
import { localePath } from "@/lib/site";
import { isActiveTab } from "./navigation";

const ICONS: Record<NavItem["href"], Icon> = {
  "": House,
  metoda: Barbell,
  rezultate: TrendUp,
  despre: User,
};

export function BottomNav({ locale, items }: { locale: Locale; items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={locale === "ro" ? "Navigare principală" : "Main navigation"}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ink/80 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex h-16 w-full max-w-[520px] items-stretch justify-around lg:max-w-[640px]">
        {items.map((item) => {
          const active = isActiveTab(pathname, locale, item.href);
          const Icon = ICONS[item.href];
          return (
            <li key={item.href} className="relative flex-1">
              <Link
                href={localePath(locale, item.href)}
                aria-current={active ? "page" : undefined}
                className="flex h-full min-h-[44px] flex-col items-center justify-center gap-1"
              >
                <Icon size={24} weight={active ? "fill" : "regular"} />
                <span
                  className={`text-[11px] tracking-wide ${active ? "text-bone" : "text-bone-dim"}`}
                >
                  {item.label}
                </span>
              </Link>
              {active ? (
                <motion.span
                  layoutId="tab-indicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-x-4 top-0 h-[2px] rounded-full bg-ember"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

Iconițele se importă din `@phosphor-icons/react/dist/ssr`, nu din rădăcina pachetului — varianta `ssr` nu forțează întreg arborele de iconițe în bundle-ul de client.

- [ ] **Step 6: Montează în layout**

În `src/app/[locale]/layout.tsx`, înlocuiește `<div data-locale=...>` cu:

```tsx
  return (
    <>
      <div className="pb-nav">{children}</div>
      <BottomNav locale={locale} items={content.nav} />
    </>
  );
```

Adaugă importurile pentru `BottomNav` și `getContent`, și obține `const content = getContent(locale);` după verificarea `isLocale`.

- [ ] **Step 7: Verifică pe telefon simulat**

Run: `npm run dev`, deschide DevTools în mod iPhone 15 Pro.
Expected: nav-ul stă fix jos, nu acoperă conținutul (mulțumită `.pb-nav`), indicatorul portocaliu alunecă între tab-uri când navighezi, iar iconița tab-ului activ e plină. În simulare cu safe-area, nav-ul nu intră peste bara de gesturi.

- [ ] **Step 8: Commit**

```bash
git add src/components/nav src/app/[locale]/layout.tsx
git commit -m "feat: bottom nav cu indicator animat si detectie de tab activ"
```

---

### Task 8: Butonul sticky de contact

**Files:**
- Create: `src/components/nav/ContactFab.tsx`
- Copy: `public/media/brand/instagram.svg`, `public/media/brand/whatsapp.svg`
- Modify: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `whatsappUrl`, `instagramUrl` din Task 5; `content.contact`
- Produces: `<ContactFab labels: Content["contact"]>` — client

- [ ] **Step 1: Copiază logo-urile**

```bash
mkdir -p public/media/brand
cp "assets/instagram_logo/Instagram_logo_2022.svg" public/media/brand/instagram.svg
cp "assets/whatsapp_logo/WhatsApp.svg" public/media/brand/whatsapp.svg
```

- [ ] **Step 2: Scrie componenta**

`src/components/nav/ContactFab.tsx`:

```tsx
"use client";

import { X, ChatCircleDots } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/content/types";
import { instagramUrl, whatsappUrl } from "@/lib/contact";

export function ContactFab({ labels }: { labels: Content["contact"] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const actions = [
    { key: "whatsapp", href: whatsappUrl(labels.prefilledMessage), label: labels.whatsappLabel, icon: "/media/brand/whatsapp.svg" },
    { key: "instagram", href: instagramUrl(), label: labels.instagramLabel, icon: "/media/brand/instagram.svg" },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed right-4 z-50 flex flex-col items-end gap-3"
      style={{ bottom: "calc(64px + env(safe-area-inset-bottom) + 16px)" }}
    >
      <AnimatePresence>
        {open
          ? actions.map((action, index) => (
              <motion.a
                key={action.key}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 320, damping: 26, delay: reduced ? 0 : index * 0.04 }}
                className="flex min-h-[48px] items-center gap-3 rounded-full border border-hairline bg-ink-raised/95 py-2 pl-4 pr-3 backdrop-blur-xl"
              >
                <span className="text-sm font-medium">{action.label}</span>
                {/* eslint-disable-next-line @next/next/no-img-element -- logo de brand static, dimensiuni fixe, fara beneficiu din optimizare */}
                <img src={action.icon} alt="" width={28} height={28} aria-hidden="true" />
              </motion.a>
            ))
          : null}
      </AnimatePresence>

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={labels.fabLabel}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ember text-ink shadow-lg shadow-ember/25"
      >
        <motion.span
          animate={reduced ? undefined : { rotate: open ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="flex items-center justify-center"
        >
          {open ? <X size={26} weight="bold" /> : <ChatCircleDots size={26} weight="fill" />}
        </motion.span>
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Montează în layout**

În `src/app/[locale]/layout.tsx`, adaugă `<ContactFab labels={content.contact} />` lângă `<BottomNav />`.

- [ ] **Step 4: Verifică comportamentul**

Run: `npm run dev`
Expected, în ordine:
- FAB-ul stă deasupra bottom nav-ului, nu peste el, și nu acoperă conținut important
- Tap → cele două acțiuni apar de jos în sus, cu decalaj vizibil între ele
- `Escape` închide și readuce focusul pe buton
- Tap în afară închide
- Tab-ul ajunge la ambele acțiuni când e deschis
- `aria-expanded` se schimbă (verifică în panoul Accessibility)

- [ ] **Step 5: Verifică link-urile pe telefon real**

Deschide site-ul de pe telefon (`npm run dev -- -H 0.0.0.0`, apoi IP-ul din rețea).
Expected: WhatsApp se deschide în aplicație, cu mesajul precompletat corect, **cu diacritice intacte**. Instagram deschide profilul.

**Blocant cunoscut:** `INSTAGRAM_HANDLE` din `src/lib/contact.ts` e o valoare provizorie marcată `TODO`. Link-ul va duce într-un profil greșit sau inexistent până când clientul furnizează handle-ul real. Notează asta în commit, nu o ascunde.

- [ ] **Step 6: Commit**

```bash
git add src/components/nav/ContactFab.tsx public/media/brand src/app/[locale]/layout.tsx
git commit -m "feat: buton sticky de contact cu WhatsApp si Instagram

Handle-ul de Instagram e inca provizoriu (TODO in lib/contact.ts)."
```

---

### Task 9: Hero cu slideshow de video

**Files:**
- Create: `src/components/hero/storyNavigation.ts`, `src/components/hero/StoryProgress.tsx`, `src/components/hero/StoryVideo.tsx`, `src/components/hero/HeroStories.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Test: `src/components/hero/storyNavigation.test.ts`

**Interfaces:**
- Consumes: `HeroSlide`, `useDeviceCapabilities`, `shouldPlayVideo`
- Produces:
  - `SLIDE_DURATION_MS: number`
  - `nextIndex(current: number, total: number): number`
  - `prevIndex(current: number, total: number): number`
  - `tapZone(clientX: number, left: number, width: number): "prev" | "next"`
  - `<HeroStories slides: HeroSlide[]; headline: string; subheadline: string; ctaPrimary: string; ctaPrimaryHref: string; ctaSecondary: string; ctaSecondaryHref: string>`

- [ ] **Step 1: Scrie testele de navigare — trebuie să pice**

`src/components/hero/storyNavigation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { nextIndex, prevIndex, tapZone } from "./storyNavigation";

describe("nextIndex", () => {
  it("advances", () => {
    expect(nextIndex(0, 5)).toBe(1);
  });

  it("wraps at the end", () => {
    expect(nextIndex(4, 5)).toBe(0);
  });

  it("stays put with a single slide", () => {
    expect(nextIndex(0, 1)).toBe(0);
  });
});

describe("prevIndex", () => {
  it("goes back", () => {
    expect(prevIndex(2, 5)).toBe(1);
  });

  it("wraps at the start", () => {
    expect(prevIndex(0, 5)).toBe(4);
  });
});

describe("tapZone", () => {
  it("treats the left third as previous", () => {
    expect(tapZone(50, 0, 360)).toBe("prev");
  });

  it("treats the rest as next", () => {
    expect(tapZone(200, 0, 360)).toBe("next");
    expect(tapZone(350, 0, 360)).toBe("next");
  });

  it("accounts for the element offset", () => {
    expect(tapZone(150, 100, 360)).toBe("prev");
    expect(tapZone(300, 100, 360)).toBe("next");
  });

  it("never returns prev for a zero-width element", () => {
    expect(tapZone(0, 0, 0)).toBe("next");
  });
});
```

- [ ] **Step 2: Rulează și verifică că pică**

Run: `npm run test src/components/hero/storyNavigation.test.ts`
Expected: FAIL — modulul nu există.

- [ ] **Step 3: Implementează**

`src/components/hero/storyNavigation.ts`:

```ts
export const SLIDE_DURATION_MS = 6000;
export const HOLD_THRESHOLD_MS = 250;
export const SWIPE_THRESHOLD_PX = 40;

export function nextIndex(current: number, total: number): number {
  if (total <= 0) return 0;
  return (current + 1) % total;
}

export function prevIndex(current: number, total: number): number {
  if (total <= 0) return 0;
  return (current - 1 + total) % total;
}

export function tapZone(clientX: number, left: number, width: number): "prev" | "next" {
  if (width <= 0) return "next";
  return clientX - left < width / 3 ? "prev" : "next";
}
```

- [ ] **Step 4: Rulează și verifică că trece**

Run: `npm run test src/components/hero/storyNavigation.test.ts`
Expected: PASS.

- [ ] **Step 5: Scrie barele de progres**

`src/components/hero/StoryProgress.tsx`:

```tsx
"use client";

interface StoryProgressProps {
  total: number;
  active: number;
  paused: boolean;
  durationMs: number;
  animate: boolean;
  onComplete: () => void;
}

export function StoryProgress({ total, active, paused, durationMs, animate, onComplete }: StoryProgressProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex gap-1.5 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      {Array.from({ length: total }, (_, index) => (
        <div key={index} className="h-[3px] flex-1 overflow-hidden rounded-full bg-bone/25">
          <div
            className="h-full origin-left bg-bone"
            style={
              index < active
                ? { transform: "scaleX(1)" }
                : index === active
                  ? {
                      animationName: animate ? "story-fill" : undefined,
                      animationDuration: `${durationMs}ms`,
                      animationTimingFunction: "linear",
                      animationFillMode: "forwards",
                      animationPlayState: paused ? "paused" : "running",
                      transform: animate ? undefined : "scaleX(0)",
                    }
                  : { transform: "scaleX(0)" }
            }
            onAnimationEnd={index === active ? onComplete : undefined}
          />
        </div>
      ))}
    </div>
  );
}
```

Adaugă keyframe-ul în `src/app/globals.css`:

```css
@keyframes story-fill {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
```

Animația CSS conduce avansarea prin `onAnimationEnd`. Asta e intenționat: pauza devine `animationPlayState`, iar progresul nu costă niciun cadru de JavaScript.

**Atenție:** blocul global `@media (prefers-reduced-motion: reduce)` din Task 3 setează `animation-duration: 0.01ms`, deci la reduced motion `onAnimationEnd` s-ar declanșa aproape instantaneu și slideshow-ul ar galopa. De aceea `animate` e `false` în acel caz, iar avansarea se face prin `setTimeout` în `HeroStories` (pasul următor).

- [ ] **Step 6: Scrie clipul individual**

`src/components/hero/StoryVideo.tsx`:

```tsx
"use client";

import Image from "next/image";
import { forwardRef } from "react";
import type { HeroSlide } from "@/content/types";

interface StoryVideoProps {
  slide: HeroSlide;
  active: boolean;
  playVideo: boolean;
  priority: boolean;
  onError: () => void;
}

export const StoryVideo = forwardRef<HTMLVideoElement, StoryVideoProps>(function StoryVideo(
  { slide, active, playVideo, priority, onError },
  ref,
) {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-[400ms] ease-[var(--ease-out-expo)]"
      style={{ opacity: active ? 1 : 0 }}
      aria-hidden={!active}
    >
      <Image
        src={`/media/img/${slide.poster}.avif`}
        alt={slide.alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
      {playVideo ? (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload={priority ? "auto" : "none"}
          poster={`/media/img/${slide.poster}.webp`}
          onError={onError}
        >
          <source src={`/media/video/${slide.video}.webm`} type="video/webm" />
          <source src={`/media/video/${slide.video}.mp4`} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
});
```

Posterul stă mereu dedesubt ca `next/image`. Dacă videoclipul nu pornește — autoplay respins, rețea proastă, fișier corupt — utilizatorul vede oricum o imagine bună, nu un dreptunghi negru.

- [ ] **Step 7: Scrie orchestratorul**

`src/components/hero/HeroStories.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/content/types";
import { shouldPlayVideo, useDeviceCapabilities } from "@/lib/device";
import { CtaButton } from "@/components/ui/CtaButton";
import { StoryProgress } from "./StoryProgress";
import { StoryVideo } from "./StoryVideo";
import { HOLD_THRESHOLD_MS, SLIDE_DURATION_MS, SWIPE_THRESHOLD_PX, nextIndex, prevIndex, tapZone } from "./storyNavigation";

interface HeroStoriesProps {
  slides: HeroSlide[];
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
}

export function HeroStories({
  slides,
  headline,
  subheadline,
  ctaPrimary,
  ctaPrimaryHref,
  ctaSecondary,
  ctaSecondaryHref,
}: HeroStoriesProps) {
  const capabilities = useDeviceCapabilities();
  const playVideo = shouldPlayVideo(capabilities);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState<Set<number>>(new Set());

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const pointerStart = useRef<{ x: number; time: number } | null>(null);

  const total = slides.length;
  const goNext = useCallback(() => setActive((index) => nextIndex(index, total)), [total]);
  const goPrev = useCallback(() => setActive((index) => prevIndex(index, total)), [total]);

  // Reduced motion: animatia CSS e neutralizata global, deci temporizam manual.
  useEffect(() => {
    if (playVideo || paused) return;
    const timer = window.setTimeout(goNext, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, playVideo, goNext]);

  // Reda doar clipul activ; restul raman oprite ca sa nu tina decodoare ocupate.
  useEffect(() => {
    if (!playVideo) return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active) {
        video.currentTime = 0;
        void video.play().catch(() => setPaused(false));
      } else {
        video.pause();
      }
    });
  }, [active, playVideo]);

  // Preincarca urmatorul clip cand browserul e liber.
  useEffect(() => {
    if (!playVideo) return;
    const upcoming = videoRefs.current[nextIndex(active, total)];
    if (!upcoming || upcoming.preload === "auto") return;

    const warm = () => {
      upcoming.preload = "auto";
      upcoming.load();
    };

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(warm);
      return () => window.cancelIdleCallback(handle);
    }

    const handle = window.setTimeout(warm, 400);
    return () => window.clearTimeout(handle);
  }, [active, playVideo, total]);

  // Un clip stricat nu blocheaza slideshow-ul.
  const handleError = useCallback(
    (index: number) => {
      setFailed((current) => new Set(current).add(index));
      if (index === active) goNext();
    },
    [active, goNext],
  );

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    pointerStart.current = { x: event.clientX, time: Date.now() };
    setPaused(true);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    setPaused(false);
    if (!start) return;

    const dx = event.clientX - start.x;
    const held = Date.now() - start.time;

    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
      if (dx < 0) goNext();
      else goPrev();
      return;
    }

    if (held >= HOLD_THRESHOLD_MS) return; // a fost o tinere apasata, nu un tap

    const rect = event.currentTarget.getBoundingClientRect();
    if (tapZone(event.clientX, rect.left, rect.width) === "prev") goPrev();
    else goNext();
  }

  const activeSlide = slides[active];

  return (
    <section
      className="relative h-[100dvh] w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label={headline}
    >
      <div
        className="absolute inset-0"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerStart.current = null;
          setPaused(false);
        }}
      >
        {slides.map((slide, index) => (
          <StoryVideo
            key={slide.id}
            ref={(element) => {
              videoRefs.current[index] = element;
            }}
            slide={slide}
            active={index === active}
            playVideo={playVideo && !failed.has(index)}
            priority={index === 0}
            onError={() => handleError(index)}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/70" />

      <StoryProgress
        total={total}
        active={active}
        paused={paused}
        durationMs={SLIDE_DURATION_MS}
        animate={playVideo}
        onComplete={goNext}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-[calc(64px+env(safe-area-inset-bottom)+2rem)]">
        <p className="font-display text-[clamp(2.5rem,14vw,6rem)] text-ember">{activeSlide?.word}</p>
        <h1 className="mt-3 font-display text-[clamp(1.75rem,6.5vw,3.5rem)] max-w-[16ch]">{headline}</h1>
        <p className="mt-4 max-w-[42ch] text-base text-bone-dim">{subheadline}</p>
        <div className="pointer-events-auto mt-7 flex flex-col gap-3 sm:flex-row">
          <CtaButton href={ctaPrimaryHref} external>
            {ctaPrimary}
          </CtaButton>
          <CtaButton href={ctaSecondaryHref} variant="ghost">
            {ctaSecondary}
          </CtaButton>
        </div>
      </div>

      <div className="sr-only">
        <button type="button" onClick={goPrev}>
          Previous
        </button>
        <button type="button" onClick={goNext}>
          Next
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Montează în homepage**

În `src/app/[locale]/page.tsx`, randează `<HeroStories …>` cu `ctaPrimaryHref={whatsappUrl(content.contact.prefilledMessage)}` și `ctaSecondaryHref={localePath(locale, "metoda")}`.

- [ ] **Step 9: Verifică fiecare degradare, una câte una**

Run: `npm run dev`, pe iPhone simulat.

| Verificare | Cum o forțezi | Rezultat așteptat |
|---|---|---|
| Redare normală | — | Clipurile rulează, barele se umplu în 6s, avansează singure |
| Tap dreapta | tap în dreapta ecranului | Clip următor |
| Tap stânga | tap în treimea stângă | Clip anterior |
| Ținere apăsată | ține degetul 1s | Bara se oprește, reia la ridicare, **nu** schimbă clipul |
| Swipe | trage lateral peste 40px | Schimbă clipul în direcția tragerii |
| Reduced motion | DevTools → Rendering → `prefers-reduced-motion: reduce` | Doar postere, fără video, avansare tot la 6s |
| Rețea lentă | DevTools → Network → Slow 4G, reîncarcă | Doar postere |
| Clip stricat | redenumește temporar `01-sala.mp4` și `.webm` | Sare automat la clipul următor, fără ecran negru |
| Autoplay respins | Safari desktop cu autoplay blocat în setări | Rămâne posterul, nu crapă |

- [ ] **Step 10: Verifică înălțimea pe iOS**

Deschide pe un iPhone real, în Safari, și derulează în sus și în jos.
Expected: `100dvh` face hero-ul să ocupe exact ecranul, iar bara de adresă care se retrage **nu** produce salt de layout. Dacă apare salt, problema e `100vh` rămas undeva — caută-l.

- [ ] **Step 11: Commit**

```bash
git add src/components/hero src/app/[locale]/page.tsx src/app/globals.css
git commit -m "feat: hero cu slideshow video in format story si degradari complete"
```

---

### Task 10: Secțiunile „Pentru prima dată" și „Echilibru"

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Create: `src/components/sections/FirstTime.tsx`, `src/components/sections/Balance.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `content.firstTime`, `content.balance`
- Produces: `<FirstTime data: Content["firstTime"]>`, `<Balance data: Content["balance"]>`

- [ ] **Step 1: Scrie `FirstTime`**

`src/components/sections/FirstTime.tsx`:

```tsx
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function FirstTime({ data }: { data: Content["firstTime"] }) {
  return (
    <Section eyebrow={data.eyebrow} headline={data.headline}>
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5 text-lg leading-relaxed text-bone-dim">
          {data.body.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 0.05}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src={`/media/img/${data.image}.avif`}
              alt={data.imageAlt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Scrie `Balance`**

`src/components/sections/Balance.tsx`:

```tsx
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function Balance({ data }: { data: Content["balance"] }) {
  const items = [
    { src: "balance-beer", caption: data.beerCaption, alt: data.beerCaption },
    { src: "balance-fastfood", caption: data.fastfoodCaption, alt: data.fastfoodCaption },
  ];

  return (
    <Section tone="deep" headline={data.headline}>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {items.map((item, index) => (
          <Reveal key={item.src} delay={index * 0.08}>
            <figure>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={`/media/img/${item.src}.avif`}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 text-lg leading-snug">{item.caption}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.16}>
        <p className="mt-12 max-w-[52ch] text-lg leading-relaxed text-bone-dim">{data.closing}</p>
      </Reveal>
    </Section>
  );
}
```

Legendele sunt și text alternativ. Sunt descriptive și în context — o poză cu o bere de plajă descrisă drept „Berea de pe plajă nu îți anulează luna" spune unui cititor de ecran exact ce spune imaginea unui văzător.

- [ ] **Step 3: Montează ambele în homepage**

Adaugă `<FirstTime data={content.firstTime} />` și `<Balance data={content.balance} />` sub hero, în `src/app/[locale]/page.tsx`.

- [ ] **Step 4: Verifică**

Run: `npm run dev`
Expected: pe mobil, cele două poze stau una sub alta, cu legenda lipită de fiecare; peste 640px stau alături. Fundalul secțiunii Echilibru e vizibil mai cald/verzui decât restul. Textele intră lin la scroll și rămân vizibile.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections src/app/[locale]/page.tsx
git commit -m "feat: sectiunile Pentru prima data si Echilibru"
```

---

### Task 11: Scena 3D cu bara de haltere

**Files:**
- Create: `src/components/method/BarbellScene.tsx`, `src/components/method/BarbellFallback.tsx`

**Interfaces:**
- Consumes: `Pillar[]`
- Produces:
  - `<BarbellScene pillars: Pillar[]; mountedCount: number>` — client, se importă doar prin `dynamic(..., { ssr: false })`
  - `<BarbellFallback pillars: Pillar[]>` — client sau server

- [ ] **Step 1: Scrie fallback-ul întâi**

Fallback-ul se scrie primul intenționat: dacă e bun de la început, nu există tentația de a trata 3D-ul ca obligatoriu.

`src/components/method/BarbellFallback.tsx`:

```tsx
import type { Pillar } from "@/content/types";

export function BarbellFallback({ pillars }: { pillars: Pillar[] }) {
  return (
    <div className="relative flex h-full min-h-[320px] w-full items-center justify-center">
      <div className="relative h-[3px] w-full max-w-[520px] rounded-full bg-bone/40">
        {pillars.map((pillar, index) => {
          const side = index % 2 === 0 ? 1 : -1;
          const slot = Math.floor(index / 2);
          const offset = 14 + slot * 11;
          return (
            <span
              key={pillar.id}
              aria-hidden="true"
              className="absolute top-1/2 h-16 w-[10px] -translate-y-1/2 rounded-[3px] bg-ink-raised ring-1 ring-ember/50"
              style={{ left: `calc(50% + ${side * offset}% - 5px)` }}
            />
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Scrie scena**

`src/components/method/BarbellScene.tsx`:

```tsx
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { Pillar } from "@/content/types";

const BAR_LENGTH = 7;
const PLATE_RADIUS = 0.85;
const PLATE_THICKNESS = 0.16;
const LERP = 0.09;
const SETTLED = 0.004;

function plateTargetX(index: number): number {
  const side = index % 2 === 0 ? 1 : -1;
  const slot = Math.floor(index / 2);
  return side * (0.95 + slot * 0.34);
}

function plateStartX(index: number): number {
  return (index % 2 === 0 ? 1 : -1) * 5.5;
}

function Barbell({ pillars, mountedCount }: { pillars: Pillar[]; mountedCount: number }) {
  const group = useRef<THREE.Group>(null);
  const plates = useRef<(THREE.Mesh | null)[]>([]);
  const spin = useRef(0);
  const velocity = useRef(0);
  const { invalidate } = useThree();

  useFrame(() => {
    let moving = false;

    plates.current.forEach((plate, index) => {
      if (!plate) return;
      const mounted = index < mountedCount;
      const target = mounted ? plateTargetX(index) : plateStartX(index);
      plate.position.x += (target - plate.position.x) * LERP;

      const material = plate.material as THREE.MeshStandardMaterial;
      const targetOpacity = mounted ? 1 : 0;
      material.opacity += (targetOpacity - material.opacity) * LERP;
      material.emissiveIntensity += (0 - material.emissiveIntensity) * 0.05;

      if (Math.abs(target - plate.position.x) > SETTLED || Math.abs(targetOpacity - material.opacity) > SETTLED) {
        moving = true;
      }
    });

    if (group.current) {
      velocity.current *= 0.94;
      spin.current += velocity.current;
      group.current.rotation.y = spin.current;
      if (Math.abs(velocity.current) > 0.0004) moving = true;
    }

    if (moving) invalidate();
  });

  return (
    <group
      ref={group}
      onPointerMove={(event) => {
        if (event.buttons === 0) return;
        velocity.current += event.movementX * 0.0006;
        invalidate();
      }}
    >
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, BAR_LENGTH, 16]} />
        <meshStandardMaterial color="#8a8a8f" metalness={0.85} roughness={0.3} />
      </mesh>

      {pillars.map((pillar, index) => (
        <mesh
          key={pillar.id}
          ref={(element) => {
            plates.current[index] = element;
          }}
          position={[plateStartX(index), 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[PLATE_RADIUS, PLATE_RADIUS, PLATE_THICKNESS, 32]} />
          <meshStandardMaterial
            color="#141416"
            emissive="#ff5c1a"
            emissiveIntensity={1}
            metalness={0.6}
            roughness={0.45}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function BarbellScene({ pillars, mountedCount }: { pillars: Pillar[]; mountedCount: number }) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop="demand"
      camera={{ position: [0, 0.7, 7.5], fov: 35 }}
      gl={{ antialias: true, powerPreference: "low-power" }}
      className="h-full w-full touch-none"
      aria-hidden="true"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} />
      <Barbell pillars={pillars} mountedCount={mountedCount} />
    </Canvas>
  );
}
```

Detaliile care contează:
- `frameloop="demand"` plus `invalidate()` doar cât timp ceva se mișcă. Când discurile s-au așezat și rotația s-a stins, bucla rAF se oprește complet și nu mai consumă baterie
- `powerPreference: "low-power"` cere GPU-ul integrat, nu pe cel discret
- Geometrie procedurală, fără GLTF de descărcat
- Fără umbre, fără post-procesare, o singură lumină direcțională
- `aria-hidden` pe canvas: scena e ilustrativă, iar conținutul real (numele și unghiul fiecărui pilon) e text în `PillarList`
- `export default` e obligatoriu — `dynamic()` îl cere

- [ ] **Step 3: Verifică izolat**

Randează temporar `<BarbellScene pillars={content.method.pillars} mountedCount={6} />` într-un container de 400px înălțime.

Expected: bara apare cu 6 discuri montate, 3 pe fiecare parte, discurile au o strălucire portocalie care se stinge, iar trasul cu mouse-ul o rotește cu inerție care se oprește lin. În DevTools → Performance, după ce totul se așază, **nu** mai există cadre rAF.

- [ ] **Step 4: Verifică bugetul bundle-ului**

Run: `npm run build`
Expected: chunk-ul care conține `three` apare separat în raport și e sub 200KB gz. Dacă intră în bundle-ul principal, importul `dynamic` din Task 12 lipsește sau e greșit — se rezolvă acolo.

- [ ] **Step 5: Commit**

```bash
git add src/components/method
git commit -m "feat: scena 3D cu bara care se asambleaza, plus fallback static"
```

---

### Task 12: Secțiunea Metoda și pagina `/metoda`

**Files:**
- Create: `src/components/method/PillarList.tsx`, `src/components/sections/Method.tsx`
- Create: `src/app/[locale]/metoda/page.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `BarbellScene`, `BarbellFallback`, `shouldRender3D`, `content.method`
- Produces: `<Method data: Content["method"]>` — client

- [ ] **Step 1: Scrie lista de piloni cu observator**

`src/components/method/PillarList.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { Pillar } from "@/content/types";

interface PillarListProps {
  pillars: Pillar[];
  onVisibleCountChange: (count: number) => void;
}

export function PillarList({ pillars, onVisibleCountChange }: PillarListProps) {
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const seen = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index ?? "0");
          if (index + 1 > seen.current) {
            seen.current = index + 1;
            onVisibleCountChange(seen.current);
          }
        }
      },
      { rootMargin: "0px 0px -35% 0px" },
    );

    for (const item of items.current) if (item) observer.observe(item);
    return () => observer.disconnect();
  }, [onVisibleCountChange]);

  return (
    <ol className="space-y-8">
      {pillars.map((pillar, index) => (
        <li
          key={pillar.id}
          data-index={index}
          ref={(element) => {
            items.current[index] = element;
          }}
          className="border-t border-hairline pt-5"
        >
          <h3 className="font-display text-2xl">{pillar.name}</h3>
          <p className="mt-2 max-w-[44ch] text-bone-dim">{pillar.angle}</p>
        </li>
      ))}
    </ol>
  );
}
```

Contorul crește monoton (`seen.current`) — discurile montate nu se demontează când derulezi înapoi. Un disc care sare de pe bară la scroll invers ar arăta a bug, nu a efect.

- [ ] **Step 2: Scrie secțiunea**

`src/components/sections/Method.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { BarbellFallback } from "@/components/method/BarbellFallback";
import { PillarList } from "@/components/method/PillarList";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";
import { shouldRender3D, useDeviceCapabilities } from "@/lib/device";

const BarbellScene = dynamic(() => import("@/components/method/BarbellScene"), { ssr: false });

export function Method({ data }: { data: Content["method"] }) {
  const capabilities = useDeviceCapabilities();
  const [mountedCount, setMountedCount] = useState(0);
  const [inView, setInView] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), {
      rootMargin: "200px",
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleCount = useCallback((count: number) => setMountedCount(count), []);
  const render3D = shouldRender3D(capabilities) && inView && !crashed;

  return (
    <Section id="metoda" eyebrow={data.eyebrow} headline={data.headline}>
      <p className="mt-6 max-w-[52ch] text-lg text-bone-dim">{data.body}</p>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div ref={stage} className="sticky top-16 h-[46vh] min-h-[300px] lg:h-[70vh]">
          {render3D ? (
            <ErrorBoundary onError={() => setCrashed(true)} fallback={<BarbellFallback pillars={data.pillars} />}>
              <BarbellScene pillars={data.pillars} mountedCount={mountedCount} />
            </ErrorBoundary>
          ) : (
            <BarbellFallback pillars={data.pillars} />
          )}
        </div>
        <PillarList pillars={data.pillars} onVisibleCountChange={handleCount} />
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Scrie granița de eroare**

Adaugă în același fișier, deasupra componentei `Method`:

```tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  override state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("BarbellScene a esuat, se trece pe fallback", error, info);
    this.props.onError();
  }

  override render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
```

Fără granița asta, o eroare de WebGL pe un telefon vechi ia toată pagina cu ea. Cu ea, secțiunea trece pe varianta statică și restul site-ului merge mai departe.

- [ ] **Step 4: Creează pagina `/metoda`**

`src/app/[locale]/metoda/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { Method } from "@/components/sections/Method";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import { whatsappUrl } from "@/lib/contact";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function MethodPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  const gallery = [
    { src: "climbing-wall", pillar: content.method.pillars[3] },
    { src: "nutrition-plate", pillar: content.method.pillars[4] },
    { src: "outdoor-summit", pillar: content.method.pillars[1] },
  ];

  return (
    <main>
      <Method data={content.method} />
      <Section>
        <div className="grid gap-4 sm:grid-cols-3">
          {gallery.map((item) => (
            <figure key={item.src}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={`/media/img/${item.src}.avif`}
                  alt={item.pillar?.angle ?? ""}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm uppercase tracking-wider text-bone-dim">
                {item.pillar?.name}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-12">
          <CtaButton href={whatsappUrl(content.contact.prefilledMessage)} external>
            {content.finalCta.cta}
          </CtaButton>
        </div>
      </Section>
    </main>
  );
}
```

Footer-ul se montează pe toate cele patru pagini în Task 15, după ce componenta există. Nu îl adăuga aici.

Galeria e legată de piloni prin index, iar textul alternativ e chiar unghiul pilonului — o singură sursă de adevăr, tradusă automat în ambele limbi. `noUncheckedIndexedAccess` face `pillars[3]` să fie `Pillar | undefined`, de unde `?.`.

- [ ] **Step 5: Montează secțiunea și în homepage**

Adaugă `<Method data={content.method} />` în `src/app/[locale]/page.tsx`, după `<Balance />`.

- [ ] **Step 6: Verifică asamblarea și degradările**

Run: `npm run dev`

| Verificare | Cum | Rezultat așteptat |
|---|---|---|
| Asamblare | derulează prin listă | Discurile se montează unul câte unul, alternând stânga/dreapta |
| Scroll invers | derulează înapoi | Discurile **rămân** montate |
| Bara e lipicioasă | pe mobil | Scena rămâne fixă cât derulezi pilonii |
| Fără WebGL | DevTools → Rendering → dezactivează WebGL | Apare fallback-ul, fără eroare în consolă |
| Reduced motion | DevTools | Fallback |
| CPU slab | DevTools → Performance → CPU 6× slowdown și `hardwareConcurrency` mic | Fallback |
| În afara ecranului | derulează departe de secțiune | Canvas-ul se demontează, rAF-ul se oprește |

- [ ] **Step 7: Verifică izolarea bundle-ului**

Run: `npm run build`
Expected: `three` **nu** apare în First Load JS pentru nicio rută. Dacă apare, `dynamic` nu funcționează — verifică că `BarbellScene` are `export default` și că nu e importat static nicăieri.

- [ ] **Step 8: Commit**

```bash
git add src/components/method src/components/sections/Method.tsx src/app/[locale]
git commit -m "feat: sectiunea Metoda cu asamblare 3D si pagina dedicata"
```

---

### Task 13: Rezultate și sliderul before/after

**Files:**
- Create: `src/components/results/BeforeAfter.tsx`, `src/components/sections/Results.tsx`
- Create: `src/app/[locale]/rezultate/page.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `content.results`
- Produces: `<BeforeAfter testimonial: Testimonial; beforeLabel: string; afterLabel: string>` — client

- [ ] **Step 1: Scrie sliderul**

`src/components/results/BeforeAfter.tsx`:

```tsx
"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { Testimonial } from "@/content/types";

interface BeforeAfterProps {
  testimonial: Testimonial;
  beforeLabel: string;
  afterLabel: string;
}

export function BeforeAfter({ testimonial, beforeLabel, afterLabel }: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const sliderId = useId();

  return (
    <div>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl">
        <Image
          src={`/media/img/${testimonial.afterSrc}.avif`}
          alt={testimonial.afterAlt}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src={`/media/img/${testimonial.beforeSrc}.avif`}
            alt={testimonial.beforeAlt}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-[2px] bg-bone"
          style={{ left: `${position}%` }}
        />

        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
          {beforeLabel}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
          {afterLabel}
        </span>

        <label htmlFor={sliderId} className="sr-only">
          {`${beforeLabel} / ${afterLabel}`}
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>

      <figure className="mt-6">
        <blockquote className="text-lg leading-relaxed">{testimonial.quote}</blockquote>
        <figcaption className="mt-3 text-sm uppercase tracking-wider text-bone-dim">{testimonial.name}</figcaption>
      </figure>
      {testimonial.note ? <p className="mt-4 font-display text-xl text-ember">{testimonial.note}</p> : null}
    </div>
  );
}
```

Controlul e un `<input type="range">` real, transparent, întins peste imagine. Rezultatul: drag cu degetul, drag cu mouse-ul **și** săgeți de la tastatură funcționează toate, fără o linie de cod de accesibilitate scrisă manual.

- [ ] **Step 2: Scrie secțiunea**

`src/components/sections/Results.tsx`:

```tsx
import { BeforeAfter } from "@/components/results/BeforeAfter";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function Results({ data }: { data: Content["results"] }) {
  return (
    <Section id="rezultate" eyebrow={data.eyebrow} headline={data.headline}>
      <div className="mt-12 grid gap-14 sm:grid-cols-2">
        {data.testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} delay={index * 0.08}>
            <BeforeAfter
              testimonial={testimonial}
              beforeLabel={data.beforeLabel}
              afterLabel={data.afterLabel}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Creează pagina `/rezultate`**

`src/app/[locale]/rezultate/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { Results } from "@/components/sections/Results";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import { whatsappUrl } from "@/lib/contact";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function ResultsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <main>
      <Results data={content.results} />
      <Section headline={content.finalCta.headline}>
        <p className="mt-6 max-w-[48ch] text-lg text-bone-dim">{content.finalCta.body}</p>
        <div className="mt-8">
          <CtaButton href={whatsappUrl(content.contact.prefilledMessage)} external>
            {content.finalCta.cta}
          </CtaButton>
        </div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 4: Montează în homepage**

Adaugă `<Results data={content.results} />` după `<Method />`.

- [ ] **Step 5: Verifică**

Run: `npm run dev`
Expected:
- Cele două perechi au exact aceeași înălțime și aliniere (raportul 9:16 din Task 2 e ce face asta să funcționeze)
- Tragerea cu degetul mută linia de separare lin
- Săgețile stânga/dreapta o mută când sliderul are focus
- La `meril-before` nu se vede nimic din interfața Snapchat
- Sub Meril apare, în portocaliu, „Mentoratul funcționează și în engleză"

- [ ] **Step 6: Commit**

```bash
git add src/components/results src/components/sections/Results.tsx src/app/[locale]
git commit -m "feat: sectiunea Rezultate cu slider before/after accesibil"
```

---

### Task 14: Despre David

**Files:**
- Create: `src/components/sections/David.tsx`
- Create: `src/app/[locale]/despre/page.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `content.david`
- Produces: `<David data: Content["david"]>` — server component

- [ ] **Step 1: Scrie secțiunea**

`src/components/sections/David.tsx`:

```tsx
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function David({ data }: { data: Content["david"] }) {
  return (
    <Section id="despre" eyebrow={data.eyebrow} headline={data.headline}>
      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src={`/media/img/${data.image}.avif`}
              alt={data.imageAlt}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div className="space-y-5 text-lg leading-relaxed text-bone-dim">
          {data.body.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 0.05}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Creează pagina `/despre`**

`src/app/[locale]/despre/page.tsx`:

```tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { David } from "@/components/sections/David";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import { getContent } from "@/content";
import { LOCALES, isLocale } from "@/content/types";
import { whatsappUrl } from "@/lib/contact";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  const gallery = [
    { src: "hiking-peaks", alt: content.method.pillars[3]?.angle ?? "" },
    { src: "sea-rest", alt: content.method.pillars[2]?.angle ?? "" },
  ];

  return (
    <main>
      <David data={content.david} />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {gallery.map((item) => (
            <div key={item.src} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={`/media/img/${item.src}.avif`}
                alt={item.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-12">
          <CtaButton href={whatsappUrl(content.contact.prefilledMessage)} external>
            {content.finalCta.cta}
          </CtaButton>
        </div>
      </Section>
    </main>
  );
}
```

`sea-rest` ilustrează pilonul de recuperare, `hiking-peaks` pe cel de cățărat. Amândouă își iau textul alternativ din piloni, deci se traduc singure.

- [ ] **Step 3: Montează în homepage**

Adaugă `<David data={content.david} />` după `<Results />`.

- [ ] **Step 4: Verifică**

Run: `npm run dev`
Expected: pe mobil imaginea stă deasupra textului; peste 1024px, alături. Nicăieri în text nu apare vreo formulare care să sugereze că David e medic — recitește cele trei paragrafe cu ochiul ăsta.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/David.tsx src/app/[locale]
git commit -m "feat: sectiunea si pagina Despre David"
```

---

### Task 15: Proces, întrebări, CTA final și footer

**Files:**
- Create: `src/components/sections/Process.tsx`, `src/components/sections/Faq.tsx`, `src/components/sections/FinalCta.tsx`, `src/components/nav/Footer.tsx`
- Modify: `src/app/[locale]/page.tsx`, `src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `content.process`, `content.faq`, `content.finalCta`, `content.footer`
- Produces: `<Process>`, `<Faq>`, `<FinalCta>`, `<Footer locale; data; currentPath>`

- [ ] **Step 1: Scrie `Process`**

`src/components/sections/Process.tsx`:

```tsx
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function Process({ data }: { data: Content["process"] }) {
  return (
    <Section eyebrow={data.eyebrow} headline={data.headline}>
      <ol className="mt-12 grid gap-8 sm:grid-cols-3">
        {data.steps.map((step, index) => (
          <Reveal key={step.index} delay={index * 0.06}>
            <li className="border-t border-hairline pt-5">
              <span className="font-display text-4xl text-ember">{step.index}</span>
              <h3 className="mt-3 font-display text-xl">{step.title}</h3>
              <p className="mt-2 text-bone-dim">{step.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
```

- [ ] **Step 2: Scrie `Faq`**

`src/components/sections/Faq.tsx`:

```tsx
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function Faq({ data }: { data: Content["faq"] }) {
  return (
    <Section tone="deep" eyebrow={data.eyebrow} headline={data.headline}>
      <div className="mt-10 divide-y divide-hairline border-t border-hairline">
        {data.items.map((item) => (
          <details key={item.question} className="group py-5">
            <summary className="cursor-pointer list-none font-display text-xl marker:hidden">
              {item.question}
            </summary>
            <p className="mt-3 max-w-[56ch] text-bone-dim">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
```

`<details>` nativ: se deschide fără JavaScript, e navigabil de la tastatură din start, și rămâne citibil pentru un crawler chiar închis — ceea ce contează pentru extragerea în răspunsuri AI.

- [ ] **Step 3: Scrie `FinalCta`**

`src/components/sections/FinalCta.tsx`:

```tsx
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function FinalCta({ data, href }: { data: Content["finalCta"]; href: string }) {
  return (
    <Section headline={data.headline}>
      <p className="mt-6 max-w-[48ch] text-lg text-bone-dim">{data.body}</p>
      <div className="mt-8">
        <CtaButton href={href} external>
          {data.cta}
        </CtaButton>
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Scrie `Footer` cu comutatorul de limbă**

`src/components/nav/Footer.tsx`:

```tsx
import Link from "next/link";
import type { Content, Locale } from "@/content/types";
import { LOCALES } from "@/content/types";

interface FooterProps {
  locale: Locale;
  data: Content["footer"];
  routeSuffix: string;
}

export function Footer({ locale, data, routeSuffix }: FooterProps) {
  return (
    <footer className="border-t border-hairline px-5 py-12">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-bone-dim">{data.languageLabel}</span>
          {LOCALES.map((candidate) => (
            <Link
              key={candidate}
              href={`/${candidate}${routeSuffix}`}
              hrefLang={candidate}
              aria-current={candidate === locale ? "true" : undefined}
              className={`min-h-[44px] px-2 text-sm uppercase leading-[44px] ${
                candidate === locale ? "text-bone underline underline-offset-4" : "text-bone-dim"
              }`}
            >
              {candidate}
            </Link>
          ))}
        </div>
        <p className="mt-8 max-w-[70ch] text-xs leading-relaxed text-bone-dim">{data.disclaimer}</p>
        <p className="mt-6 text-xs text-bone-dim">© {new Date().getFullYear()} {data.rights}</p>
      </div>
    </footer>
  );
}
```

`Footer` rămâne server component, deci nu poate citi `usePathname`. Ruta curentă i se dă explicit, prin `routeSuffix`, din fiecare pagină. Alternativa — să-l faci client component ca să afle singur unde e — ar trimite inutil JavaScript pentru un footer static.

Comutatorul de limbă trebuie să te lase pe **aceeași** pagină. Un comutator care aruncă utilizatorul pe homepage e o regresie, nu o simplificare.

- [ ] **Step 5: Montează `Footer` pe toate cele patru pagini**

| Fișier | `routeSuffix` |
|---|---|
| `src/app/[locale]/page.tsx` | `""` |
| `src/app/[locale]/metoda/page.tsx` | `"/metoda"` |
| `src/app/[locale]/rezultate/page.tsx` | `"/rezultate"` |
| `src/app/[locale]/despre/page.tsx` | `"/despre"` |

În fiecare, adaugă `import { Footer } from "@/components/nav/Footer";` și randează `<Footer locale={locale} data={content.footer} routeSuffix="<valoarea din tabel>" />` ca ultim copil al `<main>`.

- [ ] **Step 6: Compune homepage-ul complet**

`src/app/[locale]/page.tsx`, în ordinea din spec §4:

```tsx
<HeroStories … />
<FirstTime data={content.firstTime} />
<Balance data={content.balance} />
<Method data={content.method} />
<David data={content.david} />
<Results data={content.results} />
<Process data={content.process} />
<Faq data={content.faq} />
<FinalCta data={content.finalCta} href={whatsappUrl(content.contact.prefilledMessage)} />
<Footer locale={locale} data={content.footer} routeSuffix="" />
```

- [ ] **Step 7: Verifică fluxul complet**

Run: `npm run dev`
Expected: derulează homepage-ul de sus până jos pe mobil simulat. Argumentul curge fără gol logic, nimic nu ajunge sub bottom nav, comutatorul de limbă te ține pe aceeași pagină, iar disclaimerul e vizibil dar discret.

- [ ] **Step 8: Commit**

```bash
git add src/components src/app/[locale]
git commit -m "feat: proces, intrebari, CTA final si footer cu comutator de limba"
```

---

### Task 16: Strat de SEO

**Files:**
- Create: `src/components/seo/JsonLd.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `public/llms.txt`, `src/app/[locale]/opengraph-image.tsx`
- Modify: fiecare `page.tsx` (adaugă `generateMetadata`)

**Interfaces:**
- Consumes: `absoluteUrl`, `SITE_URL`, `getContent`, `instagramUrl`
- Produces: `<JsonLd data: Record<string, unknown>>`

- [ ] **Step 1: Scrie componenta de JSON-LD**

`src/components/seo/JsonLd.tsx`:

```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Continut static, generat de noi, fara input de utilizator.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: Adaugă datele structurate în layout-ul de locale**

În `src/app/[locale]/layout.tsx`, randează:

```tsx
<JsonLd
  data={{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#david`,
        name: "David Biriș",
        jobTitle: locale === "ro" ? "Mentor de fitness" : "Fitness mentor",
        knowsAbout: ["strength training", "nutrition", "boxing", "climbing", "swimming"],
        knowsLanguage: ["ro", "en"],
        sameAs: [instagramUrl()],
        url: absoluteUrl(locale, ""),
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#mentorat`,
        name: content.meta.title,
        description: content.meta.description,
        serviceType: locale === "ro" ? "Mentorat fitness 1-la-1" : "One-on-one fitness mentoring",
        provider: { "@id": `${SITE_URL}/#david` },
        areaServed: "RO",
        availableLanguage: ["ro", "en"],
      },
    ],
  }}
/>
```

`sameAs` depinde de `INSTAGRAM_HANDLE`, care e încă provizoriu. Când vine handle-ul real, se schimbă într-un singur loc și se propagă și aici.

- [ ] **Step 3: Adaugă `FAQPage` pe homepage**

În `src/app/[locale]/page.tsx`, lângă `<Faq />`:

```tsx
<JsonLd
  data={{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }}
/>
```

- [ ] **Step 4: Scrie `robots.ts`**

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Boti de cautare AI, permisi explicit ca sa poata cita site-ul.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      // Crawler de antrenament pur, fara beneficiu de citare.
      { userAgent: "CCBot", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Scrie `sitemap.ts`**

`src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { LOCALES } from "@/content/types";
import { ROUTES, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: absoluteUrl(locale, route),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((other) => [other, absoluteUrl(other, route)])),
      },
    })),
  );
}
```

- [ ] **Step 6: Scrie `llms.txt`**

`public/llms.txt`:

```
# David Biriș — Mentorat 1-la-1 / One-on-one mentoring

Mentorat de fitness unu-la-unu, în română și engleză, pentru oameni între 17 și 27 de ani
care vor să înceapă sala fără să renunțe la sportul și la viața pe care le au deja.

## Ce e
Mentoratul îmbină antrenamentul de forță cu sportul pe care clientul îl practică deja —
box, înot, cățărat — și cu un plan de nutriție construit pe echilibru, nu pe restricție totală.

## Cine îl ține
David Biriș. Se antrenează de la 13 ani, șapte ani în total. Student în anul 2 la Medicină.
Nu este medic sau nutriționist licențiat; mentoratul nu înlocuiește sfatul medical.

## Limbi
Română și engleză.

## Preț
Nu este public. Prima discuție e gratuită și se stabilește prin WhatsApp sau Instagram.

## Contact
WhatsApp: +40 755 659 389

## Pagini
- /ro și /en — argumentul complet
- /ro/metoda — cei șase piloni ai metodei
- /ro/rezultate — transformări documentate
- /ro/despre — despre David
```

- [ ] **Step 7: Scrie imaginea OG**

`src/app/[locale]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { isLocale } from "@/content/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
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
        <div style={{ fontSize: 26, color: "#FF5C1A", letterSpacing: 4, textTransform: "uppercase" }}>
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
```

Dacă `ImageResponse` dă eroare de font lipsă, adaugă un font explicit: descarcă `Archivo-Bold.ttf` în `src/app/[locale]/`, citește-l cu `readFile` și trece-l în opțiunea `fonts`. Nu lăsa OG-ul rupt.

- [ ] **Step 8: Adaugă `generateMetadata` pe fiecare sub-pagină**

Fără asta, toate paginile moștenesc canonical-ul homepage-ului și se canibalizează în căutare.

Adaugă în `src/app/[locale]/metoda/page.tsx`:

```tsx
import type { Metadata } from "next";
import { LOCALES } from "@/content/types";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getContent(locale);

  return {
    title: `${content.method.headline} · ${content.meta.title}`,
    description: content.method.body,
    alternates: {
      canonical: absoluteUrl(locale, "metoda"),
      languages: {
        ...Object.fromEntries(LOCALES.map((other) => [other, absoluteUrl(other, "metoda")])),
        "x-default": absoluteUrl("ro", "metoda"),
      },
    },
  };
}
```

Repetă în `rezultate/page.tsx`, schimbând ruta în `"rezultate"`, titlul în `content.results.headline` și descrierea în `content.results.headline`.

Repetă în `despre/page.tsx`, schimbând ruta în `"despre"`, titlul în `content.david.headline` și descrierea în `content.david.body[0] ?? content.meta.description`.

- [ ] **Step 9: Verifică**

Run: `npm run build && npm run start`

| Verificare | Cum | Rezultat |
|---|---|---|
| robots | `curl localhost:3000/robots.txt` | Conține GPTBot, PerplexityBot, ClaudeBot cu Allow, CCBot cu Disallow |
| sitemap | `curl localhost:3000/sitemap.xml` | 8 URL-uri (4 rute × 2 locale), fiecare cu alternates |
| llms | `curl localhost:3000/llms.txt` | Se servește ca text |
| JSON-LD | Rich Results Test pe HTML-ul paginii | `Person`, `Service`, `FAQPage` validate, zero erori |
| hreflang | vezi sursa `/ro` și `/en` | Referire reciprocă + `x-default` pe RO |
| OG | `curl localhost:3000/ro/opengraph-image` | PNG valid 1200×630 |
| canonical | vezi sursa fiecărei sub-pagini | Canonical propriu, nu al homepage-ului |

- [ ] **Step 10: Commit**

```bash
git add src/app src/components/seo public/llms.txt
git commit -m "feat: metadata, JSON-LD, sitemap, robots cu boti AI si llms.txt"
```

---

### Task 17: Trecere de performanță și verificare finală

**Files:**
- Modify: după caz, în funcție de ce arată măsurătorile

**Interfaces:**
- Consumes: tot
- Produces: un build care respectă bugetele din Global Constraints

- [ ] **Step 1: Rulează lanțul complet**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: toate curate, zero warnings.

- [ ] **Step 2: Măsoară bundle-urile**

Run: `npm run build`
Expected: First Load JS sub 180KB pentru fiecare rută, iar `three` într-un chunk separat, încărcat la cerere. Notează cifrele reale.

- [ ] **Step 3: Rulează Lighthouse pe toate cele 8 combinații**

Pentru fiecare din `/ro`, `/ro/metoda`, `/ro/rezultate`, `/ro/despre` și echivalentele `/en`:

Run: `npx lighthouse http://localhost:3000/<ruta> --preset=desktop --quiet` și varianta mobilă implicită.
Expected: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100. LCP < 2.5s, CLS < 0.05.

Dacă LCP pică pe homepage, vinovatul e aproape sigur posterul primului clip — verifică `priority` pe `next/image` și dimensiunea AVIF-ului.

- [ ] **Step 4: Verifică pe device-uri reale, în ordinea asta**

1. **iPhone, Safari** — safe area jos, autoplay, `100dvh` fără salt la retragerea barei de adresă, tap-urile din hero
2. **Android, Chrome** — safe area, autoplay, performanța scenei 3D
3. **Desktop** — nav-ul devine dock centrat, layout-ul pe două coloane, hover-urile

- [ ] **Step 5: Verifică accesibilitatea la tastatură, fără mouse**

Parcurge tot site-ul doar cu Tab, Shift+Tab, Enter, Escape și săgeți.
Expected: focusul e vizibil peste tot, ordinea e logică, FAB-ul se deschide și se închide, sliderul before/after se mișcă cu săgețile, `<details>`-urile se deschid cu Enter, iar nimic nu capturează focusul.

- [ ] **Step 6: Rulează auditul de SEO**

Folosește skill-ul `seo-audit` pe build-ul de producție și rezolvă ce raportează.

- [ ] **Step 7: Recitește tot copy-ul cu ochii pe constrângeri**

Parcurge `src/content/ro.ts` și `en.ts` de la cap la coadă și confirmă, explicit:
- Zero cifre despre numărul de clienți
- Zero statistici
- Zero promisiuni de kilograme sau de interval
- Zero formulare care sugerează calificare medicală
- Disclaimerul e prezent și corect în ambele limbi

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "perf: optimizari dupa masuratori Lighthouse pe device real"
```

---

### Task 18: Deploy

**Files:**
- Create: `.env.example`
- Create: `README.md`

**Interfaces:**
- Consumes: tot
- Produces: site public pe Vercel

- [ ] **Step 1: Documentează variabilele de mediu**

`.env.example`:

```
# URL-ul public al site-ului. Se schimba aici cand apare domeniul propriu.
NEXT_PUBLIC_SITE_URL=https://david-biris.vercel.app
```

- [ ] **Step 2: Scrie README-ul**

`README.md`:

````markdown
# David Biriș — Mentorat 1-la-1

Site static de prezentare pentru mentoratul de fitness 1-la-1 al lui David Biriș.
Română și engleză. Fără backend: fiecare CTA duce în WhatsApp sau Instagram.

## Rulare locală

```bash
npm install
npm run dev
```

## Comenzi

| Comandă | Ce face |
|---|---|
| `npm run dev` | Server de dezvoltare |
| `npm run build` | Build de producție |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Teste Vitest pentru modulele pure |
| `npm run media` | Reprocesează media brută în `public/media/` |

## Media

`npm run media` **nu** rulează la build. Are nevoie de `ffmpeg` instalat local și de
directoarele `assets/`, `testimonial_darius/`, `testimonial_meril/`, care sunt ignorate de git.
Ieșirea din `public/media/` e comisă în repo, deci deploy-ul nu depinde de ffmpeg.

Rulează-l doar când se schimbă pozele sau clipurile sursă.

## Unde se schimbă ce

| Vrei să schimbi | Fișier |
|---|---|
| Număr de telefon, handle de Instagram | `src/lib/contact.ts` |
| Orice text vizibil, în orice limbă | `src/content/ro.ts`, `src/content/en.ts` |
| Culori, fonturi, spațieri | `src/app/globals.css` (blocul `@theme`) |
| Ce poze apar unde | `src/content/*.ts`, câmpurile `image` / `*Src` |
| URL-ul public (canonical, sitemap) | variabila de mediu `NEXT_PUBLIC_SITE_URL` |

Textele nu se scriu niciodată direct în componente. Dacă găsești un string vizibil
într-un `.tsx`, e un bug — mută-l în `src/content/`.

## Reguli de conținut

Sunt decizii ale clientului, nu preferințe:

- Fără cifre despre numărul de clienți
- Fără statistici
- Fără promisiuni de kilograme sau de interval de timp
- Fără formulări care sugerează că David e medic sau nutriționist licențiat
- Disclaimerul din footer rămâne, în ambele limbi

## TODO deschise

- [ ] `INSTAGRAM_HANDLE` din `src/lib/contact.ts` e provizoriu. Trebuie înlocuit cu handle-ul real
- [ ] De confirmat inițiala lui Darius („Darius B.")
- [ ] De confirmat numele complet al lui Meril
- [ ] De decis dacă se adaugă secțiunea „locuri limitate" (doar dacă e adevărat)
````

- [ ] **Step 3: Deploy pe Vercel**

Conectează repo-ul, setează `NEXT_PUBLIC_SITE_URL` la URL-ul real de producție, apoi redeployează ca sitemap-ul și canonical-urile să se genereze cu valoarea corectă.

- [ ] **Step 4: Verifică pe producție**

Expected: `robots.txt`, `sitemap.xml`, `llms.txt` se servesc corect; `hreflang`-urile arată spre domeniul de producție, nu spre `localhost`; imaginile OG se randează în previzualizarea de pe WhatsApp și Instagram.

- [ ] **Step 5: Commit**

```bash
git add .env.example README.md
git commit -m "chore: documentatie de deploy si variabile de mediu"
```

---

## Blocante deschise la finalul planului

Acestea **nu** se rezolvă din cod. Se rezolvă cu clientul.

| # | Element | Impact dacă rămâne nerezolvat |
|---|---|---|
| 1 | **Handle-ul de Instagram** | Butonul de contact duce într-un profil greșit. Apare și în `sameAs` din JSON-LD. `TODO` în `src/lib/contact.ts` |
| 2 | Inițiala lui Darius | Apare „Darius B.", presupus |
| 3 | Numele de familie al lui Meril | Apare doar „Meril" |
| 4 | Secțiunea de locuri limitate | Nu s-a implementat. Se adaugă doar dacă David confirmă că e adevărat |
| 5 | Domeniu propriu | Se rulează pe subdomeniu Vercel. Schimbarea e o singură variabilă de mediu |

