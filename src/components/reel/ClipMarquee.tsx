"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReelClip } from "@/content/types";
import { shouldPlayVideo, useDeviceCapabilities } from "@/lib/device";
import { ClipTile } from "./ClipTile";

interface ClipMarqueeProps {
  clips: ReelClip[];
  pauseLabel: string;
  resumeLabel: string;
}

/** Trei copii ale listei: una vizibila, una de rezerva in fiecare parte. */
const COPIES = 3;
/**
 * Viteza derularii automate, in pixeli pe secunda. La 26 un patratel isi facea
 * propria latime in 11 secunde, ceea ce nu se citea ca miscare, ci ca banda blocata.
 */
const DRIFT_PER_SECOND = 60;
/** Cat sta derularea automata dupa ce omul a terminat de tras. */
const RESUME_AFTER_MS = 1400;

/**
 * Banda cu clipuri. Se misca singura incet spre dreapta, dar poate fi si trasa cu
 * degetul sau cu mouse-ul, ca sa ajungi mai repede la clipul pe care vrei sa-l vezi.
 *
 * Derularea nu mai e o animatie de `transform`, ci chiar derularea unui container cu
 * `overflow-x`. Asta aduce gratis inertia de pe telefon, tragerea cu degetul si
 * rotita pe orizontala; o animatie de transform ar fi trebuit sa le imite pe toate,
 * prost. Derularea automata inainteaza `scrollLeft` cadru cu cadru si se da la o
 * parte cat timp omul conduce.
 *
 * Bucla fara cusatura are nevoie de trei copii, nu de doua: cu doua, capatul benzii
 * ar fi fost si capatul zonei derulabile, iar tragerea s-ar fi oprit sec in perete.
 * Cu trei, pozitia e tinuta mereu in copia din mijloc si are o copie intreaga de joc
 * in fiecare parte. Copia trebuie sa fie cel putin cat ecranul, de aceea lista se
 * repeta de cate ori e nevoie, masurat dupa montare.
 */
export function ClipMarquee({ clips, pauseLabel, resumeLabel }: ClipMarqueeProps) {
  const capabilities = useDeviceCapabilities();
  const playVideo = shouldPlayVideo(capabilities);
  const [paused, setPaused] = useState(false);
  const [repeat, setRepeat] = useState(1);

  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Citite din bucla de animatie, care traieste in afara randarii.
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  const repeatRef = useRef(1);
  const drivingUntil = useRef(0);
  const dragFrom = useRef<{ x: number; scroll: number } | null>(null);

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const pass = list.scrollWidth / repeatRef.current;
      if (pass <= 0) return;
      setRepeat(Math.max(1, Math.ceil(window.innerWidth / pass)));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const copy = () => viewport.scrollWidth / COPIES;

    // Pozitia de pornire e in copia din mijloc, ca sa existe loc de tras in ambele parti.
    viewport.scrollLeft = copy();

    /*
      Readuce pozitia in copia din mijloc. Copiile fiind identice, saltul nu se vede.
      `while`, nu `if`: dupa ce se masoara cate repetari incap pe ecran, latimea unei
      copii se schimba, iar pozitia pusa la montare poate ramane la mai mult de o
      copie distanta. Un singur pas n-ar fi ajuns.
    */
    const normalize = () => {
      const width = copy();
      const max = viewport.scrollWidth - viewport.clientWidth;
      if (width <= 0 || max <= 0) return;

      // Se calculeaza pe o valoare locala, nu scriind in `scrollLeft` la fiecare pas:
      // browserul plafoneaza pozitia la maximul derulabil, iar o bucla care compara
      // cu o valoare plafonata n-ar mai iesi niciodata.
      let next = viewport.scrollLeft;
      while (next < width && next + width <= max) next += width;
      while (next >= width * 2) next -= width;
      if (next !== viewport.scrollLeft) viewport.scrollLeft = next;
    };

    const drifting = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    let frame = 0;
    let last = 0;

    /*
      Restul de sub un pixel al derularii, tinut aici si nu in `scrollLeft`.

      `scrollLeft` rotunjeste la scriere. La 60 de cadre pe secunda un pas de derulare
      e de sub un pixel, deci fiecare scriere se pierdea intreaga si banda statea pe
      loc la nesfarsit — masurat in Chrome: `scrollLeft -= 0.43` se citeste inapoi
      neschimbat, `scrollLeft -= 5` se aplica. Asa se aduna pasii pana fac un pixel
      intreg si abia atunci se scrie. Marind doar viteza, bug-ul ar fi ramas: ar fi
      reaparut la prima rulare pe un ecran cu rata mare de improspatare.
    */
    let carry = 0;

    const step = (now: number) => {
      frame = requestAnimationFrame(step);
      const elapsed = last === 0 ? 0 : Math.min(now - last, 100);
      last = now;

      const idle = now >= drivingUntil.current && !dragFrom.current;
      if (drifting && !pausedRef.current && idle) {
        // Spre dreapta inseamna continut care vine dinspre stanga, deci pozitia scade.
        carry -= (DRIFT_PER_SECOND * elapsed) / 1000;
        const whole = Math.trunc(carry);
        if (whole !== 0) {
          viewport.scrollLeft += whole;
          carry -= whole;
        }
      } else {
        // Cat timp conduce omul, restul n-are de la ce sa se adune: pozitia nu mai
        // vine de aici. Pastrat, ar fi impins banda cu o smucitura la reluare.
        carry = 0;
      }
      normalize();
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  /** Orice atingere sau rotita opreste derularea automata pentru o clipa. */
  const takeOver = useCallback(() => {
    drivingUntil.current = performance.now() + RESUME_AFTER_MS;
  }, []);

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    // Doar mouse-ul are nevoie de tragere scrisa de mana; atingerea are deja
    // derulare nativa, cu inertie, si a o dubla ar fi facut-o sacadata.
    if (event.pointerType === "touch") return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    dragFrom.current = { x: event.clientX, scroll: viewport.scrollLeft };
    viewport.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragFrom.current;
    const viewport = viewportRef.current;
    if (!start || !viewport) return;
    viewport.scrollLeft = start.scroll - (event.clientX - start.x);
  }, []);

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragFrom.current) return;
      dragFrom.current = null;
      takeOver();
      const viewport = viewportRef.current;
      if (viewport?.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
    },
    [takeOver],
  );

  const passes = Array.from({ length: repeat }, (_, pass) => pass);
  const copies = Array.from({ length: COPIES }, (_, copy) => copy);

  return (
    <div>
      <div
        ref={viewportRef}
        className="reel-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onTouchStart={takeOver}
        onWheel={takeOver}
      >
        <div className="flex w-max">
          {copies.map((copy) => (
            <ul
              key={copy}
              ref={copy === 0 ? listRef : undefined}
              className="flex shrink-0 gap-3 pr-3 sm:gap-5 sm:pr-5"
              // O singura copie e citita de tehnologiile asistive; celelalte doua
              // exista doar ca bucla sa nu aiba capat.
              aria-hidden={copy !== 0}
            >
              {passes.map((pass) =>
                clips.map((clip) => (
                  <li key={`${clip.id}-${pass}`}>
                    <ClipTile
                      clip={clip}
                      playVideo={playVideo}
                      paused={paused}
                      decorative={copy !== 0 || pass > 0}
                    />
                  </li>
                )),
              )}
            </ul>
          ))}
        </div>
      </div>

      <div className="reel-control mx-auto mt-6 w-full max-w-[1200px] px-5 text-right">
        <button
          type="button"
          onClick={() => setPaused((current) => !current)}
          aria-pressed={paused}
          className="text-xs uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-bone"
        >
          {paused ? resumeLabel : pauseLabel}
        </button>
      </div>
    </div>
  );
}
