import type { Locale } from "@/content/types";

/**
 * Steagurile sunt desenate ca SVG, nu scrise ca emoji: pe Windows emoji-urile de
 * steag nu au glif si se afiseaza ca doua litere, exact lucrul pe care steagul ar
 * trebui sa il inlocuiasca.
 *
 * Sunt pur decorative, eticheta o da textul de langa ele.
 */
export function Flag({ locale }: { locale: Locale }) {
  const shared = "block h-4 w-6 shrink-0 rounded-[3px] ring-1 ring-bone/20";

  if (locale === "ro") {
    return (
      <svg viewBox="0 0 3 2" className={shared} aria-hidden="true" focusable="false">
        <rect width="3" height="2" fill="#ce1126" />
        <rect width="2" height="2" fill="#fcd116" />
        <rect width="1" height="2" fill="#002b7f" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 60 30"
      preserveAspectRatio="xMidYMid slice"
      className={shared}
      aria-hidden="true"
      focusable="false"
    >
      <clipPath id="flag-en-diagonals">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#f2efe9" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath="url(#flag-en-diagonals)"
        stroke="#c8102e"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#f2efe9" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}
