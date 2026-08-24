"use client";

import { useCallback, type CSSProperties, type ReactNode } from "react";

/*
  Un singur observator pentru toata pagina. Zeci de instante ar fi insemnat zeci de
  observatori, fiecare cu propriul calcul de intersectie la fiecare cadru de derulare.
  Elementul e scos din observatie imediat ce a intrat: intrarea se joaca o data.
*/
let shared: IntersectionObserver | null = null;

function observer(): IntersectionObserver {
  shared ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        shared?.unobserve(entry.target);
      }
    },
    // Declanseaza cu putin inainte ca elementul sa fie complet in cadru, ca miscarea
    // sa se termine cam cand ajunge in dreptul privirii.
    { rootMargin: "0px 0px -12% 0px", threshold: 0 },
  );
  return shared;
}

interface RevealProps {
  children: ReactNode;
  /** Decalaj in milisecunde, pentru liste care intra esalonat. */
  delay?: number;
  /** Elementul randat. `li` cand invelisul sta direct sub `ol` sau `ul`. */
  as?: "div" | "li";
  className?: string;
}

/**
 * Intrare la scroll: opacitate, ridicare si un strop de neclaritate care se limpezeste.
 *
 * Declansata de `IntersectionObserver`, nu de `animation-timeline: view()`. Varianta
 * dinainte lega progresul animatiei de pozitia derularii, deci viteza miscarii era
 * viteza degetului: la o derulare normala intrarea se termina inainte ca elementul sa
 * ajunga in dreptul privirii, si practic nu se vedea nimic. Acum derularea doar
 * declanseaza, iar miscarea isi tine durata ei. In plus merge si in Firefox si pe
 * iOS mai vechi, unde cronologiile de derulare nu exista deloc.
 *
 * Continutul e vizibil implicit. Starea ascunsa e legata de clasa `js` de pe `<html>`,
 * pusa de un script din `<head>`, deci fara JavaScript nu exista situatia „a ramas la
 * opacitate zero pentru ca observatorul n-a pornit".
 */
export function Reveal({ children, delay = 0, as = "div", className = "" }: RevealProps) {
  // Ref-functie cu curatare, nu `useRef` plus efect: observatia porneste chiar cand
  // elementul ajunge in DOM si se opreste cand pleaca, fara un pas intermediar.
  const attach = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const io = observer();
    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  const shared = {
    className: `reveal ${className}`,
    style: { "--reveal-delay": `${delay}ms` } as CSSProperties,
  };

  return as === "li" ? (
    <li ref={attach} {...shared}>
      {children}
    </li>
  ) : (
    <div ref={attach} {...shared}>
      {children}
    </div>
  );
}
