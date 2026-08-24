import { Reveal } from "@/components/ui/Reveal";
import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  headline?: string;
  headingLevel?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}

export function Section({
  id,
  headline,
  headingLevel = "h2",
  className = "",
  children,
}: SectionProps) {
  const headingClasses = "font-display text-[clamp(2rem,7vw,4.5rem)] max-w-[18ch]";

  return (
    <section id={id} className={`px-5 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Titlul intra primul, restul sectiunii dupa el. */}
        {headline ? (
          <Reveal>
            {headingLevel === "h1" ? (
              <h1 className={headingClasses}>{headline}</h1>
            ) : (
              <h2 className={headingClasses}>{headline}</h2>
            )}
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}
