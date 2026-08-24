"use client";

import { ArrowsLeftRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useId, useState } from "react";
import type { Testimonial } from "@/content/types";

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

  return (
    <div>
      {/*
        Fotografiile sunt 9:16 si diferenta dintre inainte si dupa se vede doar daca
        au loc sa fie mari. Pe telefon cadrul merge pe toata latimea (plafonul de
        46svh e mai lat decat aproape orice telefon), iar pe ecrane mari se opreste
        la 40svh si ramane centrat in coloana, ca sa nu ajunga cat pagina.
      */}
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[46svh] overflow-hidden sm:max-w-[40svh] rounded-2xl bg-ink-raised has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-signal">
        <Image
          src={`/media/img/${testimonial.afterSrc}.avif`}
          alt={testimonial.afterAlt}
          fill
          sizes="(min-width: 640px) 480px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src={`/media/img/${testimonial.beforeSrc}.avif`}
            alt={testimonial.beforeAlt}
            fill
            sizes="(min-width: 640px) 480px, 100vw"
            className="object-cover"
          />
        </div>

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
        <blockquote className="mt-4 text-lg italic leading-relaxed text-bone-dim">
          <span className="not-italic text-signal/50">{quoteOpen}</span>
          {testimonial.quote}
          <span className="not-italic text-signal/50">{quoteClose}</span>
        </blockquote>
      </figure>
      {testimonial.note ? (
        <p className="mt-4 border-l-2 border-signal pl-4 font-display text-xl text-bone">
          {testimonial.note}
        </p>
      ) : null}
    </div>
  );
}
