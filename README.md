# David Biriș — Mentorat 1-la-1

Site static de prezentare pentru mentoratul de fitness 1-la-1 al lui David Biriș.
Română și engleză. Fără backend: fiecare CTA duce în WhatsApp sau Instagram.

Mobile-first. Navigarea stă jos, ca la o aplicație, iar butonul de contact e sticky
în dreapta jos.

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
| `npm run typecheck` | `tsc --noEmit` (rulează `next typegen` înainte) |
| `npm run test` | Teste Vitest pentru modulele pure |
| `npm run lint` | ESLint |
| `npm run media` | Reprocesează media brută în `public/media/` |

## Media

`npm run media` **nu** rulează la build. Are nevoie de `ffmpeg` instalat local și de
directoarele `assets/`, `testimonial_darius/`, `testimonial_meril/`, care sunt ignorate
de git. Ieșirea din `public/media/` e comisă în repo, deci deploy-ul nu depinde de ffmpeg.

Rulează-l doar când se schimbă pozele sau clipurile sursă.

Două lucruri de știut dacă îl rulezi din nou:
- Re-encodarea VP9 e nedeterministă, deci fișierele `.webm` apar modificate chiar dacă
  nimic real nu s-a schimbat. Dă-le `git checkout` dacă n-ai schimbat clipurile.
- Scriptul nu curăță ieșiri orfane. Dacă scoți o intrare din `VIDEOS`/`IMAGES`, fișierele
  ei rămân în `public/media/` până le ștergi manual.

## Unde se schimbă ce

| Vrei să schimbi | Fișier |
|---|---|
| Număr de telefon, handle de Instagram | `src/lib/contact.ts` |
| Orice text vizibil, în orice limbă | `src/content/ro.ts`, `src/content/en.ts` |
| Culori, fonturi, spațieri | `src/app/globals.css` (blocul `@theme static`) |
| Ce poze apar unde | `src/content/*.ts`, câmpurile `image` / `*Src` |
| URL-ul public (canonical, sitemap, OG) | variabila de mediu `NEXT_PUBLIC_SITE_URL` |

Textele nu se scriu niciodată direct în componente. Dacă găsești un string vizibil
într-un `.tsx`, e un bug — mută-l în `src/content/`.

Cele două fișiere de conținut sunt tipate împotriva aceleiași interfețe, iar un test de
paritate compară structura lor. O cheie adăugată doar într-o limbă pică la `tsc` și la teste.

## Decizii care par ciudate dar sunt intenționate

**Nu folosim o bibliotecă de animație.** Cele patru animații — indicatorul de tab,
butonul de contact, intrarea la scroll, rotația iconiței — sunt CSS. `motion` costa
45 KB gz din încărcarea inițială, iar animațiile lui în JavaScript nu respectau blocul
global `prefers-reduced-motion`, pentru că acela guvernează doar CSS.

**`Reveal` n-are JavaScript deloc.** Folosește `animation-timeline: view()` sub
`@supports`. Într-un browser fără suport, conținutul e pur și simplu vizibil. Nu există
starea „a rămas invizibil pentru că observer-ul n-a pornit" — care ar fi însemnat pagină
goală pentru un crawler care nu execută JS.

**Video-ul așteaptă confirmarea capabilităților device-ului.** `shouldPlayVideo` întoarce
`false` până când `detect()` chiar a rulat. Un cadru de redare care se oprește e inofensiv,
dar o cerere de rețea pe economie de date, odată trimisă, nu se mai poate anula.

**Scena 3D nu folosește `@react-three/drei`.** Nu aveam nevoie de niciun helper din el, iar
el trage tranzitiv o a doua copie de `three`.

**Butonul de contact ține acțiunile montate, ascunse cu `inert`.** Așa animează și intrarea
și ieșirea fără bibliotecă, iar `inert` le scoate din ordinea de Tab și din arborele de
accesibilitate cât timp meniul e închis.

## Bugete de performanță

Măsurate pe build de producție, gzip, excluzând bundle-ul de polyfill-uri servit cu
`noModule` (browserele moderne nu-l execută).

| Metrică | Buget | Măsurat |
|---|---|---|
| JS inițial, per pagină | < 180 KB gz | 145–151 KB gz |
| Chunk 3D, încărcat leneș | < 240 KB gz | 229 KB gz |
| CSS | — | 6.7 KB gz |

Bugetul pentru chunk-ul 3D a fost ridicat de la 200 la 240 KB: `three` plus
`@react-three/fiber` nu coboară sub atât, iar chunk-ul e păzit de trei ori — se încarcă
doar în browser, doar când secțiunea intră în viewport, și doar dacă device-ul are WebGL,
procesor suficient, fără reduced-motion și fără economie de date.

## Reguli de conținut

Sunt decizii ale clientului, nu preferințe de stil:

- Fără cifre despre numărul de clienți
- Fără statistici
- Fără promisiuni de kilograme sau de interval de timp
- Fără formulări care sugerează că David e medic sau nutriționist licențiat
- Disclaimerul din footer rămâne, în ambele limbi

## Deploy

Vercel. Setează `NEXT_PUBLIC_SITE_URL` la URL-ul real de producție **înainte** de primul
build, altfel sitemap-ul, canonical-urile și imaginile OG se generează cu valoarea implicită.

## TODO deschise

- [ ] **`INSTAGRAM_HANDLE` din `src/lib/contact.ts` e provizoriu.** Trebuie înlocuit cu
      handle-ul real. Apare și în `sameAs` din JSON-LD, dar se schimbă într-un singur loc.
- [ ] De confirmat inițiala lui Darius („Darius B.")
- [ ] De confirmat numele complet al lui Meril
- [ ] De decis dacă se adaugă secțiunea „locuri limitate" (doar dacă e adevărat)
- [ ] Verificare pe telefon real: safe area pe iPhone, autoplay, gesturile din hero,
      scena 3D pe Android, parcurs complet la tastatură
