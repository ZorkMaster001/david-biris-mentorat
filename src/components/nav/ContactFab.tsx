"use client";

import { X, ChatCircleDots } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/content/types";
import { instagramUrl, whatsappUrl } from "@/lib/contact";

export function ContactFab({ labels }: { labels: Content["contact"] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

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
    { key: "whatsapp", href: whatsappUrl(labels.prefilledMessage), label: labels.whatsappLabel, icon: "/media/brand/whatsapp.svg" },
    { key: "instagram", href: instagramUrl(), label: labels.instagramLabel, icon: "/media/brand/instagram.svg" },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed right-4 z-50 flex flex-col-reverse items-end gap-3"
      style={{ bottom: "calc(var(--spacing-nav) + env(safe-area-inset-bottom) + 16px)" }}
    >
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={labels.fabLabel}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ember text-ink shadow-lg shadow-ember/25"
      >
        <motion.span
          animate={reduced ? undefined : { rotate: open ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="flex items-center justify-center"
        >
          {open ? <X size={26} weight="bold" /> : <ChatCircleDots size={26} weight="fill" />}
        </motion.span>
      </button>

      <AnimatePresence>
        {open
          ? actions.map((action, index) => (
              <motion.a
                key={action.key}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 320, damping: 26, delay: reduced ? 0 : index * 0.04 }}
                className="flex min-h-[48px] items-center gap-3 rounded-full border border-hairline bg-ink-raised/95 py-2 pl-4 pr-3 backdrop-blur-xl"
              >
                <span className="text-sm font-medium">{action.label}</span>
                {/* eslint-disable-next-line @next/next/no-img-element -- logo de brand static, dimensiuni fixe, fara beneficiu din optimizare */}
                <img src={action.icon} alt="" width={28} height={28} aria-hidden="true" />
              </motion.a>
            ))
          : null}
      </AnimatePresence>
    </div>
  );
}
