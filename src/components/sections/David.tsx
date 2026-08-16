import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function David({
  data,
  headingLevel = "h2",
}: {
  data: Content["david"];
  headingLevel?: "h1" | "h2";
}) {
  return (
    <Section id="despre" eyebrow={data.eyebrow} headline={data.headline} headingLevel={headingLevel}>
      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src={`/media/img/${data.image}.avif`}
              alt={data.imageAlt}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div className="space-y-5 text-lg leading-relaxed text-bone-dim">
          {data.body.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 0.05}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
