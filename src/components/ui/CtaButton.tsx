import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactNode } from "react";
import { CTA_BASE, CTA_VARIANTS, type CtaVariant } from "@/components/ui/ctaStyles";

interface CtaButtonProps {
  href: string;
  variant?: CtaVariant;
  external?: boolean;
  children: ReactNode;
}

/** Sageata e singura miscare din buton; restul e schimbare de culoare. */
export function CtaArrow() {
  return (
    <ArrowUpRight
      size={18}
      weight="bold"
      aria-hidden="true"
      className="transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    />
  );
}

export function CtaButton({
  href,
  variant = "primary",
  external = false,
  children,
}: CtaButtonProps) {
  const className = `${CTA_BASE} ${CTA_VARIANTS[variant]}`;
  const label = (
    <>
      {children}
      <CtaArrow />
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
