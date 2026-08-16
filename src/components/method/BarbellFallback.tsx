import type { Pillar } from "@/content/types";

/**
 * Varianta statica a scenei 3D. Se afiseaza cand WebGL lipseste, cand device-ul
 * e slab, la reduced motion, sau daca scena crapa. Trebuie sa arate intentionat,
 * nu a esec — de aceea e desenata, nu doar ascunsa.
 */
export function BarbellFallback({ pillars }: { pillars: Pillar[] }) {
  return (
    <div className="relative flex h-full min-h-[300px] w-full items-center justify-center">
      <div className="relative h-[3px] w-full max-w-[520px] rounded-full bg-bone/40">
        {pillars.map((pillar, index) => {
          const side = index % 2 === 0 ? 1 : -1;
          const slot = Math.floor(index / 2);
          const offset = 14 + slot * 11;
          return (
            <span
              key={pillar.id}
              aria-hidden="true"
              className="absolute top-1/2 h-16 w-[10px] -translate-y-1/2 rounded-[3px] bg-ink-raised ring-1 ring-ember/50"
              style={{ left: `calc(50% + ${side * offset}% - 5px)` }}
            />
          );
        })}
      </div>
    </div>
  );
}
