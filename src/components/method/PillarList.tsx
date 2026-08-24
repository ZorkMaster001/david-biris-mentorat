"use client";

import { useEffect, useRef } from "react";
import type { Pillar } from "@/content/types";

interface PillarListProps {
  pillars: Pillar[];
  onVisibleCountChange: (count: number) => void;
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

export function PillarList({ pillars, onVisibleCountChange }: PillarListProps) {
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
          <h3 className="font-display text-2xl">{pillar.name}</h3>
          <p className="mt-2 max-w-[44ch] text-bone-dim">{pillar.angle}</p>
        </li>
      ))}
    </ol>
  );
}
