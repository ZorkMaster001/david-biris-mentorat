import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function Faq({ data }: { data: Content["faq"] }) {
  return (
    <Section headline={data.headline}>
      {/*
        <details> nativ: se deschide fara JavaScript, e navigabil de la tastatura din
        start, si ramane citibil pentru un crawler chiar si inchis, ceea ce conteaza
        pentru extragerea in raspunsuri generate de AI. Peste el, fiecare intrebare e
        desenata ca buton propriu, cu un cerc de plus care se roteste in x la deschidere.
      */}
      <div className="mt-10 space-y-3">
        {data.items.map((item, index) => (
          <Reveal key={item.question} delay={index * 70}>
            <details className="group rounded-2xl border border-hairline bg-ink-raised/50 transition-colors duration-200 open:border-signal/40 open:bg-ink-raised">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 rounded-2xl px-5 py-5 font-display text-lg sm:text-xl [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-bone/25 text-bone transition-[transform,background-color,color,border-color] duration-200 ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:border-signal group-open:bg-signal group-open:text-ink"
                >
                  <Plus size={16} weight="bold" />
                </span>
              </summary>
              <p className="max-w-[56ch] px-5 pb-5 leading-relaxed text-bone-dim">
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
