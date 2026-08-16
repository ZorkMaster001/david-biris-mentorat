"use client";

import { useEffect, useRef } from "react";
import type { Pillar } from "@/content/types";

interface PillarListProps {
  pillars: Pillar[];
  onVisibleCountChange: (count: number) => void;
}

export function PillarList({ pillars, onVisibleCountChange }: PillarListProps) {
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const seen = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index ?? "0");
          // Contorul creste monoton: un disc care sare de pe bara la scroll invers
          // ar arata a bug, nu a efect.
          if (index + 1 > seen.current) {
            seen.current = index + 1;
            onVisibleCountChange(seen.current);
          }
        }
      },
      { rootMargin: "0px 0px -35% 0px" },
    );

    for (const item of items.current) if (item) observer.observe(item);
    return () => observer.disconnect();
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
