import Link from "next/link";
import type { ReactNode } from "react";

interface CtaButtonProps {
  href: string;
  variant?: "primary" | "ghost";
  external?: boolean;
  children: ReactNode;
}

const STYLES = {
  primary: "bg-ember text-ink hover:brightness-110",
  ghost: "border border-hairline text-bone hover:border-bone/40",
} as const;

export function CtaButton({
  href,
  variant = "primary",
  external = false,
  children,
}: CtaButtonProps) {
  const className = `inline-flex min-h-[52px] items-center justify-center rounded-full px-7 text-base font-semibold transition-[filter,border-color] duration-200 ${STYLES[variant]}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
