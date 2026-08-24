"use client";

import { ArrowUpRight, X } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { CtaArrow } from "@/components/ui/CtaButton";
import { CTA_BASE, CTA_VARIANTS, type CtaVariant } from "@/components/ui/ctaStyles";
import type { Content } from "@/content/types";
import { instagramUrl, whatsappUrl } from "@/lib/contact";

interface ContactCtaProps {
  labels: Content["contact"];
  variant?: CtaVariant;
  children: ReactNode;
}

interface Channel {
  key: string;
  href: string;
  label: string;
  note: string;
  icon: string;
  /** Canalul recomandat primeste accentul; celalalt ramane pe chenar simplu. */
  featured: boolean;
}

function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <a
      href={channel.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-4 rounded-2xl border p-4 transition-colors duration-200 ease-[var(--ease-out-expo)] ${
        channel.featured
          ? "border-signal/45 bg-signal/[0.07] hover:border-signal hover:bg-signal/[0.12]"
          : "border-hairline hover:border-bone/40 hover:bg-bone/5"
      }`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element -- logo de brand static, dimensiuni fixe, fara beneficiu din optimizare */}
        <img src={channel.icon} alt="" width={26} height={26} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg tracking-[0.03em]">{channel.label}</span>
        <span className="mt-0.5 block text-sm text-bone-dim">{channel.note}</span>
      </span>
      <ArrowUpRight
        size={20}
        weight="bold"
        aria-hidden="true"
        className={`shrink-0 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
          channel.featured ? "text-signal" : "text-bone-dim"
        }`}
      />
    </a>
  );
}

/**
 * Butonul mare de contact. Nu mai duce direct pe WhatsApp: deschide o fereastra in
 * care omul alege singur canalul.
 *
 * Declansatorul ramane o legatura catre WhatsApp, nu un buton: fara JavaScript se
 * comporta exact ca inainte, in loc sa fie un buton mort. Alegerea e imbunatatirea,
 * nu conditia.
 *
 * Fereastra e un `<dialog>` nativ deschis cu `showModal()`, deci capcana de focus,
 * Escape, fundalul inert si `::backdrop` vin de la browser. Vezi `.contact-dialog`
 * in globals.css.
 */
export function ContactCta({ labels, variant = "primary", children }: ContactCtaProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Butonul apare de mai multe ori pe aceeasi pagina, deci id-ul nu poate fi fix.
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const whatsappHref = whatsappUrl(labels.prefilledMessage);

  const channels: Channel[] = [
    {
      key: "whatsapp",
      href: whatsappHref,
      label: labels.whatsappLabel,
      note: labels.whatsappNote,
      icon: "/media/brand/whatsapp.svg",
      featured: true,
    },
    {
      key: "instagram",
      href: instagramUrl(),
      label: labels.instagramLabel,
      note: labels.instagramNote,
      icon: "/media/brand/instagram.svg",
      featured: false,
    },
  ];

  function onTriggerClick(event: MouseEvent<HTMLAnchorElement>) {
    // Click cu modificator sau pe rotita inseamna „deschide in alta parte": alea
    // raman pe seama browserului, cu legatura de WhatsApp de pe `href`.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(true);
  }

  return (
    <>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-haspopup="dialog"
        onClick={onTriggerClick}
        className={`${CTA_BASE} ${CTA_VARIANTS[variant]}`}
      >
        {children}
        <CtaArrow />
      </a>

      <dialog
        ref={dialogRef}
        className="contact-dialog"
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
      >
        {open ? (
          <div
            // Click pe fundal, nu pe panou: `<dialog>` umple ecranul, deci comparam
            // tinta cu invelisul, nu cu elementul de dialog.
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
            className="flex min-h-full items-end justify-center p-4 sm:items-center"
          >
            <div className="contact-panel relative w-full max-w-[440px] rounded-3xl border border-hairline bg-ink-raised p-6 shadow-[0_30px_90px_-24px_rgba(0,0,0,0.95)] sm:p-8">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={labels.closeLabel}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-bone-dim transition-colors hover:bg-bone/10 hover:text-bone"
              >
                <X size={18} weight="bold" />
              </button>

              <h2 id={titleId} className="max-w-[16ch] font-display text-2xl sm:text-3xl">
                {labels.pickerTitle}
              </h2>
              <p className="mt-2 max-w-[36ch] text-sm text-bone-dim">{labels.pickerBody}</p>

              <div className="mt-6 grid gap-3">
                {channels.map((channel) => (
                  <ChannelCard key={channel.key} channel={channel} />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
