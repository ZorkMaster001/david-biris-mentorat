import { BeforeAfter } from "@/components/results/BeforeAfter";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function Results({
  data,
  headingLevel = "h2",
}: {
  data: Content["results"];
  headingLevel?: "h1" | "h2";
}) {
  return (
    <Section id="rezultate" eyebrow={data.eyebrow} headline={data.headline} headingLevel={headingLevel}>
      <div className="mt-12 grid gap-14 sm:grid-cols-2">
        {data.testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} delay={index * 0.08}>
            <BeforeAfter
              testimonial={testimonial}
              beforeLabel={data.beforeLabel}
              afterLabel={data.afterLabel}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
