"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cat de departe ai ajuns in pagina: un procent si o bara verticala care se umple,
 * fixate pe marginea din dreapta, intre comutatorul de limba si butonul de contact.
 *
 * Ascultatorul de derulare e pasiv si strans intr-un `requestAnimationFrame`, deci
 * o rafala de evenimente de scroll produce o singura masuratoare pe cadru. Alegerea
 * asta, in locul unei cronologii CSS de derulare, e deliberata: numarul e text si
 * trebuie sa functioneze si in Firefox si pe iOS mai vechi, unde `animation-timeline`
 * nu exista.
 *
 * Pe pozitia zero nu se arata nimic: in hero indicatorul n-ar spune inca nimic util
 * si ar concura cu titlul.
 */
export function ScrollProgress() {
  const [percent, setPercent] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const measure = () => {
      frame.current = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // Pagina mai scurta decat ecranul nu are ce progres sa arate.
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      setPercent(Math.round(Math.min(Math.max(ratio, 0), 1) * 100));
    };

    const schedule = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      // Decorativ: cine foloseste un cititor de ecran are deja pozitia din structura
      // paginii, iar un numar care se schimba la fiecare cadru ar fi doar zgomot.
      aria-hidden="true"
      className={`pointer-events-none fixed right-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-3 transition-opacity duration-300 ease-[var(--ease-out-expo)] ${
        percent > 0 ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="font-display text-[11px] tracking-[0.08em] text-signal tabular-nums">
        {percent}%
      </span>
      <span className="relative block h-24 w-px overflow-hidden bg-bone/20">
        {/*
          Se umple prin `scaleY`, cu originea sus, nu prin `height`: inaltimea ar fi
          cerut o reasezare la fiecare cadru de derulare, scala nu cere nimic.
        */}
        <span
          className="absolute inset-0 origin-top bg-signal"
          style={{ transform: `scaleY(${percent / 100})` }}
        />
      </span>
    </div>
  );
}
