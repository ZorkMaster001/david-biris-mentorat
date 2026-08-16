import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function Balance({ data }: { data: Content["balance"] }) {
  // Legenda e si text alternativ: descrie imaginea exact cum o citeste un vazator.
  const items = [
    { src: "balance-beer", caption: data.beerCaption },
    { src: "balance-fastfood", caption: data.fastfoodCaption },
  ];

  return (
    <Section tone="deep" headline={data.headline}>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {items.map((item, index) => (
          <Reveal key={item.src} delay={index * 0.08}>
            <figure>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={`/media/img/${item.src}.avif`}
                  alt={item.caption}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 text-lg leading-snug">{item.caption}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.16}>
        <p className="mt-12 max-w-[52ch] text-lg leading-relaxed text-bone-dim">{data.closing}</p>
      </Reveal>
    </Section>
  );
}
