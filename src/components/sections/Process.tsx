import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function Process({ data }: { data: Content["process"] }) {
  return (
    <Section headline={data.headline}>
      <ol className="mt-12 grid gap-8 sm:grid-cols-3">
        {/* `as="li"`: invelisul sta direct sub `ol`, unde un `div` e HTML invalid. */}
        {data.steps.map((step, index) => (
          <Reveal key={step.index} as="li" delay={index * 90} className="border-t border-hairline pt-5">
            <span className="font-display text-4xl text-signal">{step.index}</span>
            <h3 className="mt-3 font-display text-xl">{step.title}</h3>
            <p className="mt-2 text-bone-dim">{step.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
