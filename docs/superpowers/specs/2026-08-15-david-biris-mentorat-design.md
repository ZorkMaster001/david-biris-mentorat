# David Biriș — Mentorat 1-la-1 · Design Spec

**Dată:** 2026-08-15
**Status:** aprobat de client, gata pentru plan de implementare

---

## 1. Context

David Biriș face sală de la 13 ani (7 ani) și e student în anul 2 la Medicină. A mentorat informal doi prieteni — Darius și Meril — ambii cu rezultate reale. Site-ul transformă mentoratul informal într-o ofertă pe care un străin o poate înțelege și cumpăra.

**Obiectivul unic al site-ului:** vizitatorul deschide o conversație pe WhatsApp sau Instagram.

Nu există checkout, cont, formular sau backend. Toată conversia se termină într-un link extern.

## 2. Non-obiective

Rămân explicit în afara acestui proiect:

- Preț afișat, pachete, plată online
- CMS, blog, panou de administrare
- Newsletter, captare de email, cookie banner (nu punem analytics care să-l ceară)
- Autentificare, zonă de client, urmărirea progresului
- Orice cifră despre numărul de clienți — decizie explicită a clientului

## 3. Public și ofertă

### Cui vorbim

Bărbat, 17–27 ani, România. A încercat sala și s-a lăsat, sau n-a intrat niciodată. Deja face sau i-ar plăcea să facă un sport — box, înot, cățărat, fotbal. Convingerea care îl blochează: *„ca să arăt bine trebuie să renunț la tot ce îmi place."*

### Cele patru obiecții reale

1. „N-am timp, am facultate/job."
2. „N-am mai fost în sală, o să mă fac de râs."
3. „Nu vreau să renunț la ieșiri, la bere, la mâncarea bună."
4. „Nu vorbesc română" — cazul Meril, care e și dovada că nu e o problemă.

### Oferta (structură Hormozi, fără preț)

**Rezultatul visat:** nu un fizic, ci un fizic *pe care îl păstrezi*, pentru că antrenamentul a devenit ceva ce vrei să faci.

**Ce crește probabilitatea percepută:**
- Planul se construiește peste sportul pe care deja îl faci, nu în locul lui
- David a trecut personal prin 7 ani de proces, nu repetă ce a citit
- Anul 2 la Medicină — înțelege fiziologia din spate, nu doar exercițiile
- Două transformări reale, cu poze și cu nume

**Ce scade timpul și efortul:**
- 1-la-1, nu program generic de PDF
- Acces direct pe WhatsApp, ajustări pe parcurs
- Nutriție care include berea și burgerul, nu le interzice

**Reducerea riscului (onest, nu inventat):** prima discuție e gratuită și fără obligații. Atât. Nu promitem garanție de returnare a banilor pentru că nu ne-a fost oferită.

**Rariate (de confirmat cu David înainte de publicare):** lucrează cu un număr limitat de oameni simultan, pentru că fiecare plan e făcut manual. Dacă David nu confirmă, secțiunea dispare — nu inventăm scarcity.

### Interdicții de conținut

- Fără statistici fabricate de orice fel
- Fără număr de clienți
- Fără promisiuni de kilograme sau de interval („10kg în 8 săptămâni")
- Fără limbaj medical care ar sugera că David e medic sau nutriționist licențiat
- Disclaimer discret în footer: David e student la Medicină, nu medic; mentoratul nu înlocuiește sfatul medical

## 4. Arhitectura informației

Hibrid: homepage-ul poartă argumentul complet și se poate citi fără un singur click. Cele trei rute secundare duc în adâncime și dau bottom nav-ului destinații reale.

| Rută | Rol | Tab |
|---|---|---|
| `/[locale]` | Argumentul complet de vânzare | Acasă |
| `/[locale]/metoda` | Cei 6 piloni în detaliu + scena 3D | Metoda |
| `/[locale]/rezultate` | Darius și Meril, before/after, citate | Rezultate |
| `/[locale]/despre` | David: cei 7 ani, Medicina, de ce face asta | Despre |

`locale ∈ {ro, en}`. `/` face redirect la `/ro`. Rutele EN păstrează aceleași slug-uri (`/en/metoda`) ca să nu dublăm logica de rutare — sunt segmente statice, nu cuvinte cheie de SEO.

### Secțiunile homepage-ului, în ordine

1. **Hero** — slideshow video, headline, două CTA
2. **Pentru prima dată** — promisiunea centrală
3. **Echilibru** — berea și burgerul, față în față
4. **Metoda** — bara 3D care se asamblează
5. **David** — autoritatea
6. **Rezultate** — cele două transformări
7. **Cum decurge** — 3 pași
8. **Întrebări** — cele 4 obiecții
9. **CTA final**

## 5. Conținut

Copy-ul RO e sursa de adevăr; EN e traducere adaptată, nu literală. Mai jos e scheletul — formulările finale se rafinează la implementare.

### 5.1 Hero

**Headline:** Nu te învăț să faci sală. Te învăț să îți placă.

**Subheadline:** Mentorat 1-la-1 care îmbină sportul pe care îl faci deja — box, înot, cățărat, sală — cu un plan de nutriție care nu îți cere să renunți la viața ta.

**CTA primar:** Scrie-i lui David pe WhatsApp
**CTA secundar:** Vezi metoda

Cuvântul suprapus se schimbă odată cu clipul: **RIDICĂ · LOVEȘTE · CAȚĂRĂ · SARI · ALEARGĂ**

### 5.2 Pentru prima dată

> Pentru prima dată, cineva te învață cum să *începi să îți placă* sala — nu cum să o suporți.

Corp: majoritatea programelor îți dau exerciții și te lasă să te descurci cu partea grea, care e să te întorci săptămâna viitoare. Aici lucrăm invers. Construim întâi obiceiul și motivul, apoi încărcăm greutatea. Ținta nu e să reziști 8 săptămâni. E ca peste doi ani să ți se pară ciudat să nu te antrenezi.

### 5.3 Echilibru — berea și burgerul

**Titlu:** Nu trebuie să lași totul în urmă ca să îți schimbi fizicul.

Două poze mari, față în față, cu propria lor legendă:

- *Poza cu berea* — „Berea de pe plajă nu îți anulează luna. Bere în fiecare seară, da."
- *Poza cu mâncarea la aeroport* — „Nici burgerul din aeroport. Ce contează e ce faci în restul săptămânii."

Închidere: ai nevoie de o balanță, nu de o pedeapsă. Planurile care interzic tot funcționează trei săptămâni și apoi te lasă mai rău decât te-au găsit. Un plan bun are loc în el pentru viața pe care o trăiești deja.

### 5.4 Metoda — cei 6 piloni

Titlu: **Se construiește peste ce faci deja.**

| Pilon | Unghi |
|---|---|
| Sală | Baza. Structura peste care se așază tot restul |
| Box | Condiție, coordonare, capul limpede |
| Înot | Recuperare activă, plămâni, articulații odihnite |
| Cățărat | Forță reală, priză, control al corpului |
| Nutriție | Mâncare pe care o mănânci și peste un an, nu doar în deficit |
| Consistență | Singura variabilă care contează pe termen lung |

### 5.5 David

**Titlu:** 7 ani în sală. Anul 2 la Medicină.

A intrat în sală la 13 ani și nu s-a mai oprit. Studiază Medicina, deci înțelege ce se întâmplă în corp când ridici greutatea, nu doar câte repetări să faci. Antrenează oameni pentru că a fost și el la început și știe exact unde se rupe firul.

### 5.6 Rezultate

**Darius B.** — before/after
> „Cu ajutorul lui David nu doar că mi-am schimbat corpul. Sala a devenit un hobby adevărat — și, mai important, ideea de a te îmbunătăți puțin în fiecare zi."

**Meril** — before/after
> „Am venit din Elveția ca să studiez Medicina și nu vorbesc română. Cu David ne-am înțeles perfect de la început și am făcut un progres mare în scurt timp."

Sub Meril, ca argument de vânzare: **mentoratul funcționează și în engleză.**

### 5.7 Cum decurge

1. **Scrii** — un mesaj pe WhatsApp sau Instagram. Prima discuție e gratuită
2. **Construim planul** — pornind de la ce sport faci, cât timp ai și ce mănânci acum
3. **Ajustăm** — săptămână de săptămână, cu acces direct la David

### 5.8 Întrebări

- **N-am timp, am facultate.** Și David are. Planul se construiește în jurul orarului tău, nu invers.
- **N-am mai fost niciodată în sală.** E cazul cel mai bun. N-ai obiceiuri proaste de dezvățat.
- **Trebuie să renunț la ieșiri și la bere?** Nu. Vezi mai sus.
- **Nu vorbesc română.** Meril nu vorbește nici el. Mentoratul merge în engleză.

### 5.9 CTA final

**Titlu:** Prima discuție e gratuită.
**Corp:** Scrii, vorbim, îți spun sincer dacă te pot ajuta. Dacă nu simți că e pentru tine, nu se întâmplă nimic.

## 6. Sistemul vizual

### Culoare

| Token | Valoare | Rol |
|---|---|---|
| `--color-ink` | `#0A0A0B` | Fundal |
| `--color-ink-raised` | `#141416` | Carduri, suprafețe ridicate |
| `--color-bone` | `#F2EFE9` | Text principal |
| `--color-bone-dim` | `#A3A099` | Text secundar |
| `--color-ember` | `#FF5C1A` | Accent primar — CTA, indicatori activi |
| `--color-deep` | `#0E4A4F` | Accent secundar — secțiunile de echilibru |
| `--color-hairline` | `rgba(242,239,233,0.10)` | Chenare |

Un singur accent primar, folosit rar. Dacă ember-ul apare peste tot, nu mai înseamnă nimic.

### Tipografie

- **Display:** `Archivo` variabil (axe `wght` + `wdth`). Titluri uppercase, `wdth` ridicat, tracking `-0.02em`
- **Body:** `Inter` variabil
- Ambele prin `next/font/google`, self-hosted, `display: swap`
- Scală fluidă cu `clamp()`. Corp de text 17px minim pe mobil

### Spațiu și grid

Scală pe bază de 4px. Pe mobil: o coloană, padding lateral 20px, `padding-bottom` care ține cont de nav (`calc(64px + env(safe-area-inset-bottom))`). Peste `lg`, lățime maximă 1200px, centrat.

### Principii de mișcare

- Durate 180–320ms pentru UI, până la 600ms pentru intrări de secțiune
- Easing standard: spring (`stiffness 300, damping 30`) pentru interacțiuni; `cubic-bezier(0.22, 1, 0.36, 1)` pentru intrări
- Intrările de secțiune sunt subtile: 16px translate + fade. Nimic care sare
- Totul animat respectă `prefers-reduced-motion` — atunci rămân doar opacitățile
- Nicio animație nu blochează citirea conținutului sau apăsarea unui buton

## 7. Arhitectura componentelor

```
src/
  app/
    [locale]/
      layout.tsx            # fonturi, providers, BottomNav, ContactFab
      page.tsx              # homepage
      metoda/page.tsx
      rezultate/page.tsx
      despre/page.tsx
    layout.tsx              # <html>, redirect la locale
    robots.ts
    sitemap.ts
    opengraph-image.tsx
  components/
    nav/BottomNav.tsx       # client
    nav/ContactFab.tsx      # client
    hero/HeroStories.tsx    # client — orchestratorul slideshow-ului
    hero/StoryProgress.tsx
    hero/StoryVideo.tsx
    method/BarbellScene.tsx # client, dynamic ssr:false
    method/BarbellFallback.tsx
    results/BeforeAfter.tsx # client — slider comparativ
    ui/Section.tsx
    ui/Reveal.tsx           # wrapper de intrare, respectă reduced-motion
    ui/CtaButton.tsx
  content/
    ro.ts  en.ts            # tot copy-ul, tipat
  lib/
    contact.ts              # linkuri WhatsApp/IG dintr-un singur loc
    device.ts               # detecție reduced-motion, save-data, low-end
  i18n/
    routing.ts  request.ts
```

Regula de limită: fiecare componentă are un singur motiv de existență și primește conținutul prin props. Copy-ul nu e niciodată hardcodat într-o componentă — vine din `content/{locale}.ts`, altfel traducerea EN se desincronizează.

`lib/contact.ts` e singurul loc unde apar numărul de telefon și handle-ul de Instagram.

## 8. Pipeline de media

Assets-urile brute (~42MB) nu ajung niciodată în `public/`. Un script de build one-off le procesează în `public/media/`.

### Video

Sursă: 6 clipuri, 21MB total. Ținta: sub 2MB fiecare.

```
ffmpeg -i <src> -vf "scale=-2:1080" -c:v libx264 -profile:v main -crf 27 \
       -preset slow -movflags +faststart -an <out>.mp4
ffmpeg -i <src> -vf "scale=-2:1080" -c:v libvpx-vp9 -crf 34 -b:v 0 -an <out>.webm
```

Poster: primul cadru, AVIF + WebP, 1080px.

| Fișier sursă | Ieșire | Cuvânt | Folosit în |
|---|---|---|---|
| `WhatsApp Video ... 11.54.03.mp4` | `01-sala` | RIDICĂ | hero |
| `... 11.54.03 (4).mp4` | `02-box` | LOVEȘTE | hero |
| `... 11.54.03 (2).mp4` | `03-catarat` | CAȚĂRĂ | hero |
| `... 11.54.03 (1).mp4` | `04-apa` | SARI | hero |
| `... 11.54.03 (5).mp4` | `05-alergare` | ALEARGĂ | hero |
| `... 11.54.03 (3).mp4` | `06-catarat-larg` | — | /metoda |

Clipul de cățărat lung (29.5s) se taie la primele 8 secunde. Toate clipurile rulează 6s în slideshow, indiferent de durata sursei.

### Imagini

Redenumite semantic, convertite în AVIF + WebP, servite prin `next/image`.

| Sursă | Ieșire | Folosire |
|---|---|---|
| `11.54.05.jpeg` | `balance-beer` | secțiunea Echilibru |
| `11.54.23 (1).jpeg` | `balance-fastfood` | secțiunea Echilibru |
| `11.54.04 (6).jpeg` | `nutrition-plate` | pilonul Nutriție |
| `11.54.04 (2).jpeg` | `physique-gym` | proof |
| `11.54.04 (3).jpeg` | `outdoor-summit` | pilonul Sport |
| `11.54.04 (9).jpeg` | `climbing-wall` | pilonul Cățărat |
| `11.54.04 (7).jpeg` | `training-bench` | Pentru prima dată |
| `11.54.05 (3).jpeg` | `hiking-peaks` | /despre |
| `11.54.05 (4).jpeg` | `physique-mirror` | proof |
| `11.54.23.jpeg` | `david-formal` | /despre |
| `11.54.04 (8).jpeg` | `sea-rest` | Echilibru / recuperare |

`testimonial_meril/before.jpeg` e un screenshot de Instagram Story — se decupează UI-ul telefonului înainte de folosire.

Logo-urile SVG din `assets/instagram_logo` și `assets/whatsapp_logo` se folosesc ca atare în FAB.

## 9. Hero — slideshow-ul

**Comportament:** 5 clipuri verticale full-bleed, autoplay muted loop cu `playsInline`, crossfade de 400ms. Bare de progres sus, una per clip, care se umplu în 6s. Tap în treimea stângă = înapoi, dreapta = înainte, ținut apăsat = pauză. Swipe orizontal schimbă clipul.

**Încărcare:** clipul 1 are `preload="auto"` și poster inline. Clipurile 2–5 se montează cu `preload="none"` și se preîncarcă pe `requestIdleCallback` după ce primul a pornit.

**Degradări, în ordine de prioritate:**
1. `prefers-reduced-motion` → slideshow de postere statice, fără video, tranziție doar prin opacitate
2. `navigator.connection.saveData` sau `effectiveType` sub `4g` → același lucru
3. Autoplay respins de browser → rămâne posterul, apare un buton de play
4. Videoclipul dă eroare → se sare automat la următorul

**Accesibilitate:** slideshow-ul e `aria-roledescription="carousel"` cu butoane reale de prev/next vizibile la focus. Cuvântul suprapus e text real, nu imagine. Videoclipurile sunt decorative, `aria-hidden`, cu conținutul esențial în text alături.

## 10. Scena 3D

**Ce e:** o bară de haltere care se asamblează pe măsură ce derulezi secțiunea Metoda. Fiecare disc reprezintă un pilon și se montează când pilonul respectiv intră în viewport. Când toate cele 6 sunt montate, bara se ridică ușor și se oprește.

**De ce așa:** obiectul e argumentul — nu construiești fizicul dintr-un singur lucru, ci adăugând straturi peste ce îți place deja. Un 3D decorativ ar fi cost fără sens pe mobil.

**Implementare:**
- `three` + `@react-three/fiber` + `@react-three/drei`
- Geometrie procedurală (cilindri + tor), fără model GLTF de descărcat
- O singură lumină direcțională + ambient. Fără sombre, fără post-procesare
- `dpr={[1, 2]}`, `frameloop="demand"` — randează doar când se schimbă ceva
- Montat prin `dynamic(() => ..., { ssr: false })`, declanșat de `IntersectionObserver`
- Drag cu degetul rotește bara pe axa Y, cu inerție

**Fallback obligatoriu** (`BarbellFallback`) când: `prefers-reduced-motion`, `hardwareConcurrency <= 4`, `deviceMemory <= 4`, WebGL indisponibil, sau eroare la montare. Fallback-ul e o compoziție statică cu aceleași 6 etichete — arată intenționat, nu a eșec.

## 11. i18n

`next-intl` cu prefix de locale mereu prezent. `/` → redirect `/ro`.

Comutatorul de limbă stă în footer și în `/despre`, nu în bottom nav — bottom nav-ul are 4 tab-uri și rămâne așa.

Copy-ul trăiește în `content/ro.ts` și `content/en.ts`, tipate împotriva aceleiași interfețe, astfel încât o cheie lipsă în EN să fie eroare de compilare.

## 12. SEO și AI-SEO

- `hreflang` reciproc RO↔EN plus `x-default` pe RO
- JSON-LD: `Person` (David, cu `jobTitle`, `knowsAbout`, `sameAs` către Instagram), `Service` (mentoratul, `areaServed: RO`, `availableLanguage: [ro, en]`), `FAQPage` pe secțiunea de întrebări
- `sitemap.ts` și `robots.ts` generate. GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended **permiși explicit**
- `llms.txt` la rădăcină: ce e mentoratul, cui se adresează, în ce limbi, cum se ia legătura
- Fără `/pricing.md` — nu avem prețuri publice
- OG image generată cu `next/og`, câte una per locale
- Fiecare secțiune începe cu răspunsul în primele 40–60 de cuvinte. Fără introduceri de încălzire
- HTML semantic: `<main>`, `<nav>`, `<article>`, ierarhie corectă de heading-uri, `alt` real pe fiecare imagine

## 13. Bugete de performanță

Măsurate pe Moto G Power, 4G simulat, Lighthouse mobile:

| Metrică | Buget |
|---|---|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.05 |
| JS inițial (fără 3D) | < 180KB gz |
| Bundle 3D (lazy) | < 200KB gz |
| Primul clip video | < 2MB |
| Lighthouse Performance mobil | ≥ 90 |

`optimizePackageImports` activat pentru `@phosphor-icons/react`. Nicio iconiță nu se importă din barrel-ul complet.

## 14. Accesibilitate

- Contrast minim 4.5:1 pentru text pe fundal. Ember pe negru se verifică — dacă pică, se folosește doar ca fundal cu text întunecat, nu ca text
- Ținte de atins minim 44×44px, cu 8px între ele
- Focus vizibil peste tot, niciodată `outline: none` fără înlocuitor
- Bottom nav: `<nav aria-label>`, tab-ul activ cu `aria-current="page"`
- FAB: `aria-expanded`, focus trap cât e deschis, Escape îl închide
- Nicio informație transmisă exclusiv prin culoare

## 15. Verificare

Nu e un proiect cu logică de business, deci nu are teste unitare. Se verifică prin:

1. `tsc --noEmit` și `next lint` curate
2. `next build` fără warnings
3. Lighthouse mobil pe toate cele 4 rute, RO și EN — praguri de la §13
4. Verificare manuală pe device real, în ordinea asta: iPhone Safari (safe area, autoplay, `100dvh`), Android Chrome, desktop
5. Degradările din §9 forțate manual: reduced-motion pornit, throttling pe Slow 4G, WebGL dezactivat
6. Fiecare link de contact apăsat pe telefon real — se deschide aplicația corectă
7. `seo-audit` rulat pe build-ul final

## 16. Riscuri și puncte deschise

| # | Element | Stare |
|---|---|---|
| 1 | **Handle-ul de Instagram** | **Lipsă.** Blocant pentru FAB și pentru `sameAs` în JSON-LD. Se implementează cu o constantă marcată `TODO` în `lib/contact.ts` |
| 2 | Numele de familie al lui Meril | Lipsă. Până la confirmare apare doar „Meril" |
| 3 | Inițiala lui Darius | Presupusă „Darius B." — de confirmat |
| 4 | Scarcity („număr limitat de locuri") | Se publică doar dacă David confirmă. Altfel secțiunea dispare |
| 5 | Lipsește video de înot | Pilonul Înot folosește clipul cu săritura în mare și poza de la mare. Nu pretindem că e înot |
| 6 | Domeniu propriu | Nu există. Deploy pe subdomeniu Vercel. Canonical-urile se citesc din env, ca schimbarea ulterioară să fie o singură variabilă |
| 7 | Greutatea 3D pe telefoane vechi | Acoperit de fallback-ul din §10, dar se verifică pe device real |

Numărul de telefon confirmat: **+40 755 659 389** → `wa.me/40755659389`.
