import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function Faq({ data }: { data: Content["faq"] }) {
  return (
    <Section tone="deep" eyebrow={data.eyebrow} headline={data.headline}>
      {/*
        <details> nativ: se deschide fara JavaScript, e navigabil de la tastatura din
        start, si ramane citibil pentru un crawler chiar si inchis — ceea ce conteaza
        pentru extragerea in raspunsuri generate de AI.
      */}
      <div className="mt-10 divide-y divide-hairline border-t border-hairline">
        {data.items.map((item) => (
          <details key={item.question} className="group py-5">
            <summary className="cursor-pointer list-none font-display text-xl marker:hidden">
              {item.question}
            </summary>
            <p className="mt-3 max-w-[56ch] text-bone-dim">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
