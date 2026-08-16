import type { CSSProperties, ReactNode } from "react";

/**
 * Intrare la scroll, fara nicio linie de JavaScript: animatia e condusa de
 * `animation-timeline: view()` in globals.css, protejata de `@supports`.
 *
 * Consecinta importanta: intr-un browser fara suport, sau cu JS dezactivat, sau
 * pentru un crawler care nu executa JS, continutul e pur si simplu vizibil. Nu
 * exista starea „a ramas la opacity: 0 pentru ca observer-ul n-a pornit".
 *
 * `delay` decaleaza inceputul intervalului de scroll, ca elementele dintr-o lista
 * sa intre esalonat.
 */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const style = { "--reveal-shift": `${Math.round(delay * 100)}%` } as CSSProperties;
  return (
    <div className="reveal" style={style}>
      {children}
    </div>
  );
}
