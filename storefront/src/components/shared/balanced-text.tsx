"use client";

import Balancer from "react-wrap-balancer";
import { cn } from "@/lib/utils";

interface BalancedTextProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  ratio?: number;
}

/**
 * Text component with visually balanced line wrapping.
 * Prevents awkward single-word orphans at line ends.
 * Especially effective on headings and hero text.
 */
export function BalancedText({
  children,
  as: Tag = "p",
  className,
  ratio = 0.65,
}: BalancedTextProps) {
  return (
    <Tag className={className}>
      <Balancer ratio={ratio}>{children}</Balancer>
    </Tag>
  );
}
