import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function Process({ data }: { data: Content["process"] }) {
  return (
    <Section eyebrow={data.eyebrow} headline={data.headline}>
      <ol className="mt-12 grid gap-8 sm:grid-cols-3">
        {data.steps.map((step, index) => (
          <Reveal key={step.index} delay={index * 0.06}>
            <li className="border-t border-hairline pt-5">
              <span className="font-display text-4xl text-ember">{step.index}</span>
              <h3 className="mt-3 font-display text-xl">{step.title}</h3>
              <p className="mt-2 text-bone-dim">{step.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
