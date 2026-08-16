"use client";

import { ChatCircleDots, X } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/content/types";
import { instagramUrl, whatsappUrl } from "@/lib/contact";

export function ContactFab({ labels }: { labels: Content["contact"] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const actions = [
    {
      key: "whatsapp",
      href: whatsappUrl(labels.prefilledMessage),
      label: labels.whatsappLabel,
      icon: "/media/brand/whatsapp.svg",
    },
    {
      key: "instagram",
      href: instagramUrl(),
      label: labels.instagramLabel,
      icon: "/media/brand/instagram.svg",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed right-4 z-50 flex flex-col-reverse items-end gap-3"
      style={{ bottom: "calc(var(--spacing-nav) + env(safe-area-inset-bottom) + 16px)" }}
    >
      {/* Butonul e primul in DOM ca Tab sa ajunga de la el la actiuni; flex-col-reverse il tine vizual jos. */}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={labels.fabLabel}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ember text-ink shadow-lg shadow-ember/25"
      >
        <span
          className="flex items-center justify-center transition-transform duration-200 ease-[var(--ease-out-expo)]"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          {open ? <X size={26} weight="bold" /> : <ChatCircleDots size={26} weight="fill" />}
        </span>
      </button>

      {/*
        Actiunile raman montate si se ascund cu `inert`, care le scoate si din ordinea
        de Tab si din arborele de accesibilitate. Asa animeaza si intrarea si iesirea,
        fara nicio biblioteca.
      */}
      {actions.map((action, index) => (
        <a
          key={action.key}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          inert={!open}
          style={{ transitionDelay: open ? `${index * 40}ms` : "0ms" }}
          className={`flex min-h-[48px] items-center gap-3 rounded-full border border-hairline bg-ink-raised/95 py-2 pl-4 pr-3 backdrop-blur-xl transition-[opacity,transform] duration-200 ease-[var(--ease-out-expo)] ${
            open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-90 opacity-0"
          }`}
        >
          <span className="text-sm font-medium">{action.label}</span>
          {/* eslint-disable-next-line @next/next/no-img-element -- logo de brand static, dimensiuni fixe, fara beneficiu din optimizare */}
          <img src={action.icon} alt="" width={28} height={28} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
