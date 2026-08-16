import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function FinalCta({ data, href }: { data: Content["finalCta"]; href: string }) {
  return (
    <Section headline={data.headline}>
      <p className="mt-6 max-w-[48ch] text-lg text-bone-dim">{data.body}</p>
      <div className="mt-8">
        <CtaButton href={href} external>
          {data.cta}
        </CtaButton>
      </div>
    </Section>
  );
}
