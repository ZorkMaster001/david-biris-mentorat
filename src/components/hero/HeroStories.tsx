"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/content/types";
import { shouldPlayVideo, useDeviceCapabilities } from "@/lib/device";
import { CtaButton } from "@/components/ui/CtaButton";
import { StoryProgress } from "./StoryProgress";
import { StoryVideo } from "./StoryVideo";
import { HOLD_THRESHOLD_MS, SLIDE_DURATION_MS, SWIPE_THRESHOLD_PX, nextIndex, prevIndex, tapZone } from "./storyNavigation";

interface HeroStoriesProps {
  slides: HeroSlide[];
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  prevSlideLabel: string;
  nextSlideLabel: string;
  pauseLabel: string;
  resumeLabel: string;
}

export function HeroStories({
  slides,
  headline,
  subheadline,
  ctaPrimary,
  ctaPrimaryHref,
  ctaSecondary,
  ctaSecondaryHref,
  prevSlideLabel,
  nextSlideLabel,
  pauseLabel,
  resumeLabel,
}: HeroStoriesProps) {
  const capabilities = useDeviceCapabilities();
  const playVideo = shouldPlayVideo(capabilities);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  // Respinsul autoplay e definitiv pentru sesiunea curenta: odata blocat, nu mai
  // reincercam play() la fiecare schimbare de slide — trecem pe postere si pe timer.
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  // La primul randare se vede doar posterul slide-ului activ; vecinii se adauga
  // dupa montare, in acelasi idle callback care preincarca urmatorul clip video.
  const [visiblePosters, setVisiblePosters] = useState<Set<number>>(() => new Set([0]));

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const pointerStart = useRef<{ x: number; time: number } | null>(null);

  const total = slides.length;
  const goNext = useCallback(() => setActive((index) => nextIndex(index, total)), [total]);
  const goPrev = useCallback(() => setActive((index) => prevIndex(index, total)), [total]);

  const activelyPlaying = playVideo && !autoplayBlocked;

  // Reduced motion, save-data, sau autoplay respins: animatia CSS e neutralizata / neatasata
  // ori clipul nu porneste deloc, deci temporizam manual avansarea.
  useEffect(() => {
    if (activelyPlaying || paused) return;
    const timer = window.setTimeout(goNext, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, activelyPlaying, goNext]);

  // Schimbarea slide-ului: opreste clipurile inactive ca sa nu tina decodoare
  // ocupate, si readuce clipul activ la inceput.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active) video.currentTime = 0;
      else video.pause();
    });
  }, [active]);

  // Redarea si pauza clipului activ, separat de efectul de mai sus: reluarea dupa
  // pauza continua de unde a ramas, in loc sa reporneasca de la zero.
  useEffect(() => {
    if (!activelyPlaying) return;
    const video = videoRefs.current[active];
    if (!video) return;

    if (paused) {
      video.pause();
      return;
    }
    void video.play().catch(() => setAutoplayBlocked(true));
  }, [active, activelyPlaying, paused]);

  // Extinde setul de postere vizibile la vecini si preincarca urmatorul clip video,
  // ambele intr-un singur idle callback ca sa nu concureze cu LCP-ul primului cadru.
  useEffect(() => {
    const expand = () => {
      setVisiblePosters((current) => {
        const updated = new Set(current);
        updated.add(active);
        updated.add(nextIndex(active, total));
        updated.add(prevIndex(active, total));
        return updated;
      });

      if (!activelyPlaying) return;
      const upcoming = videoRefs.current[nextIndex(active, total)];
      if (!upcoming || upcoming.preload === "auto") return;
      upcoming.preload = "auto";
      upcoming.load();
    };

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(expand);
      return () => window.cancelIdleCallback(handle);
    }

    const handle = window.setTimeout(expand, 400);
    return () => window.clearTimeout(handle);
  }, [active, activelyPlaying, total]);

  // Un clip stricat nu blocheaza slideshow-ul.
  const handleError = useCallback(
    (index: number) => {
      setFailed((current) => new Set(current).add(index));
      if (index === active) goNext();
    },
    [active, goNext],
  );

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    pointerStart.current = { x: event.clientX, time: Date.now() };
    setPaused(true);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    setPaused(false);
    if (!start) return;

    const dx = event.clientX - start.x;
    const held = Date.now() - start.time;

    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
      if (dx < 0) goNext();
      else goPrev();
      return;
    }

    if (held >= HOLD_THRESHOLD_MS) return; // a fost o tinere apasata, nu un tap

    const rect = event.currentTarget.getBoundingClientRect();
    if (tapZone(event.clientX, rect.left, rect.width) === "prev") goPrev();
    else goNext();
  }

  const activeSlide = slides[active];

  return (
    <section
      className="relative h-[100dvh] w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label={headline}
    >
      <div
        className="absolute inset-0"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerStart.current = null;
          setPaused(false);
        }}
      >
        {slides.map((slide, index) => (
          <StoryVideo
            key={slide.id}
            ref={(element) => {
              videoRefs.current[index] = element;
            }}
            slide={slide}
            active={index === active}
            playVideo={activelyPlaying && !failed.has(index)}
            priority={index === 0}
            showPoster={visiblePosters.has(index) || index === active}
            onError={() => handleError(index)}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/70" />

      <StoryProgress
        total={total}
        active={active}
        paused={paused}
        durationMs={SLIDE_DURATION_MS}
        animate={activelyPlaying}
        onComplete={goNext}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-[calc(var(--spacing-nav)+env(safe-area-inset-bottom)+2rem)]">
        {activeSlide ? <p className="font-display text-[clamp(2.5rem,14vw,6rem)] text-ember">{activeSlide.word}</p> : null}
        <h1 className="mt-3 font-display text-[clamp(1.75rem,6.5vw,3.5rem)] max-w-[16ch]">{headline}</h1>
        <p className="mt-4 max-w-[42ch] text-base text-bone-dim">{subheadline}</p>
        <div className="pointer-events-auto mt-7 flex flex-col gap-3 sm:flex-row">
          <CtaButton href={ctaPrimaryHref} external>
            {ctaPrimary}
          </CtaButton>
          <CtaButton href={ctaSecondaryHref} variant="ghost">
            {ctaSecondary}
          </CtaButton>
        </div>
      </div>

      <button
        type="button"
        onClick={goPrev}
        aria-label={prevSlideLabel}
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:inset-y-0 focus-visible:left-0 focus-visible:z-30 focus-visible:w-16"
      />
      <button
        type="button"
        onClick={goNext}
        aria-label={nextSlideLabel}
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:inset-y-0 focus-visible:right-0 focus-visible:z-30 focus-visible:w-16"
      />
      <button
        type="button"
        onClick={() => setPaused((current) => !current)}
        aria-label={paused ? resumeLabel : pauseLabel}
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:inset-x-0 focus-visible:top-3 focus-visible:z-30 focus-visible:mx-auto focus-visible:w-fit focus-visible:px-3"
      />
    </section>
  );
}
