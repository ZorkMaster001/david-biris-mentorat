"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReelClip } from "@/content/types";

interface ClipTileProps {
  clip: ReelClip;
  /** Capabilitatile dispozitivului permit redarea. Fals inseamna doar poster. */
  playVideo: boolean;
  /** Banda e oprita din butonul de control: clipurile stau si ele. */
  paused: boolean;
  /** Patratel din copia decorativa a listei — ascuns de tehnologiile asistive. */
  decorative: boolean;
}

const SIZES = "(min-width: 640px) 300px, 62vw";

/** Cat de departe de marginea ecranului se armeaza un patratel, ca sa aiba timp sa incarce. */
const MARGIN = 300;
const TICK_MS = 400;

/*
  Un singur ceas pentru toate patratelele. La ritmul benzii (pista de 6400px in 60s,
  adica ~107px/s) un tur de 400ms muta un patratel cu ~43px, mult sub marja de 300px,
  deci nimic nu apuca sa intre in cadru neincarcat.
*/
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function tick() {
  if (document.hidden) return;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  timer ??= setInterval(tick, TICK_MS);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function ClipTile({ clip, playVideo, paused, decorative }: ClipTileProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Banda are doua copii ale listei, deci fara filtrul de vizibilitate ar rula
  // zece decodoare deodata.
  const [inView, setInView] = useState(false);
  const [armed, setArmed] = useState(false);
  const [broken, setBroken] = useState(false);

  /*
    Vizibilitatea se masoara cu getBoundingClientRect, nu cu IntersectionObserver.
    Patratelele sunt purtate de o animatie de `transform` pe pista, iar animatiile
    de transform ruleaza pe firul compozitorului: firul principal nu-si mai
    actualizeaza stilul la fiecare cadru, deci observatorul continua sa vada
    pozitiile de la pornire si nu anunta niciodata patratelele care chiar au intrat
    in cadru. Asa a ramas banda pe postere. `getBoundingClientRect` citeste pozitia
    reala, iar un ceas comun de 400ms costa cateva masuratori pe secunda.
  */
  useEffect(() => {
    if (!playVideo) return;
    const frame = frameRef.current;
    if (!frame) return;

    const check = () => {
      const rect = frame.getBoundingClientRect();
      const visible =
        rect.right > -MARGIN &&
        rect.left < window.innerWidth + MARGIN &&
        rect.bottom > -MARGIN &&
        rect.top < window.innerHeight + MARGIN;
      setInView(visible);
      if (visible) setArmed(true);
    };

    check();
    const stop = subscribe(check);
    document.addEventListener("visibilitychange", check);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", check);
    };
  }, [playVideo]);

  const active = playVideo && armed && inView && !paused && !broken;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!active) {
      video.pause();
      return;
    }

    // React seteaza `muted` ca proprietate, nu ca atribut, si sunt browsere care
    // verifica atributul cand decid daca au voie sa porneasca singure. Il fortam
    // inainte de play(), altfel politica de autoplay respinge cererea.
    video.muted = true;

    // Promisiunea lui play() e respinsa cu AbortError ori de cate ori pause() o
    // intrerupe, iar in banda asta se intampla la fiecare patratel care iese din
    // cadru. Daca respingerea ar marca clipul stricat, banda ar ramane pe postere
    // dupa cateva secunde. Erorile reale de media vin pe onError.
    const start = () => void video.play().catch(() => {});
    start();
    // A doua incercare cand chiar are ce reda: pe conexiuni lente prima cerere
    // pleaca inainte sa existe primul cadru si e respinsa degeaba.
    video.addEventListener("canplay", start);
    return () => video.removeEventListener("canplay", start);
  }, [active]);

  return (
    <div
      ref={frameRef}
      className="relative aspect-square w-[62vw] max-w-[300px] shrink-0 overflow-hidden rounded-[1.25rem] bg-ink-raised ring-1 ring-hairline sm:w-[300px]"
    >
      <Image
        src={`/media/img/${clip.poster}.avif`}
        alt={decorative ? "" : clip.alt}
        fill
        sizes={SIZES}
        className="object-cover"
      />

      {/*
        Video-ul sta peste poster, opac tot timpul: pana ii ajung primele cadre e
        transparent, deci se vede posterul de dedesubt. O tranzitie de opacitate
        legata de `onPlaying` ar fi lasat patratelul gol daca evenimentul intarzie.
      */}
      {playVideo && armed && !broken ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
          // `error` nu urca in DOM, dar React il propaga prin arborele lui, deci
          // handler-ul de aici prinde si esecul unui singur <source>. O sursa care
          // nu merge (webm pe un browser fara VP9) nu inseamna clip stricat:
          // browserul trece la urmatoarea. Doar eroarea venita chiar de pe <video>
          // spune ca s-au terminat sursele.
          onError={(event) => {
            if (event.target === event.currentTarget) setBroken(true);
          }}
        >
          <source src={`/media/video/${clip.video}.webm`} type="video/webm" />
          <source src={`/media/video/${clip.video}.mp4`} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
