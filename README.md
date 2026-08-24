# David Biriș — 1-on-1 Fitness Mentoring

A bilingual, fully static marketing site for an online 1-on-1 fitness mentor, working from
Târgu Mureș, Romania. It sells the lifestyle — a physique you're proud of without giving up
the rest of your life — and the mentoring is the method that gets you there.

No backend, no database, no forms. Every call to action lands in WhatsApp or Instagram,
because that is where the conversation actually happens. The whole site is prerendered at
build time and served as HTML.

Built mobile-first: navigation sits at the bottom like an app, contact is one thumb-reach
away, and every heavy feature degrades to something static when the device cannot afford it.

```
Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · three.js · Vitest
```

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /ro
```

Node 22 or newer.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (18 prerendered routes) |
| `npm run typecheck` | `next typegen` then `tsc --noEmit` |
| `npm test` | Vitest — 31 tests over the pure modules |
| `npm run lint` | ESLint, including the React Compiler rules |
| `npm run media` | Re-encode raw media into `public/media/` (see below) |

---

## How it is put together

Five decisions shape almost everything else in this codebase.

### 1. One content source, two languages, enforced parity

Not a single user-facing string lives inside a component. Everything is typed and comes
from `src/content/{ro,en}.ts`, shaped by `Content` in `types.ts`.

A test compares the **ordered key paths** of both locales, so a field added to one language
and forgotten in the other fails CI rather than shipping as a blank. Another test rejects
empty strings, and a third pins the route slugs so that `/en/metoda` stays `metoda` — the
URLs are Romanian in both locales on purpose, so a shared link never 404s across a language
switch.

Adding a field means touching three files, in the same position, every time. That is the
cost of never having to hunt for hardcoded copy.

### 2. Capabilities decide what runs, not screen size

`src/lib/device.ts` is the single gate for anything expensive. Two pure predicates —
`shouldPlayVideo()` and `shouldRender3D()` — read reduced-motion, save-data, effective
connection type, hardware concurrency and WebGL support, and every heavy feature asks
before starting.

Both start conservative and only relax after `detect()` confirms. A 3D frame that renders
and then stops is harmless; a network request fired on a metered connection cannot be taken
back.

Each gated feature ships a real fallback that looks intentional, not broken: the 3D barbell
becomes a drawn diagram, the video tiles stay on their posters, the animated background
becomes a matching CSS gradient.

### 3. Motion is layered on top of content that already works

Every animation is decoration over something readable and complete when it is switched off.

- Scroll reveals are triggered by one shared `IntersectionObserver` and then run on a fixed
  duration. They are **not** scrubbed by scroll position — tying progress to scroll speed
  means a normal flick finishes the animation before the element reaches the eye.
- The pre-reveal hidden state hangs off a `js` class set by a blocking inline script. Without
  JavaScript the rule never applies, so a crawler never sees a page of invisible text.
- The hero dissolves as it leaves, driven by a named `view-timeline` scoped to the section,
  so the effect is tied to the element rather than to an absolute scroll offset.
- Everything sits behind `prefers-reduced-motion`, and transitions are preferred over
  keyframes wherever a user can re-trigger them.

### 4. The clip marquee is a scroll container, not an animation

The band of videos is a real `overflow-x` container. Touch drag, momentum, horizontal wheel
and pointer drag all come from the browser. A `requestAnimationFrame` loop nudges
`scrollLeft` for the slow automatic drift and steps aside for 1.4 s whenever a person takes
over.

Three identical copies of the list, not two, with the position kept in the middle one: with
two copies the end of the band is also the end of the scrollable area, and a drag stops dead
against a wall. Each copy is measured after mount and the list repeats until one copy is at
least as wide as the viewport.

### 5. The schema only claims what is true

The mentoring is **online only**. Titles and descriptions are therefore built around the
service, not around the city, and the city survives in exactly two places with one precise
meaning: the `address` in the schema and one visible line in the footer, both saying where
David works *from* — not where clients go. `areaServed` is the country on both the business
and the service, so nothing in the markup implies in-person sessions.

`JsonLd` emits one `@graph` per page linking `Person` → `LocalBusiness` → `Service` by
`@id`, plus `FAQPage` on the home page. The business address carries locality and county
only. Street address, coordinates, opening hours and price are **deliberately absent** —
see the `TODO(client)` in `src/lib/business.ts`. An approximate address is worse than a
missing one, and a precise one would be worse still when no client ever visits it.

`/llms.txt` is generated from the same content module as the pages, so it cannot drift out
of date. AI search crawlers are allowed in `robots.ts`; only the training-only crawler is not.

---

## Project structure

```
src/
├─ app/
│  ├─ [locale]/            root layout lives here, so <html lang> is per-locale
│  │  ├─ layout.tsx        fonts, background, nav, JSON-LD graph
│  │  ├─ page.tsx          home
│  │  ├─ despre/           about
│  │  ├─ metoda/           method
│  │  ├─ rezultate/        results
│  │  └─ opengraph-image.tsx
│  ├─ llms.txt/route.ts    generated from the content module
│  ├─ icon.svg · icon.png · apple-icon.png
│  ├─ robots.ts · sitemap.ts
│  └─ globals.css          palette, motion, everything Tailwind cannot express
├─ components/
│  ├─ about/               before → after pair with a drawn arrow
│  ├─ bg/                  Silk WebGL background + its gate
│  ├─ contact/             CTA that opens the WhatsApp / Instagram picker
│  ├─ hero/ · reel/ · results/ · method/ · sections/
│  ├─ nav/                 bottom nav, back button, locale switch, footer
│  ├─ seo/                 JSON-LD
│  └─ ui/                  Section, CtaButton, Reveal, shared styles
├─ content/                ro.ts · en.ts · types.ts · parity tests
└─ lib/                    device · contact · business · site · fonts
```

`/` issues a permanent redirect to `/ro` from `next.config.ts` rather than rendering a page,
which is what lets the root layout sit under `[locale]` and carry the correct `lang`.

---

## Media pipeline

`npm run media` does **not** run at build time. It needs `ffmpeg` on your PATH and the raw
source folders `assets/`, `testimonial_darius/`, `testimonial_meril/`, all git-ignored.

It encodes six clips to WebM and MP4, and 21 images to AVIF and WebP, with crop boxes
measured per image rather than guessed. `public/media/` is committed, so a clone builds and
deploys without any of the raw material.

`--only=<name>` rebuilds a single output — `npm run media -- --only=david-gym`. Without it,
adding one photograph re-encodes all six clips, which means ffmpeg on PATH and every raw
source folder present, for a file that has nothing to do with them.

---

## Performance

Measured on a production build, gzipped.

| Metric | Budget | Measured |
| --- | --- | --- |
| Initial JS, per page | < 180 KB gz | **189–193 KB gz** |
| Lazy 3D chunk (`three` + fiber) | < 240 KB gz | 229 KB gz |
| CSS | — | 8 KB gz |

The initial bundle currently sits **just over budget**. The overage arrived with the client
components added late: the WebGL background gate, the contact dialog, the interactive
marquee and the reveal observer. It is worth a pass before launch; the 3D chunk is fine and
is guarded three times over — browser only, in-view only, and only when `shouldRender3D()`
agrees.

---

## Content rules

Client decisions, not style preferences. Do not relax them without asking:

- No client counts, no statistics
- No promises of kilograms lost or of a timeline
- Nothing that implies David is a doctor or a licensed nutritionist
- The footer disclaimer stays, in both languages
- **No em dashes in visible copy.** The client reads them as a tell that a machine wrote the
  text. Rewrite the sentence around a full stop or a comma, rather than swapping the character.
  This covers `src/content/*` and the prose in `/llms.txt`; code comments are exempt

## Code conventions

- Code comments and `docs/` are written in Romanian, without diacritics. Keep it.
- Comments explain **why**, not what. If a line looks strange, the comment says what broke
  when it was written the obvious way.
- `docs/PROGRES.md` is the running log of every client round and the reasoning behind each
  change. Read it before picking the work back up.

---

## Deploy

Vercel — live at **https://david-biris-mentorat.vercel.app**

Canonicals, hreflang, the sitemap, `og:url` and every `@id` in the structured data derive
from `SITE_URL` in `src/lib/site.ts`, which falls back to that domain.

> When a custom domain arrives, set `NEXT_PUBLIC_SITE_URL` **before** the build. The pages
> are statically generated, so the URLs are baked into the HTML — setting it afterwards
> changes nothing until the next deploy.

## Open items

- [ ] Trim the initial JS bundle back under 180 KB gz
- [ ] Street address, coordinates, opening hours and price range for the `LocalBusiness`
      schema (`src/lib/business.ts`)
- [ ] Hero photograph: still the mountain ridge, which sells the lifestyle but not the
      physique. A gym shot or a portrait would match the new positioning — client's call
- [ ] Confirm Darius's surname initial and Meril's full name
- [ ] Real-device pass: iPhone safe areas, video autoplay, the 3D scene on Android, and a
      full keyboard run-through
