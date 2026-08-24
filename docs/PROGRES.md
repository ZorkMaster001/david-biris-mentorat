# Progres — unde suntem

Notă de context pentru sesiunile următoare. Se citește prima, ca să nu redescoperim structura de fiecare dată.

Ultima actualizare: 2026-08-24

## Ce s-a schimbat în runda asta

Cererea clientului, pe scurt: fără slideshow video în hero (doar o poză), clipurile coboară mai jos
într-o bandă cu pătrățele care derulează încet spre dreapta, iar la testimoniale textul stă între
ghilimele și sliderul înainte/după nu mai arată urât pe telefon.

### 1. Hero — o singură fotografie

- `src/components/hero/Hero.tsx` (nou, **server component**): imagine `poster-01-sala` cu `priority`,
  degradeu peste ea, eyebrow ember + h1 + subtitlu + două CTA-uri. Nu mai pornește nimic la încărcare,
  deci nu mai depinde de autoplay, save-data sau decodoare video.
- Șterse: `HeroStories.tsx`, `StoryVideo.tsx`, `StoryProgress.tsx`, `storyNavigation.ts`,
  `storyNavigation.test.ts`. Erau folosite exclusiv de slideshow-ul din hero.

### 2. Banda cu clipuri (marquee)

- `src/components/sections/Reel.tsx` — secțiune pe toată lățimea (nu folosește `Section`, care
  limitează copiii la 1200px). Așezată în pagină **după `Method`**, unde pilonii tocmai au enumerat
  sporturile pe care banda le arată.
- `src/components/reel/ClipMarquee.tsx` — două copii identice ale listei într-o pistă `w-max`.
  Gap-ul stă în `padding-right`-ul rândului, nu între rânduri, ca o copie să măsoare exact 50% din
  pistă și bucla să nu se vadă. Buton de oprire/pornire sub bandă (oprește și derularea, și clipurile).
- `src/components/reel/ClipTile.tsx` — pătrățel `aspect-square`, poster dedesubt + video peste, care
  se estompează la `onPlaying`. **IntersectionObserver per pătrățel**: un clip se încarcă abia când
  ajunge în dreptul ecranului și se oprește când iese — altfel ar rula 10 decodoare simultan.
  Redarea trece în plus prin `shouldPlayVideo()` din `src/lib/device.ts`.
- `src/app/globals.css` — `@keyframes reel-drift` (de la `-50%` la `0`, adică spre dreapta, 60s liniar),
  `.reel-viewport` (overflow hidden + mască de estompare pe margini), `.reel-track[data-paused]`,
  și un bloc `prefers-reduced-motion: reduce` care transformă banda în listă derulabilă cu degetul
  (`overflow-x: auto`) și ascunde copia decorativă + butonul de pauză.

### 3. Testimoniale

- `src/components/results/BeforeAfter.tsx`:
  - citatul e încadrat de ghilimele venite din conținut (`quoteOpen` / `quoteClose`), în `text-bone-dim`
    ca să nu concureze cu textul;
  - cadrul 9:16 are lățimea plafonată prin înălțime — `max-w-[38svh]` ține poza sub ~68% din ecran și o
    centrează în coloană (înainte ocupa mai mult decât ecranul pe telefon);
  - **mâner vizibil** pe linia de separare (cerc cu `ArrowsLeftRight`), ca să se vadă că imaginea se trage;
  - inel de focus pe cadru prin `has-[input:focus-visible]:outline-*`, fiindcă input-ul range e `opacity-0`
    și regula globală de focus nu prinde `input`.

### 4. Conținut

`src/content/types.ts`, `ro.ts`, `en.ts`:

- `HeroSlide` → `ReelClip`;
- `hero` a pierdut `slides` / `prevSlideLabel` / `nextSlideLabel` / `pauseLabel` / `resumeLabel` și a
  primit `eyebrow`, `image`, `imageAlt`;
- secțiune nouă `reel: { eyebrow, headline, pauseLabel, resumeLabel, clips }`, așezată între `method`
  și `david`;
- `results` a primit `quoteOpen` / `quoteClose` (RO `„ ”`, EN `“ ”`).

**Atenție la testul de paritate** (`src/content/content.test.ts`): compară cheile *în ordine* între
`ro` și `en`, deci orice cheie nouă se adaugă în aceeași poziție în ambele fișiere.

## Runda 2 (aceeași zi)

Feedback client: clipurile nu rulau, titlurile de pe ele trebuie scoase, la Despre voia poza lui
în loc de iconița cu cerc, hero cu o poză mai tare, fără liniuțele lungi din texte, butoane mai
bune, gantera mai tare, portocaliul e urât.

**Decizii luate de client (nu se schimbă fără să întrebi):** accent turcoaz `#2FE6C4`, poza de hero
`hiking-peaks` (el pe marginea stâncii), iar prin „scoate `---`" se referea la **liniuțele lungi din
texte**, nu la liniile orizontale de separare — acelea rămân.

- **De ce nu rulau clipurile** (două cauze, ambele reparate în `ClipTile.tsx`): `play()` e respinsă
  cu `AbortError` de fiecare dată când `pause()` o întrerupe, iar în bandă asta se întâmplă la
  fiecare pătrățel care iese din cadru; `catch` marca clipul stricat, deci după câteva secunde
  totul rămânea pe postere. În plus opacitatea video-ului era legată de `onPlaying`, deci un
  eveniment întârziat lăsa pătrățelul pe poster. Acum respingerea lui `play()` e ignorată (erorile
  reale vin pe `onError`), video-ul stă opac tot timpul peste poster, `preload="metadata"`, iar
  observer-ul are `threshold: 0` și `rootMargin: "0px 300px"`.
- Titlurile de pe pătrățele: scoase, împreună cu câmpul `word` din `ReelClip` și din conținut.
- Paleta: `--color-ember` redenumit `--color-signal` (#2FE6C4). `--color-deep` a devenit `#22333c`,
  un gri-albastru neutru, fiindcă vechiul verde-închis intra în conflict cu turcoazul. Accentul e
  schimbat și în `opengraph-image.tsx`.
- Butoane: font de display versal, săgeată care alunecă la hover, primarul se umple cu alb-os și
  capătă o umbră turcoaz.
- Gantera 3D: bară cu zonă de priză mată și capete cromate, discurile au acum inel luminos turcoaz
  pe muchie care se răcește la o valoare constantă, iluminare cu contur din spate în culoarea de
  accent, înclinare fixă și rotație lentă permanentă. Bucla rulează continuu, dar canvas-ul e montat
  doar cât secțiunea e pe ecran.
- Bara de jos: tabul „Despre" are chipul lui David într-un cerc (alb-negru când e inactiv, color cu
  inel turcoaz când e activ). Avatarul e `public/media/img/david-avatar.{avif,webp}`, decupat din
  `sea-rest`; decupajul e trecut în `scripts/process-media.mjs` ca să fie reproductibil.
- Hero: `hiking-peaks`, `object-[50%_45%]`, degradeu mai slab sus ca să rămână cerul.
  `poster-06-catarat-larg` a intrat în galeria de la /despre în locul lui `hiking-peaks`.
- Liniuțele lungi scoase din toate textele din `ro.ts` / `en.ts`. Au rămas doar în comentariile din
  cod, care nu se văd.

## Runda 3 (aceeași zi)

Feedback client: accordeonul de FAQ e urât, vrea buton; scoate eyebrow-urile („Cine te învață",
„Metoda", „Rezultate" etc.).

- **Eyebrow-urile au dispărut de tot**, nu doar din randare: câmpul `eyebrow` a ieșit din
  `Content`, din `ro.ts` / `en.ts`, propul a ieșit din `Section`, iar `Hero` și `Reel` nu-l mai
  primesc. Titlurile mari (h1/h2) rămân, ele duc conținutul și SEO-ul.
- **FAQ**: rămâne `<details>` nativ (merge fără JavaScript, e navigabil de la tastatură, se
  citește de crawler și închis), dar fiecare întrebare e desenată acum ca buton propriu: card cu
  chenar rotunjit, cerc de plus în dreapta care se rotește 45° și se umple cu turcoaz la
  deschidere, chenar turcoaz cât e deschis. Cardurile sunt separate prin spațiu, nu prin linii.
- `summary` a fost adăugat la regula globală de focus din `globals.css`: e focusabil nativ, dar nu
  e nici link, nici buton, deci conturul de focus îl sărea.

## Runda 4 (aceeași zi)

Feedback client: lipsește comutatorul de limbă din navigație; nu-i place cum se schimbă culorile de
fundal între secțiuni; gantera 3D e mult mai rea decât înainte.

- **Gantera: revenită la varianta dinainte**, singura diferență față de original fiind culoarea
  emisivă, acum turcoaz. Adăugirile din runda 2 (inele torus, capete cromate, zonă de priză,
  înclinare, rotație lentă permanentă, iluminare pe trei direcții) au fost respinse și scoase.
  **Nu le pune la loc.** Bucla a revenit la `frameloop="demand"` cu adormire reală.
- **Fundal uniform**: `tone="deep"` a ieșit din `Section`, la fel și tokenul `--color-deep`.
  Toate secțiunile sunt acum `bg-ink`. Balance și FAQ nu mai au bandă separată.
- **Comutator de limbă**: `components/nav/LocaleSwitch.tsx`, fixat sus-dreapta pe toate paginile,
  montat din `[locale]/layout.tsx`. Păstrează ruta curentă (schimbă doar segmentul de limbă).
  Cel din footer a fost scos ca să nu fie două, iar `Footer` a rămas doar cu `data`: propurile
  `locale` și `route` nu mai aveau utilizator.

## Runda 5 (aceeași zi)

Feedback client: clipurile tot nu rulează, în bandă se văd doar poze; vrea steaguri la RO/EN; pe
telefon before/after e prea mic ca să se vadă diferența.

- **Clipuri, a doua încercare.** Cauza cea mai probabilă de data asta e gardul de rețea din
  `lib/device.ts`: `effectiveType === "3g"` intra la `slowNetwork`, iar telefoanele raportează „3g"
  foarte des pe conexiuni perfect bune, deci `shouldPlayVideo` returna fals și banda rămânea pe
  postere pe aproape orice telefon. Acum blochează doar `2g` / `slow-2g`. În plus, în `ClipTile`:
  `video.muted = true` forțat înainte de `play()` (React setează `muted` ca proprietate, nu ca
  atribut, iar unele browsere verifică atributul când decid autoplay-ul) și o a doua încercare de
  `play()` pe evenimentul `canplay`.
  **Rămâne neconfirmat** — n-am putut deschide pagina. Dacă tot nu merge, suspecții următori sunt
  Low Power Mode pe iPhone (blochează autoplay complet, nu se poate ocoli din cod) și `saveData`
  pornit în browser.
- Steaguri: `components/nav/Flag.tsx`, SVG desenat, nu emoji — pe Windows emoji-urile de steag n-au
  glif și s-ar fi văzut ca două litere.
- Before/after: plafonul de lățime a urcat la `46svh` pe telefon (adică practic toată lățimea) și
  `40svh` de la `sm` în sus.

## Stare

- `npm run typecheck`, `npm run lint`, `npm test` (31 teste), `npm run build` — toate trec.
- **Nimic neverificat vizual de mine.** Clientul a refuzat de două ori pornirea browserului din
  sesiune, deci nu există niciun screenshot. Rulează deja un `next dev` pe portul 3000 (PID 8136),
  pornit din afara sesiunii. De verificat cu ochiul, pe telefon și pe desktop:
  1. **dacă pornesc clipurile din bandă** — asta e reparația principală din runda 2 și e singura
     nedemonstrată;
  2. heroul: încadrarea lui `hiking-peaks` pe ecran lat, dacă textul stă bine peste granit;
  3. banda: viteza (60s / buclă), mărimea pătrățelelor (`62vw`, max 300px), dacă saltul buclei se vede;
  4. gantera: dacă inelele turcoaz și conturul din spate arată cum trebuie pe un GPU real;
  5. testimonialele: mărimea cadrului pe telefon și dacă mânerul se vede bine;
  6. avatarul din bara de jos la 24px.
- Nimic nu e comis; modificările sunt în working tree pe `main`.

## Hartă rapidă a proiectului

- Conținut bilingv, o singură sursă: `src/content/{ro,en}.ts`, tipuri în `types.ts`. Nicio literă în componente.
- Pagini: `src/app/[locale]/{page,despre/page,metoda/page,rezultate/page}.tsx`.
- Componente: `hero/`, `reel/`, `sections/`, `results/`, `method/`, `nav/`, `seo/`, `ui/`.
- Degradări de capabilități: `src/lib/device.ts` (`shouldPlayVideo`, `shouldRender3D`) — orice element
  greu trece pe acolo.
- Media procesată: `public/media/{img,video}`, generată de `scripts/process-media.mjs` din `assets/`.
  Video `06-catarat-larg` și posterul lui există dar nu sunt folosite nicăieri.
- Comentariile din cod sunt în română, fără diacritice. Se păstrează convenția.

## Runda 6 (2026-08-24)

Feedback client: la testimoniale numele să iasă mai în evidență; discurile ganterei să fie mai
unite; la scroll să tot apară câte un disc, iar în repaus bara să fie goală; pe telefon gantera
n-are animație; pe desktop clipurile din bandă nu rulează.

- **Gantera nu pornea nici pe telefon, nici pe desktopul clientului.** `detect()` marca
  `lowEndCpu` la `hardwareConcurrency <= 4 || deviceMemory <= 4`. Chrome rotunjește în jos și
  plafonează `deviceMemory` anume ca să nu identifice dispozitivul, deci Android raportează des `4`;
  iar desktopul clientului raportează `hardwareConcurrency: 4` (măsurat în browser în sesiune).
  Ambele praguri au coborât la `<= 2`. Scena are șase forme simple și `frameloop="demand"`.
- **Discurile**: pasul dintre ele pe aceeași parte a scăzut de la `0.34` la grosime + `0.02`
  (`PLATE_STEP`), iar primul disc urcă de la `0.95` la `0.5` de centru. Constante numite, nu numere
  în formulă.
- **Bara se golește la loc**: `PillarList` nu mai crește monoton. Un pilon e „trecut" dacă vârful lui
  e peste linia de declanșare (`entry.rootBounds.bottom`), nu dacă intersectează — altfel un pilon
  ieșit pe sus ar fi scos discul de pe bară. Contorul scade la scroll în sus, deci efectul se reia.
  Discurile își reîncarcă și emisia cât stau pe lângă bară.
- **Clipurile din bandă, cauza reală.** `ClipTile` folosea `IntersectionObserver` ca să decidă ce
  pătrățel rulează. Pătrățelele sunt purtate de o animație de `transform` pe pistă, iar animațiile de
  transform rulează pe firul compozitorului: firul principal nu-și mai actualizează stilul la fiecare
  cadru, deci observatorul rămâne cu pozițiile de la pornire și nu anunță niciodată pătrățelele care
  chiar au intrat în cadru. Înlocuit cu `getBoundingClientRect` pe un ceas comun de 400ms
  (~43px de derivă pe tur, sub marja de 300px), oprit când `document.hidden`.
- **Banda nu acoperea ecranele late.** O copie a listei măsura 5×300 + gap-uri = 1600px, deci pe
  1920px rămânea o porțiune goală în dreapta la fiecare tur. `ClipMarquee` repetă acum lista de câte
  ori e nevoie ca o copie să fie cel puțin cât ecranul (măsurat după montare, recalculat la resize).
- **`onError` de pe `<video>`**: `error` nu urcă în DOM, dar React îl propagă prin arborele lui, deci
  handler-ul prindea și eșecul unui singur `<source>`. O sursă `webm` respinsă marca tot clipul
  stricat, deși browserul ar fi trecut la `mp4`. Acum se verifică `event.target === event.currentTarget`.
- **Testimoniale**: numele trece pe `font-display` + `text-signal` (turcoaz), nota de dedesubt cedează
  turcoazul și păstrează doar bara din stânga, ca să nu fie două accente lipite.

### Neverificat vizual

`npm run typecheck`, `lint`, `test` (31) trec. Fereastra Chrome a rămas în fundal toată sesiunea
(`document.visibilityState: "hidden"`, 0 rAF, screenshot-ul dă timeout), deci n-am putut confirma
cu ochiul nici banda, nici gantera. Măsurătorile din DOM sunt reale (lățimi, `hardwareConcurrency`),
restul e dedus din cod.

## Runda 7 (2026-08-24)

Feedback client: pe /despre poza din dreapta jos e de fapt un „înainte" — s-o pună în pereche cu un
„după", bilingv, dar cu o săgeată desenată, nu cu slider; și să bage fundalul Silk de la react-bits
peste tot unde nu sunt poze, cu textul rămas vizibil.

- **`npx shadcn@latest add @react-bits/Silk-JS-CSS` n-a fost rulat.** Cere întâi să creeze
  `components.json` și să inițializeze proiectul: ar fi adăugat `cn` / `clsx` / `tailwind-merge`,
  alias-uri noi și ar fi rescris `globals.css`, unde stă paleta `@theme static`. Shader-ul e scris
  direct în `src/components/bg/Silk.tsx`, cu exact aceleași props (`speed`, `scale`, `color`,
  `noiseIntensity`, `rotation`) și pe `@react-three/fiber`, care era deja în proiect.
- **Fundalul e un singur strat fix** (`SilkBackground`, montat în `[locale]/layout.tsx`,
  `fixed inset-0 -z-10`), nu câte un fundal pe secțiune — clientul a respins deja în runda 4 benzile
  de culoare care se schimbau de la o secțiune la alta. `Section` și `Reel` au pierdut `bg-ink`, deci
  matasea se vede peste tot unde nu e fotografie sau card. `body` rămâne `--color-ink`, care e baza.
- **Contrastul.** `#94b8b7` la intensitate plină e mai deschis decât textul os, deci pagina ar fi
  devenit ilizibilă. Canvasul stă la `opacity-30`: modelul urcă până pe la `#333f3f`, unde textul
  păstrează ~11:1. **Ăsta e butonul de reglaj** dacă pare prea slab sau prea tare
  (`opacity-30` în `SilkBackground.tsx`).
- Degradări: shader-ul trece prin `shouldRender3D`, deci nu pornește fără WebGL, la reduced motion,
  pe save-data sau pe telefoane slabe. În locul lui rămâne `.silk-fallback` din `globals.css`, două
  degradeuri radiale în aceleași culori. `dpr={1}` — e un fundal difuz, la dpr 2 ar costa de patru ori
  mai mult fără nicio diferență vizibilă.
- **`/despre`**: `sea-rest` (el pe stânci la mare, înainte) + `outdoor-summit` (el pe creastă, după)
  în `components/about/Transformation.tsx`, cu o săgeată SVG desenată de mână — două treceri peste
  același traseu, a doua decalată și mai stinsă, ca la un creion. Pe telefon coloanele se așează una
  sub alta și săgeata se rotește în jos. **Fără slider anume**: pozele nu sunt din același unghi, deci
  o linie care le taie ar fi arătat a montaj, nu a progres.
  `poster-06-catarat-larg` a rămas singur dedesubt, pe 16:9.
- Conținut: `david.transformation` (headline + surse + alt-uri) în `types.ts`, `ro.ts`, `en.ts`, în
  aceeași poziție în ambele. Etichetele nu se repetă: vin din `results.beforeLabel` / `afterLabel`,
  aceleași cuvinte.

### Neverificat vizual

`typecheck`, `lint`, `test` (31), `build` — toate trec. Fereastra Chrome a rămas ascunsă și în runda
asta (`visibilityState: "hidden"`), deci nici fundalul, nici săgeata n-au fost văzute cu ochiul.

## Runda 8 (2026-08-24)

Feedback client: butoanele „Scrie-i lui David" să nu mai ducă direct pe WhatsApp — omul să aleagă
WhatsApp sau Instagram, și să arate bine, mai special decât butonul sticky din dreapta jos; iar
fundalul animat nu se vedea deloc.

- **De ce nu se vedea fundalul.** `body` avea `background-color: var(--color-ink)`. În ordinea de
  pictare a unui context de stivuire, copiii cu z-index negativ vin la pasul 2, iar fundalurile
  blocurilor obișnuite (deci și al lui `body`) abia la pasul 3 — `body` acoperea complet stratul de
  matase. Culoarea de bază a rămas doar pe `html`, de unde e propagată la panza documentului și se
  pictează sub tot. **Nu pune fundal înapoi pe `body`.**
- **`ContactCta`** (`components/contact/`) înlocuiește `CtaButton` în toate cele cinci locuri: hero,
  `FinalCta` și butonul de jos de pe /despre, /metoda, /rezultate. Deschide un `<dialog>` nativ cu
  `showModal()`, deci capcana de focus, Escape, fundalul inert și `::backdrop` vin de la browser, nu
  din cod. Panoul e foaie lipită de jos pe telefon și card centrat pe ecran lat; WhatsApp e cardul
  accentuat (turcoaz), Instagram rămâne pe chenar simplu.
- **Declanșatorul a rămas o legătură `<a>` către WhatsApp**, nu un buton: fără JavaScript face exact
  ce făcea înainte, în loc să fie un buton mort. Click-urile cu ctrl/cmd/shift/alt nu sunt
  interceptate, ca „deschide în tab nou" să meargă în continuare.
- Stilul butoanelor a ieșit în `components/ui/ctaStyles.ts`, ca `CtaButton` (server) și `ContactCta`
  (client) să arate identic.
- Conținut: `contact` a primit `pickerTitle`, `pickerBody`, `whatsappNote`, `instagramNote`,
  `closeLabel`; `hero.ctaPrimary` și `finalCta.cta` au pierdut „pe WhatsApp" / „on WhatsApp".
- Butonul sticky din dreapta jos (`ContactFab`) n-a fost atins.

### Verificat în DOM (tabul e tot ascuns, deci nimic văzut cu ochiul)

`bodyBg: rgba(0,0,0,0)`, `htmlBg: rgb(10,10,11)`, stratul de fundal prezent la `z-index: -10`,
secțiunile transparente, canvas montat. Fereastra de alegere: se deschide, ambele canale cu
link-urile corecte, focusul aterizează pe butonul de închidere, `aria-labelledby` legat.

### De rezolvat înainte de publicare

`INSTAGRAM_HANDLE` din `src/lib/contact.ts` e tot provizoriu (`davidbiris`). Acum Instagram e o
alegere de sine stătătoare în fiecare buton mare, nu doar o iconiță în colț, deci un handle greșit
se vede mult mai des. Apare și în JSON-LD (`sameAs`).

## Runda 9 (2026-08-24)

Feedback client: scoate legendele de sub cele trei poze de la /metoda; scoate a treia poză de jos
de la /despre; hero-ul și footer-ul nu îi plac, să fie mai speciale; și un buton lipit deasupra
barei de jos, cu „înapoi", care să apară odată ce intri pe o pagină interioară.

- **/metoda**: `<figcaption>`-urile au ieșit, iar `<figure>` a redevenit un simplu `div`. Numele
  pilonilor erau deja în lista de deasupra, repetate sub poze arătau a subtitrări de catalog.
  Rămân în `alt`, care e tot unghiul pilonului — o singură sursă, tradusă automat.
- **/despre**: `poster-06-catarat-larg` (banda 16:9 de sub perechea înainte/după) a fost scoasă.
  Pagina are acum portretul din secțiunea `David` plus perechea, atât.
- **Hero.** Titlul e împărțit în două câmpuri de conținut, `headline` + `headlineAccent`, ambele în
  același `h1`: a doua propoziție duce promisiunea, deci ea poartă turcoazul. **Nu tăia titlul după
  punct la randare** — s-ar rupe la prima schimbare de text. Peste asta: o linie turcoaz care se
  întinde din marginea stângă înaintea primului cuvânt, fotografia se apropie lent 24s
  (`hero-drift`), iar titlul / subtitlul / butoanele urcă eșalonat prin `--hero-delay`. Toată
  mișcarea e sub `prefers-reduced-motion: no-preference`; fără ea rămâne exact aceeași imagine cu
  același text, nemișcat. `opengraph-image` lipește la loc cele două câmpuri.
- **Footer.** Din trei rânduri de text a devenit: eticheta „Scrie-i direct", două pastile de contact
  (WhatsApp / Instagram) cu săgeată care alunecă la hover, o semnătură uriașă `David Biriș` în
  fontul de display la 10% opacitate, apoi disclaimer + copyright pe un rând separat de o linie.
  Semnătura e `aria-hidden`: numele apare deja în rândul de copyright. `Footer` primește acum și
  `contact`.
- **`BackButton`** (`components/nav/`): stânga jos, la aceeași înălțime cu butonul de contact din
  dreapta, deci cele două se echilibrează. Apare doar când `isActiveTab(pathname, locale, "")` e
  fals. **Duce la pagina principală, nu `history.back()`**: site-ul are patru pagini și o bară de
  navigare permanentă, iar `history.back()` ar fi scos omul de pe site dacă a aterizat direct pe
  /metoda dintr-o căutare. E `Link`, deci merge fără JavaScript și ctrl+click deschide în tab nou.
- Conținut nou: `backLabel` (lângă `nav`), `hero.headlineAccent`, `footer.contactLabel`,
  `footer.wordmark`. Aceeași poziție în `ro.ts` și `en.ts`.

### Verificat în DOM (tabul e tot ascuns — nimic văzut cu ochiul)

`/ro`: zero butoane de înapoi, `h1` se citește ca o singură frază, footer cu semnătură și două
legături. `/ro/metoda`: buton „Înapoi" către `/ro`, 128×50px, la 80px de jos, fără suprapunere cu
butonul de contact (care începe la 1833px); zero `figcaption`. `/en/despre`: buton „Back" către
`/en`, trei imagini în `main` (portret + înainte + după), etichetele „Before"/„After" traduse.

## Runda 10 (2026-08-24)

Feedback client: pe PC butoanele să fie centrate, nu pe stânga, la fel pe toate paginile, și
footer-ul la fel; scoate linia de deasupra titlului din hero și pune alt element; heroul să se
stingă la scroll — poza, textul și butoanele să dispară, și pe telefon; la ganteră discurile dispar
prea repede când dai scroll în sus; banda de clipuri să meargă puțin mai repede pe telefon.

- **Butoane centrate de la `sm:` în sus** (`flex sm:justify-center`) pe /despre, /metoda,
  /rezultate și în `FinalCta`. Pe telefon rămân pe toată lățimea, unde centrarea n-ar însemna nimic.
- **Footer centrat** de la `sm:` în sus: `sm:text-center` pe `<footer>`, pastilele de contact
  `sm:justify-center`, iar rândul de jos a devenit coloană cu `sm:items-center` în loc de
  `justify-between`. Disclaimerul a coborât de la 70ch la 62ch: centrat, 70 de caractere pe rând se
  citesc prost.
- **Hero: linia de accent a fost scoasă** (`hero-rule` și keyframe-ul ei). În loc a intrat un
  indicator de derulare pe marginea din dreapta — o linie subțire pe care coboară la nesfârșit un
  punct turcoaz. N-are text, deci nu cere traducere, și spune exact lucrul nou: că pagina răspunde
  la scroll. Centrat prin `top: calc(50% - 2rem)`, **nu** prin `-translate-y-1/2`: stingerea la
  derulare scrie ea însăși `transform` și ar fi șters centrarea.
- **Heroul se stinge la derulare.** Fotografia a intrat într-un înveliș propriu (`hero-fade-media`),
  ca să poată purta două mișcări cu cronologii diferite: învelișul se stinge la scroll, imaginea
  dinăuntru își face apropierea lentă de la încărcare. Textul și butoanele urcă și dispar
  (`hero-fade-text`). Cronologia e chiar derularea documentului — `animation-timeline: scroll(root
  block)`, `animation-range: 0 70vh` — deci zero ascultători de scroll în JavaScript.
  **Limită de suport:** merge pe Chrome/Edge 115+ și Safari 26+. Pe Firefox și pe iOS mai vechi
  heroul se rulează în sus normal, la opacitate plină. Proiectul accepta deja aceeași limită pentru
  `.reveal`.
- **Ganteră, două linii în loc de una** (`PillarList`): discul se montează când vârful pilonului
  urcă peste 65% din ecran, dar cade de pe bară abia sub 96%. Cu o singură linie, cei câțiva pixeli
  de scroll invers pe care îi face oricine ca să recitească o frază goleau bara pe loc. În plus
  ieșirea e mai lentă decât intrarea (`LERP_OUT = 0.035` față de `LERP = 0.09`) și discurile așteaptă
  la 3 unități de centru în loc de 5.5, deci drumul e mai scurt și nu mai pare o smucire.
- **Banda de clipuri: 38s pe telefon** (`max-width: 639px`), 60s în rest. Pe telefon o copie a
  listei măsoară vreo trei ecrane și jumătate față de unul singur pe desktop, deci la aceeași durată
  părea că stă pe loc.

### Verificat în DOM

`hero-rule`: 0 elemente. `hero-scroll-dot`: 1. Ambele straturi de hero au animație cu
`ScrollTimeline` atașat, iar `CSS.supports("animation-timeline: scroll()")` e `true`.
`reelDuration: 38s` — fereastra de test era la 430px lățime, deci media query-ul de telefon chiar
prinde. **Valorile de opacitate la derulare n-au putut fi citite**: tabul e ascuns
(`visibilityState: "hidden"`, 0 rAF), iar fără cadre randate cronologiile de scroll nu avansează,
deci `timeline.currentTime` e `null`. Declarația e corectă, efectul nu e văzut.

## Runda 11 (2026-08-24) — hero + SEO local

Feedback client: heroul reapare mai jos după ce se stinge, iar stingerea să dureze mai mult; și SEO
puternic pentru Târgu Mureș („antrenor tg mures", „antrenor fitness", căutări de slăbit), inclusiv
pentru motoarele AI.

### Heroul

- **Cauza reapariției:** `animation-timeline: scroll(root block)` cu `animation-range: 0 70vh` lega
  stingerea de poziția absolută a derulării, nu de element. Înlocuit cu o cronologie de vizualizare
  numită, declarată pe secțiune (`view-timeline-name: --hero`) și citită de straturi. Progresul e
  chiar ieșirea secțiunii din ecran, deci **nu are cum să se întoarcă**. Numele e obligatoriu: fără
  el fiecare strat și-ar măsura propria cronologie, iar banda de text de jos s-ar stinge cu totul
  altfel decât fotografia care umple ecranul.
- Intervalul a crescut de la 70vh la toată înălțimea heroului (`exit 0% exit 85%`).
- Longhand-uri în loc de prescurtarea `animation`: aceea resetează și durata, iar `0s` pe o
  cronologie de derulare sare peste tot intervalul.

### SEO — ce s-a schimbat

- **`<html lang>` era fixat pe „ro" pentru ambele limbi.** Layout-ul rădăcină a coborât la
  `app/[locale]/layout.tsx` (pattern documentat în `next/dist/docs/.../internationalization.md`),
  `app/layout.tsx` și `app/page.tsx` au fost șterse, iar `/` → `/ro` e acum un **308 din
  `next.config.ts`**, nu o pagină randată. Permanent, nu temporar: consolidează `/` în `/ro`.
- **Orașul nu apărea nicăieri pe site.** Acum: în titlurile și descrierile tuturor paginilor, în
  două întrebări noi de FAQ și într-un `<address>` vizibil în subsol, cu telefon `tel:`. Google
  potrivește afacerea cu localitatea din **conținutul vizibil**; o adresă care există doar în JSON-LD
  e un semnal mult mai slab.
- **Titluri per pagină explicite** (`content.pageMeta`), în loc de `headline + meta.title`, care
  ieșea peste 60 de caractere și era tăiat exact peste cuvintele care contează.
- **Graf de date structurate legat prin `@id`**: `Person` → `worksFor` → `LocalBusiness` →
  `provider` → `Service`, plus `FAQPage` pe pagina principală (6 întrebări acum). Adresa are doar
  localitatea și județul. **Strada, `geo`, programul și prețul lipsesc pentru că nu le știm** — vezi
  TODO(client) în `src/lib/business.ts`. O adresă inventată ar fi mai rea decât una lipsă.
- `openGraph` și `twitter` lipseau cu totul; adăugate, cu `og:locale` / `alternateLocale`.
- Sitemap: `x-default` adăugat pe fiecare rută.
- **`llms.txt` e acum generat** (`app/llms.txt/route.ts`) din același modul de conținut ca site-ul.
  `public/llms.txt`, scris de mână, era deja depășit și a fost șters. Faptele care existau doar
  acolo (public 17–27 ani, prețul nepublic, prima discuție gratuită) au fost păstrate.
- robots: adăugați `anthropic-ai` și `OAI-SearchBot`. `CCBot` rămâne blocat.

### Blocaje reale înainte de publicare

1. **`SITE_URL` e `https://david-biris.vercel.app`** — un plasator. Toate canonicalele, hreflang-ul,
   sitemap-ul, `og:url` și `@id`-urile din schema pleacă de acolo. Se setează prin
   `NEXT_PUBLIC_SITE_URL`.
2. **`INSTAGRAM_HANDLE` e provizoriu** (`davidbiris`). Apare în `sameAs` pe fiecare pagină, în
   `llms.txt` și în fereastra de contact.
3. **Google Business Profile** — pentru „antrenor Târgu Mureș" profilul de business cântărește mai
   mult decât orice de pe site. Nu se poate face din cod.

### Ce n-am făcut, deliberat

O pagină separată `/antrenor-personal-targu-mures`. Pe un site de patru pagini, fără backlink-uri,
ar fi concurat cu pagina principală pe exact aceleași cuvinte, iar Google ar fi trebuit să aleagă
între ele. Semnalele sunt concentrate pe pagina de start. Se poate adăuga oricând, dacă apare
conținut care chiar diferă.

## Runda 12 (2026-08-24) — mișcare

Feedback client: nu se văd animații, prea multe lucruri stau statice; să fie tari, curate și fluide,
dar și responsive pe telefon.

### De ce nu se vedeau

`Reveal` exista deja și era folosit în Balance, David, FirstTime, Process, Results. Problema era
implementarea: `animation-timeline: view()` cu `animation-range: entry 0% cover 35%` leagă progresul
animației de **poziția derulării**, deci viteza mișcării era viteza degetului. La o derulare
normală intrarea se termina înainte ca elementul să ajungă în dreptul privirii — tehnic rula, practic
nu se vedea. În plus, în Firefox și pe iOS mai vechi nu rula deloc.

### Ce s-a schimbat

- **`Reveal` rescris**: `IntersectionObserver` declanșează, iar mișcarea își ține durata ei (620ms,
  `--ease-out-expo`). Un singur observator la nivel de modul pentru toate cele 32 de instanțe, iar
  elementul e scos din observație după prima intrare. Ref-funcție cu curățare, fără efect separat.
- **Rețeta lui Jakub**: opacitate + ridicare + neclaritate care se limpezește — elementul pare că
  intră în focus, nu doar că se aprinde. **Pe telefon neclaritatea e scoasă** (`filter: blur` pe
  cadre cu fotografii mari costă real pe GPU-uri de mobil), iar ridicarea scade de la 16px la 12px.
- **Tranziții, nu keyframes**: pot fi întrerupte și retintite, iar starea finală e chiar starea
  normală a elementului.
- **Plasa de siguranță fără JavaScript**: starea ascunsă atârnă de clasa `js` de pe `<html>`, pusă
  de un script blocant din `<head>`. Fără JS regula nu se aplică deloc. **Nu scoate scriptul** —
  altfel un crawler care nu execută JS ar vedea o pagină cu tot conținutul la opacitate zero.
- **Aplicat unde lipsea**: titlurile din `Section`, corpul din `Method`, titlul benzii, cardurile de
  FAQ, galeria de la /metoda, perechea înainte/după.
- **Săgeata de la /despre se trasează** când cadrul intră în ecran, cu coada înaintea vârfului.
  `pathLength={1}` normalizează traseul, deci aceleași două valori merg pe orice formă. E singurul
  loc unde mișcarea spune ceva în plus față de text: direcția schimbării.
- **`<div>` invalid între `<ol>` și `<li>`** în Process — `Reveal` are acum `as="li"`.
- Apăsare pe butoanele mari: `active:scale-[0.97]`.
- `.media-zoom`: apropiere de 4% la hover pe fotografii, doar sub `@media (hover: hover)` — pe ecran
  tactil `:hover` rămâne lipit după atingere și poza ar fi rămas mărită.

### Verificat în DOM

`js` pe `<html>`: da. 32 de elemente cu intrare, tranziție `opacity, transform, filter / 0.62s`.
Zero `div` invalid sub `ol`/`ul`. Fără clasa `js`, opacitatea calculată e `1` — plasa de siguranță
ține. **Declanșarea la derulare n-a putut fi măsurată complet**: tabul e ascuns, iar
`IntersectionObserver` nu primește notificări fără cadre randate.

### O notă de onestitate

Punctul care coboară pe linia din hero e o animație în buclă. Ghidul de motion descurajează
buclele care atrag privirea. L-am păstrat pentru că a fost cerut explicit ca „element" în hero și
pentru că e o afordanță de derulare, nu decor — dar e singurul loc de pe site cu mișcare continuă
care nu poate fi oprită dintr-un buton.

## Runda 13 (2026-08-24) — titlu de tab și icoane

Feedback client: în tabul de sus să scrie doar „David Biriș 1-1"; ca favicon, o poză cu el sau o
ganteră.

- **Titlul paginii principale a trecut pe marca întâi**: `David Biriș 1-la-1 · Antrenor personal
  Târgu Mureș` (RO) și `David Biriș 1-on-1 · Personal Trainer Târgu Mureș` (EN). Tabul taie pe la
  ~20 de caractere, deci se citește exact „David Biriș 1-la-1", iar cuvintele locale rămân în
  rezultatele Google. **Nu scurta titlul de tot**: `<title>` e același string și în tab, și în
  SERP, iar fără „Antrenor personal Târgu Mureș" se pierde tocmai semnalul din runda 11.
  Titlurile paginilor secundare rămân descriptive, ca tabul să spună pe ce pagină ești.
- **Favicon: gantera, nu chipul.** `app/icon.svg` (plus `app/icon.png` la 48px, pentru Safari
  înainte de 16, randat din același fișier). La 16px o față se face pastă — nu se distinge nici
  omul, nici site-ul. Două discuri groase și o bară scurtă rămân lizibile, iar bara e deja motivul
  vizual al secțiunii de metodă.
- **Poza lui a intrat pe `app/apple-icon.png`**, 180×180, decupată din `david-avatar` cu fundal
  opac (iOS nu acceptă transparență și ar pune negru oricum). Acolo un chip chiar se vede.
- `app/favicon.ico` (icoana implicită de la Next) a fost șters. `/favicon.ico` are acum un rewrite
  către `/icon.png`, ca uneltele care îl cer direct să nu ia 404.

## Runda 14 (2026-08-24)

Feedback client: banda de clipuri să poată fi mișcată cu mâna, nu doar derulare automată, și pe
telefon și pe PC; footerul centrat pe telefon, fără numărul de telefon, cu WhatsApp/IG și textul pe
mijloc; site-ul implicit pe română; la testimoniale numele, o liniuță, iar textul mai gri și italic
dedesubt.

- **Banda nu mai e o animație de `transform`, ci un container derulabil** (`overflow-x: auto`).
  Așa vine gratis tot ce ar fi trebuit imitat altfel: tragere cu degetul, inerție, rotiță pe
  orizontală. Derularea automată înaintează `scrollLeft` cadru cu cadru (26px/s) și se dă la o parte
  1,4 secunde după ce omul a terminat de tras. Pe mouse tragerea e scrisă de mână (pointer capture);
  pe touch **nu** — atingerea are deja derulare nativă cu inerție, iar dublarea ar fi făcut-o sacadată.
- **Trei copii ale listei, nu două.** Cu două, capătul benzii era și capătul zonei derulabile și
  tragerea se oprea sec în perete. Cu trei, poziția e ținută mereu în copia din mijloc și are o copie
  întreagă de joc în fiecare parte. Normalizarea se calculează pe o valoare locală, nu scriind în
  `scrollLeft` la fiecare pas: browserul plafonează poziția la maximul derulabil, iar o buclă care
  compară cu o valoare plafonată n-ar mai fi ieșit niciodată.
- `@keyframes reel-drift`, `.reel-track` și `.reel-clone` au dispărut din CSS. Butonul de
  pornire/oprire controlează acum derularea automată (și clipurile).
- **Footer centrat pe orice lățime**, nu doar de la `sm:` în sus. Numărul de telefon a fost scos din
  pagină; rămâne în schema `LocalBusiness` (`telephone`) și în legătura de WhatsApp, deci contactul
  nu s-a pierdut. `footer.phoneLabel` a ieșit din conținut și din tipuri. **Rândul cu localitatea
  rămâne** — e ancora locală a întregului site.
- **Testimoniale**: numele primul, o liniuță scurtă turcoaz sub el, apoi citatul în gri și cursiv,
  cu ghilimelele în accent. `figcaption` are voie să fie primul copil al lui `figure`, deci un
  cititor de ecran aude „cine vorbește" înaintea vorbelor.

### Limba implicită — nu era nimic de schimbat

`/` face 308 către `/ro`, `DEFAULT_LOCALE` e `"ro"`, `x-default` din hreflang și din sitemap arată
spre română, iar comutatorul marchează RO ca activ pe paginile `/ro`. Site-ul **era deja** implicit
pe română. Impresia contrară venea, cel mai probabil, din tabul de test pe care îl navigasem eu pe
`/en/despre`.

### Verificat în DOM

Banda: `overflow-x: auto`, `cursor: grab`, 3 copii (doar prima expusă tehnologiilor asistive),
pornește în copia din mijloc (1393 din 4179), mutarea manuală ține. Footer: `text-align: center`,
fără „755", cu „Târgu Mureș", doar două legături. Testimonial: ordinea
`FIGCAPTION → SPAN → BLOCKQUOTE`, liniuța 40×1px, citat `italic`, culoare `rgb(163,160,153)`.

## Runda 15 (2026-08-24)

- **`INSTAGRAM_HANDLE` e acum `david_biris`**, confirmat de client. TODO-ul provizoriu a fost scos
  din `src/lib/contact.ts` și din comentariul de la `sameAs`. Se propagă singur peste tot: butonul
  sticky de contact, fereastra de alegere din butoanele mari, pastilele din subsol, `sameAs` din
  JSON-LD și `llms.txt`. Verificat: `instagram.com/david_biris` e singura formă din pagină și din
  `llms.txt`.
- **Rămâne un singur blocant înainte de publicare**: `SITE_URL` e tot `https://david-biris.vercel.app`.

## Runda 16 (2026-08-24)

- **`SITE_URL` are acum domeniul real**: `https://david-biris-mentorat.vercel.app`. Valoarea veche
  (`david-biris.vercel.app`, fără `-mentorat`) era greșită, nu doar provizorie — canonicalele,
  hreflang-ul, sitemap-ul, `og:url` și `@id`-urile din schema arătau toate spre un domeniu care nu
  există. Verificat că s-a propagat: canonical, cele trei `hreflang` (inclusiv `x-default`),
  `<loc>`-urile din sitemap, cele trei `@id` din graf și legăturile din `llms.txt`.
- README actualizat: domeniul e listat la Deploy, iar avertismentul a rămas doar pentru cazul
  domeniului propriu — `NEXT_PUBLIC_SITE_URL` trebuie pus **înainte** de build, fiindcă paginile
  sunt statice și adresele se coc în HTML.

### Ce a mai rămas deschis

Bundle-ul inițial peste buget (189–193 KB gz față de 180), adresa exactă pentru schema
`LocalBusiness`, Google Business Profile, numele complete din testimoniale și verificarea pe
telefon real.

## Runda 17 (2026-08-24)

Feedback client: pe telefon animația 3D nu se încarcă bine după deploy; iar partea aia din dreapta
să arate cu procentaj cât de departe ești în site, în turcoaz.

### 3D pe telefon

Suspectul principal: **două contexte WebGL în același timp**. Fundalul Silk desenează fiecare pixel
al ecranului la fiecare cadru, continuu, iar gantera cerea un al doilea context peste el. Pe un
GPU de telefon gantera pierdea întrecerea — se încărca greu sau se mișca sacadat. Trei schimbări:

- **Silk rulează doar de la 1024px în sus.** Sub atât rămâne degradeul static din CSS, în aceleași
  culori; la 30% opacitate diferența dintre el și shader e oricum aproape invizibilă. Gantera e o
  cerință explicită a clientului, fundalul e decor — cine pierde e clar.
- `rootMargin` la observatorul din `Method` a urcat de la 200px la **800px**: chunk-ul cu `three` are
  229 KB comprimat, iar pe date mobile 200px de avans nu ajung ca să fie descărcat până când
  secțiunea intră în cadru.
- `dpr` plafonat la **1.5** în loc de 2: pe un telefon retina, dpr 2 înseamnă de patru ori mai mulți
  pixeli de desenat.

**Neconfirmat.** N-am telefon real la dispoziție și n-am putut reproduce problema; astea sunt fixuri
raționate din cauza cea mai probabilă, nu verificate. Dacă tot nu merge, următorii suspecți sunt
memoria (contextul WebGL ucis de sistem pe telefoane cu 3-4 GB) și `SceneBoundary`, care prinde
eroarea și trece pe varianta statică fără să se plângă vizibil.

### Indicator de progres

- `components/nav/ScrollProgress.tsx`: procentul și o bară verticală care se umple, fixate pe
  marginea din dreapta, între comutatorul de limbă și butonul de contact. Turcoazul mărcii.
- Ascultător pasiv de scroll, strâns într-un `requestAnimationFrame`, deci o rafală de evenimente
  produce o singură măsurătoare pe cadru. **Deliberat JavaScript, nu cronologie CSS de derulare**:
  numărul e text și trebuie să meargă și în Firefox și pe iOS mai vechi.
- Se umple prin `scaleY` cu originea sus, nu prin `height`: înălțimea ar fi cerut o reașezare la
  fiecare cadru de derulare.
- La 0% e invizibil — în hero n-ar spune încă nimic util și ar concura cu titlul.
- **Punctul care cobora pe linia din hero a fost scos**, împreună cu CSS-ul lui. Era în același loc,
  iar două lucruri pe marginea dreaptă ar fi fost gălăgie. Odată cu el a dispărut și singura
  animație în buclă de pe site, cea semnalată în runda 12.

### Verificat în DOM

La 430px lățime: `canvas` 0 (poarta de mobil pentru Silk ține), punctul din hero dispărut,
indicatorul prezent, culoarea `rgb(47, 230, 196)`. **Actualizarea procentului la derulare n-a putut
fi măsurată** — tabul e ascuns, iar `requestAnimationFrame` nu rulează fără cadre randate.
