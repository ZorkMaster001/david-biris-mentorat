import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function FirstTime({ data }: { data: Content["firstTime"] }) {
  return (
    <Section headline={data.headline}>
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5 text-lg leading-relaxed text-bone-dim">
          {data.body.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 80}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="media-zoom relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src={`/media/img/${data.image}.avif`}
              alt={data.imageAlt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
