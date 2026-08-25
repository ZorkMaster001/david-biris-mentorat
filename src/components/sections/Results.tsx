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
    <Section id="rezultate" headline={data.headline} headingLevel={headingLevel}>
      {/* Trei coloane abia de la `lg`. Pe tableta, trei cadre 9:16 unul langa altul ar
          fi lasat citatelor de dedesubt vreo 200px latime, adica patru cuvinte pe rand. */}
      <div className="mt-12 grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
        {data.testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} delay={index * 110}>
            <BeforeAfter
              testimonial={testimonial}
              beforeLabel={data.beforeLabel}
              afterLabel={data.afterLabel}
              quoteOpen={data.quoteOpen}
              quoteClose={data.quoteClose}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
