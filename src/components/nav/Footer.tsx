import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Content } from "@/content/types";
import { instagramUrl, whatsappUrl } from "@/lib/contact";

interface FooterProps {
  data: Content["footer"];
  contact: Content["contact"];
  business: Content["business"];
}

/**
 * Ramane server component: un subsol static n-are de ce sa trimita JavaScript.
 * Comutatorul de limba a urcat in `LocaleSwitch`, fixat sus-dreapta pe toate
 * paginile, deci aici nu mai are ce cauta un al doilea.
 *
 * Semnatura uriasa de la baza e desenata cu acelasi font de display ca titlurile,
 * dar la 10% opacitate: inchide pagina cu numele omului fara sa concureze cu
 * butonul de contact de deasupra ei. E `aria-hidden` — numele apare deja in randul
 * de copyright, iar un cititor de ecran n-are de ce sa-l auda de doua ori.
 */
export function Footer({ data, contact, business }: FooterProps) {
  const channels = [
    { key: "whatsapp", href: whatsappUrl(contact.prefilledMessage), label: contact.whatsappLabel },
    { key: "instagram", href: instagramUrl(), label: contact.instagramLabel },
  ];

  return (
    // Tot subsolul e centrat, pe orice latime: eticheta, pastilele de contact,
    // localitatea, semnatura si randul de jos.
    <footer className="relative overflow-hidden border-t border-hairline px-5 pb-12 pt-16 text-center">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-xs uppercase tracking-[0.25em] text-bone-dim">{data.contactLabel}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {channels.map((channel) => (
            <a
              key={channel.key}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 font-display text-sm tracking-[0.04em] transition-colors duration-200 ease-[var(--ease-out-expo)] hover:border-signal hover:text-signal"
            >
              {channel.label}
              <ArrowUpRight
                size={15}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          ))}
        </div>

        {/*
          Localitatea, vizibila in text, nu doar in datele structurate. Google
          potriveste afacerea cu orasul din continutul paginii; o adresa care exista
          doar in JSON-LD e un semnal mult mai slab. Randul asta apare pe fiecare
          pagina, deci e ancora locala a intregului site — nu-l scoate.

          Numarul de telefon a fost scos la cererea clientului. Ramane in schema
          (`telephone`) si in legatura de WhatsApp, deci contactul nu s-a pierdut.
        */}
        <p className="mt-8 text-sm text-bone-dim">{business.locationLine}</p>

        <p
          aria-hidden="true"
          className="mt-14 whitespace-nowrap font-display text-[clamp(3rem,13vw,11rem)] leading-[0.8] text-bone/10"
        >
          {data.wordmark}
        </p>

        <div className="mt-12 flex flex-col items-center gap-6 border-t border-hairline pt-8">
          {/* Mai ingust decat inainte: pe ecran lat randul e centrat, iar 70 de
              caractere centrate se citesc prost. La 62 liniile ies echilibrate. */}
          <p className="max-w-[62ch] text-xs leading-relaxed text-bone-dim">{data.disclaimer}</p>
          <p className="whitespace-nowrap text-xs text-bone-dim">
            © {new Date().getFullYear()} {data.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
