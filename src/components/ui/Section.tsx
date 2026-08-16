import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  headline?: string;
  tone?: "ink" | "deep";
  headingLevel?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}

export function Section({
  id,
  eyebrow,
  headline,
  tone = "ink",
  headingLevel = "h2",
  className = "",
  children,
}: SectionProps) {
  const background = tone === "deep" ? "bg-deep/25" : "bg-ink";
  const headingClasses = "font-display text-[clamp(2rem,7vw,4.5rem)] max-w-[18ch]";

  return (
    <section id={id} className={`${background} px-5 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1200px]">
        {eyebrow ? (
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ember">
            {eyebrow}
          </p>
        ) : null}
        {headline
          ? headingLevel === "h1"
            ? (
                <h1 className={headingClasses}>{headline}</h1>
              )
            : (
                <h2 className={headingClasses}>{headline}</h2>
              )
          : null}
        {children}
      </div>
    </section>
  );
}
