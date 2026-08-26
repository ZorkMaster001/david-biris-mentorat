"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { BarbellFallback } from "@/components/method/BarbellFallback";
import { PillarList } from "@/components/method/PillarList";
import { SceneBoundary } from "@/components/method/SceneBoundary";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";
import { shouldRender3D, useDeviceCapabilities } from "@/lib/device";

// Incarcat separat si doar in browser: `three` nu are ce cauta in bundle-ul initial.
const BarbellScene = dynamic(() => import("@/components/method/BarbellScene"), { ssr: false });

export function Method({
  data,
  headingLevel = "h2",
}: {
  data: Content["method"];
  headingLevel?: "h1" | "h2";
}) {
  const capabilities = useDeviceCapabilities();
  const [mountedCount, setMountedCount] = useState(0);
  const [inView, setInView] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      // Marja e generoasa anume: chunk-ul cu `three` are vreo 229 KB comprimat, iar
      // pe telefon, pe date mobile, 200px de avans nu ajung ca sa fie descarcat pana
      // cand sectiunea chiar intra in cadru. Asa incepe sa se incarce cu un ecran
      // intreg inainte.
      { rootMargin: "800px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleCount = useCallback((count: number) => setMountedCount(count), []);
  const handleCrash = useCallback(() => setCrashed(true), []);

  const render3D = shouldRender3D(capabilities) && inView && !crashed;

  return (
    <Section id="metoda" headline={data.headline} headingLevel={headingLevel}>
      <Reveal delay={80}>
        <p className="mt-6 max-w-[52ch] text-lg text-bone-dim">{data.body}</p>
      </Reveal>
      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-start">
        <div ref={stage} className="sticky top-16 h-[46vh] min-h-[300px] lg:h-[70vh]">
          {render3D ? (
            <SceneBoundary onError={handleCrash} fallback={<BarbellFallback pillars={data.pillars} />}>
              <BarbellScene pillars={data.pillars} mountedCount={mountedCount} />
            </SceneBoundary>
          ) : (
            <BarbellFallback pillars={data.pillars} />
          )}
        </div>
        <PillarList
          pillars={data.pillars}
          onVisibleCountChange={handleCount}
          headingLevel={headingLevel}
        />
      </div>
    </Section>
  );
}
