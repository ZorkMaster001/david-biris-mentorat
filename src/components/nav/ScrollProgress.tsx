"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Sub atat degetul mare nu mai are ce apuca, oricat de lunga ar fi pagina. */
const MIN_THUMB_PERCENT = 8;

interface Progress {
  /** Cat din pagina a fost parcurs, 0 la 100. */
  percent: number;
  /** Inaltimea manerului ca procent din pista, adica cat din continut incape pe ecran. */
  thumb: number;
}

/**
 * Bara de derulare a site-ului. Inlocuieste bara nativa, care e ascunsa in
 * `globals.css`, deci trebuie sa faca tot ce facea si aceea: sa arate unde esti, cat
 * din pagina vezi si sa poata fi trasa cu mouse-ul. In plus arata si procentul.
 *
 * Manerul isi schimba inaltimea dupa cat din continut incape pe ecran, exact ca o
 * bara adevarata: pe o pagina scurta e aproape cat pista, pe una lunga e scurt.
 *
 * Pe atingere tragerea e ignorata anume. Manerul are cativa pixeli latime, iar pe
 * telefon pagina se trage oricum direct cu degetul; a prinde acolo evenimentele ar fi
 * insemnat sa fure gesturi de derulare de la marginea ecranului.
 *
 * Masuratoarea sta intr-un `requestAnimationFrame`, deci o rafala de evenimente de
 * derulare produce o singura citire pe cadru. Deliberat JavaScript, nu o cronologie
 * CSS de derulare: procentul e text, si trebuie sa mearga si in Firefox si pe iOS mai
 * vechi, unde `animation-timeline` nu exista.
 */
export function ScrollProgress() {
  const [{ percent, thumb }, setProgress] = useState<Progress>({ percent: 0, thumb: 100 });
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const dragging = useRef(false);
  // Citit din handler-ul de tragere, care traieste in afara randarii.
  const thumbRef = useRef(100);
  useEffect(() => {
    thumbRef.current = thumb;
  }, [thumb]);

  useEffect(() => {
    const measure = () => {
      frame.current = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      setProgress({
        percent: Math.round(Math.min(Math.max(ratio, 0), 1) * 100),
        thumb: Math.max(MIN_THUMB_PERCENT, (window.innerHeight / doc.scrollHeight) * 100),
      });
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

  /** Duce pagina acolo unde a fost apucata pista, socotind si inaltimea manerului. */
  const scrollToPointer = useCallback((clientY: number) => {
    const track = trackRef.current;
    if (!track) return;
    const box = track.getBoundingClientRect();
    const thumbHeight = box.height * (thumbRef.current / 100);
    const usable = Math.max(box.height - thumbHeight, 1);
    const ratio = (clientY - box.top - thumbHeight / 2) / usable;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: Math.min(Math.max(ratio, 0), 1) * scrollable });
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch") return;
      dragging.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      scrollToPointer(event.clientY);
    },
    [scrollToPointer],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      scrollToPointer(event.clientY);
    },
    [scrollToPointer],
  );

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  return (
    <div
      /*
        Ascuns de tehnologiile asistive: tot ce face e disponibil oricum din derularea
        obisnuita si de la tastatura. Nu e focusabil, deci nu ascunde niciun control.
      */
      aria-hidden="true"
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      /*
        Pista incepe sub comutatorul de limba si se opreste deasupra barei de jos, ca
        manerul si numarul sa nu ajunga niciodata peste ele. Zona de prindere e mai
        lata decat linia care se vede.
      */
      // Fara `touch-action: none`: pe telefon fasia asta de la marginea din dreapta
      // trebuie sa lase pagina sa se deruleze normal cu degetul.
      className="fixed right-0 top-24 z-40 w-4 cursor-pointer"
      style={{ bottom: "calc(var(--spacing-nav) + env(safe-area-inset-bottom) + 5rem)" }}
    >
      <div className="absolute inset-y-0 right-1.5 w-px bg-bone/15" />

      <div
        className="absolute right-1 w-[3px] rounded-full bg-signal transition-[height] duration-150 ease-[var(--ease-out-expo)]"
        style={{
          height: `${thumb}%`,
          // Pozitia se masoara pe spatiul ramas dupa ce se scade manerul, altfel la
          // 100% ar iesi cu propria inaltime sub capatul pistei.
          top: `${(percent / 100) * (100 - thumb)}%`,
        }}
      >
        {/* Numarul calatoreste cu manerul, ca sa arate mereu la ce inaltime esti. */}
        <span className="absolute right-4 top-0 font-display text-[10px] tabular-nums leading-none tracking-[0.06em] text-signal">
          {percent}%
        </span>
      </div>
    </div>
  );
}
