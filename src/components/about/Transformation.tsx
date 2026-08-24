import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { Content } from "@/content/types";

interface TransformationProps {
  data: Content["david"]["transformation"];
  beforeLabel: string;
  afterLabel: string;
}

const SIZES = "(min-width: 640px) 45vw, 100vw";

/**
 * Sageata desenata cu mana, nu o iconita: doua treceri peste acelasi traseu, a doua
 * putin decalata si mai stinsa, ca la un creion care nu nimereste linia din prima.
 * Pe telefon coloanele se aseaza una sub alta, deci sageata se roteste in jos.
 */
function DrawnArrow() {
  return (
    // `pathLength={1}` normalizeaza lungimea fiecarui traseu, deci aceleasi doua
    // valori de `stroke-dash*` traseaza si coada, si varful. Vezi `.drawn-arrow`.
    <svg
      viewBox="0 0 140 64"
      aria-hidden="true"
      className="drawn-arrow h-12 w-28 rotate-90 text-signal sm:h-16 sm:w-20 sm:rotate-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g opacity={0.35} transform="translate(2.5 2)">
        <path pathLength={1} d="M8 46c14-16 34-26 58-27 16-1 32 4 44 14" />
        <path pathLength={1} className="arrow-head" d="M95 20l15 13-17 8" />
      </g>
      <path pathLength={1} d="M8 46c14-16 34-26 58-27 16-1 32 4 44 14" />
      <path pathLength={1} className="arrow-head" d="M95 20l15 13-17 8" />
    </svg>
  );
}

function Shot({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <figure className="media-zoom relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink-raised">
      <Image src={`/media/img/${src}.avif`} alt={alt} fill sizes={SIZES} className="object-cover" />
      <figcaption className="absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
        {label}
      </figcaption>
    </figure>
  );
}

/**
 * Transformarea lui David: doua fotografii si o sageata intre ele. Fara slider —
 * pozele nu sunt facute din acelasi unghi, deci o linie care le taie ar fi aratat
 * a montaj, nu a progres.
 */
export function Transformation({ data, beforeLabel, afterLabel }: TransformationProps) {
  return (
    <div>
      <h2 className="font-display text-[clamp(1.75rem,5vw,3rem)] max-w-[18ch]">{data.headline}</h2>
      {/*
        Cele trei intra in ordinea in care se citesc: intai „inainte", apoi sageata
        se traseaza, apoi „dupa". Miscarea spune aici ceva ce textul nu spune —
        directia schimbarii — deci merita.
      */}
      <div className="mt-8 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
        <Reveal>
          <Shot src={data.beforeSrc} alt={data.beforeAlt} label={beforeLabel} />
        </Reveal>
        <Reveal delay={140} className="justify-self-center">
          <DrawnArrow />
        </Reveal>
        <Reveal delay={900}>
          <Shot src={data.afterSrc} alt={data.afterAlt} label={afterLabel} />
        </Reveal>
      </div>
    </div>
  );
}
