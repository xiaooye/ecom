"use client";

import { cn } from "@/lib/utils";

interface GlowEffectProps {
  children: React.ReactNode;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "shadow-[0_0_15px_var(--glow-color)]",
  md: "shadow-[0_0_30px_var(--glow-color)]",
  lg: "shadow-[0_0_60px_var(--glow-color)]",
};

/**
 * Adds a colored glow/halo effect around an element.
 * Creates neon-like illumination for CTAs and featured content.
 */
export function GlowEffect({
  children,
  color = "rgba(99, 102, 241, 0.5)",
  size = "md",
  className,
}: GlowEffectProps) {
  return (
    <div
      className={cn("relative rounded-xl transition-shadow hover:shadow-lg", sizeMap[size], className)}
      style={{ "--glow-color": color } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
