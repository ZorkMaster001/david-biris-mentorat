import { Check } from "@phosphor-icons/react/dist/ssr";
import { ContactCta } from "@/components/contact/ContactCta";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

/**
 * Pretul, pe fata. Sta in treimea de jos a paginii, dupa ce omul a citit ce
 * primeste si a vazut ca a functionat la altii: o suma pusa mai sus s-ar fi
 * comparat cu nimic.
 *
 * Un singur card ingust, citit de sus in jos: suma → cat inseamna pe zi → ce
 * primesti → butonul. Fara coloane comparative si fara al doilea pachet — nu se
 * vinde decat unul, iar o grila de preturi ar fi inventat o alegere care nu exista.
 *
 * Pretul de lansare e scris ca stare de fapt, nu ca reducere: eticheta spune cate
 * locuri sunt, randul de sub ea spune cat va costa dupa. Fara procente, fara
 * numaratoare inversa — o urgenta pe care n-o poti verifica strica increderea
 * tocmai in sectiunea unde omul o cantareste cel mai atent.
 *
 * Suma pe zi sta discret sub pret, despartita de o linie: e o schimbare de unitate
 * care ajuta la incadrat suma, nu un argument care apasa.
 */
export function Pricing({
  data,
  contact,
}: {
  data: Content["pricing"];
  contact: Content["contact"];
}) {
  return (
    <Section id="pret" headline={data.headline}>
      <Reveal delay={80}>
        {/* Cardul ramane la stanga, ca restul blocurilor de text de pe pagina
            (`max-w-[52ch]` la `Offer`, `max-w-[48ch]` la `FinalCta`). Centrat sub un
            titlu aliniat la stanga ar fi rupt ritmul paginii. */}
        <div className="mt-12 max-w-[600px] rounded-3xl border border-signal/25 bg-ink-raised/70 p-6 sm:p-10">
          <p className="font-display text-xs tracking-[0.25em] text-signal">{data.planLabel}</p>

          {/* Suma si perioada intra in acelasi paragraf: sunt un singur lucru citit,
              iar despartite in doua blocuri s-ar fi rupt randul pe ecran ingust. */}
          <p className="mt-5 font-display leading-[0.85]">
            <span className="text-[clamp(3.25rem,14vw,5rem)]">{data.amount}</span>
            <span className="ml-3 text-lg tracking-[0.04em] text-bone-dim">{data.period}</span>
          </p>

          <p className="mt-6 inline-flex rounded-full border border-signal/40 bg-signal/10 px-4 py-1.5 font-display text-xs tracking-[0.14em] text-signal">
            {data.launchLabel}
          </p>
          <p className="mt-3 text-sm text-bone-dim">{data.launchNote}</p>

          <p className="mt-8 border-l-2 border-signal/30 pl-4 leading-relaxed text-bone-dim">
            {data.perDay}
          </p>

          <hr className="mt-8 border-hairline" />

          <p className="mt-8 font-display text-xs tracking-[0.25em] text-bone-dim">
            {data.includesLabel}
          </p>
          <ul className="mt-5 grid gap-3">
            {data.includes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check
                  size={18}
                  weight="bold"
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-signal"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex">
            <ContactCta labels={contact}>{data.cta}</ContactCta>
          </div>
          <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-bone-dim">{data.ctaNote}</p>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <p className="mt-6 max-w-[600px] text-sm text-bone-dim">{data.lockNote}</p>
      </Reveal>
    </Section>
  );
}
