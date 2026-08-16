"use client";

interface StoryProgressProps {
  total: number;
  active: number;
  paused: boolean;
  durationMs: number;
  animate: boolean;
  onComplete: () => void;
}

export function StoryProgress({ total, active, paused, durationMs, animate, onComplete }: StoryProgressProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex gap-1.5 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      {Array.from({ length: total }, (_, index) => (
        <div key={index} className="h-[3px] flex-1 overflow-hidden rounded-full bg-bone/25">
          <div
            className="h-full origin-left bg-bone"
            style={
              index < active
                ? { transform: "scaleX(1)" }
                : index === active
                  ? {
                      animationName: animate ? "story-fill" : undefined,
                      animationDuration: `${durationMs}ms`,
                      animationTimingFunction: "linear",
                      animationFillMode: "forwards",
                      animationPlayState: paused ? "paused" : "running",
                      // Fara animatie (reduced motion / save-data), bara activa e plina de la
                      // inceput: marcheaza slide-ul curent fara sa pretinda ca progreseaza.
                      transform: animate ? undefined : "scaleX(1)",
                    }
                  : { transform: "scaleX(0)" }
            }
            onAnimationEnd={index === active ? onComplete : undefined}
          />
        </div>
      ))}
    </div>
  );
}
