"use client";

import { ArrowsLeftRight } from "@phosphor-icons/react/dist/ssr";
import Image, { type StaticImageData } from "next/image";
import { useId, useState } from "react";
import birisjrAfter from "@/media/testimonials/birisjr-after.avif";
import birisjrBefore from "@/media/testimonials/birisjr-before.avif";
import dariusAfter from "@/media/testimonials/darius-after.avif";
import dariusBefore from "@/media/testimonials/darius-before.avif";
import merilAfter from "@/media/testimonials/meril-after.avif";
import merilBefore from "@/media/testimonials/meril-before.avif";
import type { Testimonial } from "@/content/types";

/**
 * Fotografiile stau aici, nu in continut, si sunt importate, nu cerute de la o adresa.
 * Doua motive, in ordine:
 *
 * Sunt pozele unor oameni care ni le-au dat pe incredere. Din `public` ar fi ajuns la
 * `/media/img/darius-before.avif` — adresa curata, de ghicit dintr-o incercare si de
 * enumerat pentru celelalte. Importate, trec prin bundler si ies sub o amprenta, deci
 * nu se ajunge la ele decat de pe pagina. Publice raman, ca orice imagine dintr-o
 * pagina publica; ce dispare e adresa comoda.
 *
 * Si nu sunt text. Nu se traduc, deci n-au ce cauta intr-un fisier care se traduce —
 * acelasi motiv pentru care pictogramele stau in `sections/Offer`. Cheia e `id`-ul
 * testimonialului; textul alternativ ramane in continut, ala chiar se traduce.
 *
 * Un `id` nou fara pereche aici ramane fara fotografii, deci cadrul iese gol.
 */
const PHOTOS: Record<string, { before: StaticImageData; after: StaticImageData }> = {
  darius: { before: dariusBefore, after: dariusAfter },
  meril: { before: merilBefore, after: merilAfter },
  birisjr: { before: birisjrBefore, after: birisjrAfter },
};

interface BeforeAfterProps {
  testimonial: Testimonial;
  beforeLabel: string;
  afterLabel: string;
  quoteOpen: string;
  quoteClose: string;
}

export function BeforeAfter({
  testimonial,
  beforeLabel,
  afterLabel,
  quoteOpen,
  quoteClose,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const sliderId = useId();
  const photos = PHOTOS[testimonial.id];

  return (
    <div>
      {/*
        Fotografiile sunt 9:16 si diferenta dintre inainte si dupa se vede doar daca
        au loc sa fie mari. Pe telefon cadrul merge pe toata latimea (plafonul de
        46svh e mai lat decat aproape orice telefon), iar pe ecrane mari se opreste
        la 40svh si ramane centrat in coloana, ca sa nu ajunga cat pagina.
      */}
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[46svh] overflow-hidden sm:max-w-[40svh] rounded-2xl bg-ink-raised has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-signal">
        {photos ? (
          <>
            <Image
              src={photos.after}
              alt={testimonial.afterAlt}
              fill
              sizes="(min-width: 640px) 480px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
              <Image
                src={photos.before}
                alt={testimonial.beforeAlt}
                fill
                sizes="(min-width: 640px) 480px, 100vw"
                className="object-cover"
              />
            </div>
          </>
        ) : null}

        {/*
          Manerul face vizibil ca imaginea se trage. Fara el, controlul exista dar
          nu se vede — pe telefon nimeni nu ghiceste ca poate glisa.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -ml-px w-0.5 bg-bone shadow-[0_0_16px_rgba(10,10,11,0.7)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/70 bg-ink/55 text-bone backdrop-blur-sm">
            <ArrowsLeftRight size={20} weight="bold" />
          </span>
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
          {beforeLabel}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
          {afterLabel}
        </span>

        <label htmlFor={sliderId} className="sr-only">
          {`${beforeLabel} / ${afterLabel}`}
        </label>
        {/*
          Controlul e un input range real, transparent, intins peste imagine: drag cu
          degetul, drag cu mouse-ul si sagetile de la tastatura merg toate, fara o
          singura linie de cod de accesibilitate scrisa manual.
        */}
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

      {/*
        Numele vine primul si poarta accentul, sub el o liniuta scurta, apoi citatul
        in gri si cursiv. `figcaption` are voie sa fie primul copil al lui `figure`,
        deci ordinea vizuala si cea din DOM raman aceeasi — un cititor de ecran aude
        tot „cine vorbeste" inaintea vorbelor.
      */}
      <figure className="mt-6">
        <figcaption className="font-display text-base tracking-[0.08em] text-signal">
          {testimonial.name}
        </figcaption>
        <span aria-hidden="true" className="mt-3 block h-px w-10 bg-signal/50" />
        {/*
          Ghilimelele apar doar cand textul chiar e al omului. Cand vorbeste David
          despre el, dispar si sub text ramane cine a spus-o: altfel randul de sub un
          nume s-ar citi ca vorbele lui, adica exact un testimonial inventat. Si nu mai
          e `blockquote`, fiindca nu se mai citeaza persoana din titlu.
        */}
        {testimonial.attribution ? (
          <>
            <p className="mt-4 text-lg leading-relaxed text-bone-dim">{testimonial.quote}</p>
            <p className="mt-3 font-display text-xs tracking-[0.2em] text-bone-dim">
              — {testimonial.attribution}
            </p>
          </>
        ) : (
          <blockquote className="mt-4 text-lg italic leading-relaxed text-bone-dim">
            <span className="not-italic text-signal/50">{quoteOpen}</span>
            {testimonial.quote}
            <span className="not-italic text-signal/50">{quoteClose}</span>
          </blockquote>
        )}
      </figure>
      {testimonial.note ? (
        <p className="mt-4 border-l-2 border-signal pl-4 font-display text-xl text-bone">
          {testimonial.note}
        </p>
      ) : null}
    </div>
  );
}
