import { ContactCta } from "@/components/contact/ContactCta";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

export function FinalCta({
  data,
  contact,
}: {
  data: Content["finalCta"];
  contact: Content["contact"];
}) {
  return (
    <Section headline={data.headline}>
      <p className="mt-6 max-w-[48ch] text-lg text-bone-dim">{data.body}</p>
      <div className="mt-8 flex sm:justify-center">
        <ContactCta labels={contact}>{data.cta}</ContactCta>
      </div>
    </Section>
  );
}
