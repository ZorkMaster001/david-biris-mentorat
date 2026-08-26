"use client";

import { useEffect, useRef } from "react";
import type { Pillar } from "@/content/types";

interface PillarListProps {
  pillars: Pillar[];
  onVisibleCountChange: (count: number) => void;
  /**
   * Nivelul titlului sectiunii care contine lista. Pilonii se aseaza cu un nivel
   * sub el.
   *
   * Erau fixati pe `h3`. In pagina principala mergea — titlul sectiunii e `h2` —
   * dar pe /metoda titlul sectiunii e chiar `h1`-ul paginii, deci se sarea de la
   * h1 direct la h3. O treapta lipsa rupe schita paginii pentru cititoarele de
   * ecran si pentru orice unealta care deduce ierarhia din headinguri.
   */
  headingLevel?: "h1" | "h2";
}

/*
  Doua linii, nu una. Discul se monteaza cand varful pilonului urca peste 65% din
  ecran, dar cade de pe bara abia cand pilonul a coborat inapoi sub 96%, adica
  aproape de tot afara. Cu o singura linie, cei cativa pixeli de scroll invers pe
  care ii face oricine ca sa reciteasca o fraza goleau bara pe loc. Distanta dintre
  cele doua e ce face intoarcerea calma.
*/
const MOUNT_MARGIN = "0px 0px -35% 0px";
const UNMOUNT_MARGIN = "0px 0px -4% 0px";

function indexOf(entry: IntersectionObserverEntry): number {
  return Number((entry.target as HTMLElement).dataset.index ?? "0");
}

export function PillarList({
  pillars,
  onVisibleCountChange,
  headingLevel = "h2",
}: PillarListProps) {
  const Heading = headingLevel === "h1" ? "h2" : "h3";
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const passed = useRef(new Set<number>());
  const reported = useRef(-1);

  useEffect(() => {
    function report() {
      const count = passed.current.size === 0 ? 0 : Math.max(...passed.current) + 1;
      if (count !== reported.current) {
        reported.current = count;
        onVisibleCountChange(count);
      }
    }

    // `isIntersecting` nu e de ajuns nicaieri aici: un pilon iesit pe sus e tot
    // „trecut", dar nu mai intersecteaza. Comparam de fiecare data varful lui cu
    // marginea de jos a root-ului, deja scurtat de `rootMargin`.
    const mount = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const line = entry.rootBounds?.bottom ?? window.innerHeight * 0.65;
          if (entry.boundingClientRect.top <= line) passed.current.add(indexOf(entry));
        }
        report();
      },
      { rootMargin: MOUNT_MARGIN },
    );

    const unmount = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const line = entry.rootBounds?.bottom ?? window.innerHeight * 0.96;
          if (entry.boundingClientRect.top > line) passed.current.delete(indexOf(entry));
        }
        report();
      },
      { rootMargin: UNMOUNT_MARGIN },
    );

    for (const item of items.current) {
      if (!item) continue;
      mount.observe(item);
      unmount.observe(item);
    }
    return () => {
      mount.disconnect();
      unmount.disconnect();
    };
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
          {/*
            Numarul se calculeaza din pozitie, nu se scrie in continut: e deja implicit
            in ordinea listei, iar un camp separat s-ar fi putut desincroniza la prima
            reordonare. `aria-hidden` fiindca „01" citit cu voce tare nu adauga nimic
            peste titlul care urmeaza.
          */}
          <span
            aria-hidden="true"
            className="font-display text-sm tracking-[0.2em] text-signal"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <Heading className="mt-2 font-display text-2xl">{pillar.name}</Heading>
          <p className="mt-2 max-w-[44ch] text-bone-dim">{pillar.angle}</p>
        </li>
      ))}
    </ol>
  );
}
