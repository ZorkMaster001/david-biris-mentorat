"use client";

import { useEffect, useRef, useState } from "react";
import type { ReelClip } from "@/content/types";
import { shouldPlayVideo, useDeviceCapabilities } from "@/lib/device";
import { ClipTile } from "./ClipTile";

interface ClipMarqueeProps {
  clips: ReelClip[];
  pauseLabel: string;
  resumeLabel: string;
}

/**
 * Doua copii identice ale listei, deplasate continuu spre dreapta. Gap-ul sta in
 * padding-ul randului, nu intre randuri, deci o copie masoara exact 50% din
 * pista si saltul buclei nu se vede. Vezi `.reel-*` in globals.css.
 *
 * O copie trebuie sa fie cel putin cat ecranul, altfel pista (doua copii) nu
 * acopera latimea si la fiecare tur apare o portiune goala in dreapta. Pe telefon
 * cele cinci patratele de 62vw depasesc de trei ori ecranul, dar pe desktop sunt
 * fixate la 300px, deci o copie masoara ~1600px si nu ajunge. De aceea lista se
 * repeta de cate ori e nevoie, masurat dupa montare.
 */
export function ClipMarquee({ clips, pauseLabel, resumeLabel }: ClipMarqueeProps) {
  const capabilities = useDeviceCapabilities();
  const playVideo = shouldPlayVideo(capabilities);
  const [paused, setPaused] = useState(false);
  const [repeat, setRepeat] = useState(1);
  const listRef = useRef<HTMLUListElement>(null);
  // `measure` traieste intr-un efect care ruleaza o singura data, dar are nevoie
  // de numarul curent de repetari ca sa scada latimea unei singure treceri din
  // latimea totala a randului.
  const repeatRef = useRef(1);
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

  const passes = Array.from({ length: repeat }, (_, pass) => pass);

  return (
    <div>
      <div className="reel-viewport">
        <div className="reel-track flex w-max" data-paused={paused}>
          {[false, true].map((decorative) => (
            <ul
              key={decorative ? "clone" : "list"}
              ref={decorative ? undefined : listRef}
              className={`flex shrink-0 gap-3 pr-3 sm:gap-5 sm:pr-5 ${decorative ? "reel-clone" : ""}`}
              aria-hidden={decorative}
            >
              {passes.map((pass) =>
                clips.map((clip) => (
                  <li key={`${clip.id}-${pass}`}>
                    <ClipTile
                      clip={clip}
                      playVideo={playVideo}
                      paused={paused}
                      decorative={decorative || pass > 0}
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
