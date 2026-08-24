import {
  Barbell,
  ChartLineUp,
  ChatCircleDots,
  ForkKnife,
  Globe,
  ListChecks,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { Content } from "@/content/types";

/**
 * Pictogramele stau aici, nu in continut: sunt desen, nu text, si n-au ce cauta
 * intr-un fisier care se traduce. Cheia e `id`-ul punctului, acelasi in ambele limbi.
 */
const ICONS: Record<string, Icon> = {
  online: Globe,
  program: Barbell,
  ghidare: ListChecks,
  feedback: VideoCamera,
  nutritie: ForkKnife,
  progres: ChartLineUp,
  acces: ChatCircleDots,
};

/**
 * Singurul loc din pagina unde scrie negru pe alb ce contine mentoratul. Sta imediat
 * sub hero fiindca restul paginii vinde senzatia, iar omul venit din TikTok pleaca
 * daca nu vede in primele secunde ce cumpara.
 *
 * Sapte carduri plus concluzia, asezate ca sa nu ramana gauri in grila: concluzia
 * ocupa doua celule pe ecran lat (7 + 2 = 9, adica trei randuri pline), iar pe doua
 * coloane se latesc ultimul card si concluzia (6 + 2 + 2 = doua randuri pline peste
 * cele trei). Cu span-uri fixe, undeva ramanea mereu o celula goala.
 *
 * Concluzia nu e al optulea serviciu, e beneficiul final — de aceea are rama si
 * fundal in culoarea de accent, nu aceeasi rama ca restul.
 */
export function Offer({ data }: { data: Content["offer"] }) {
  const last = data.items.length - 1;

  return (
    <Section id="mentorat" headline={data.headline}>
      <Reveal delay={80}>
        <p className="mt-6 max-w-[52ch] text-lg text-bone-dim">{data.body}</p>
      </Reveal>

      {/* `as="li"`: invelisul sta direct sub `ul`, unde un `div` e HTML invalid.
          Miscarea de hover sta pe cardul dinauntru, nu pe `li`: pe acelasi element,
          ridicarea ar fi mostenit tranzitia de 620ms a intrarii la scroll si ar fi
          raspuns la mouse cu o intarziere de jumatate de secunda. */}
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, index) => {
          const Glyph = ICONS[item.id];
          return (
            <Reveal
              key={item.id}
              as="li"
              delay={index * 60}
              className={index === last ? "sm:col-span-2 lg:col-span-1" : ""}
            >
              <article className="group relative h-full overflow-hidden rounded-2xl border border-hairline bg-ink-raised/60 p-6 transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-signal/40 hover:bg-ink-raised">
                {/* Aura din colt se aprinde la hover. Decor pur, deci `aria-hidden`
                    si fara efect asupra asezarii. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-signal/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <span
                  aria-hidden="true"
                  className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-signal/25 bg-signal/10 text-signal transition-colors duration-300 group-hover:border-signal/50 group-hover:bg-signal/15"
                >
                  {Glyph ? <Glyph size={24} weight="duotone" /> : null}
                </span>
                <h3 className="relative mt-5 font-display text-lg">{item.label}</h3>
                <p className="relative mt-2 leading-relaxed text-bone-dim">{item.detail}</p>
              </article>
            </Reveal>
          );
        })}

        <Reveal as="li" delay={data.items.length * 60} className="sm:col-span-2">
          <div className="flex h-full flex-col justify-center rounded-2xl border border-signal/30 bg-signal/[0.07] p-6 sm:p-8">
            <p className="font-display text-xs tracking-[0.25em] text-signal">
              {data.closingLabel}
            </p>
            <p className="mt-4 max-w-[46ch] text-lg leading-relaxed">{data.closing}</p>
          </div>
        </Reveal>
      </ul>
    </Section>
  );
}
