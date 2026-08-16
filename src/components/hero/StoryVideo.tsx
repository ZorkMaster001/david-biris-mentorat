"use client";

import Image from "next/image";
import { forwardRef } from "react";
import type { HeroSlide } from "@/content/types";

interface StoryVideoProps {
  slide: HeroSlide;
  active: boolean;
  playVideo: boolean;
  priority: boolean;
  onError: () => void;
}

export const StoryVideo = forwardRef<HTMLVideoElement, StoryVideoProps>(function StoryVideo(
  { slide, active, playVideo, priority, onError },
  ref,
) {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-[400ms] ease-[var(--ease-out-expo)]"
      style={{ opacity: active ? 1 : 0 }}
      aria-hidden={!active}
    >
      <Image
        src={`/media/img/${slide.poster}.avif`}
        alt={slide.alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
      {playVideo ? (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload={priority ? "auto" : "none"}
          poster={`/media/img/${slide.poster}.webp`}
          onError={onError}
        >
          <source src={`/media/video/${slide.video}.webm`} type="video/webm" />
          <source src={`/media/video/${slide.video}.mp4`} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
});
