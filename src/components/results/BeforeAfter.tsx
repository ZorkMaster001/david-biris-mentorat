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
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-ink-raised">
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

        <div aria-hidden="true" className="absolute inset-y-0 w-[2px] bg-bone" style={{ left: `${position}%` }} />

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

      <figure className="mt-6">
        <blockquote className="text-lg leading-relaxed">{testimonial.quote}</blockquote>
        <figcaption className="mt-3 text-sm uppercase tracking-wider text-bone-dim">
          {testimonial.name}
        </figcaption>
      </figure>
      {testimonial.note ? <p className="mt-4 font-display text-xl text-ember">{testimonial.note}</p> : null}
    </div>
  );
}
