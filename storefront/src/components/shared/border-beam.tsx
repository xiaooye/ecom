"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

/**
 * Animated border beam effect.
 * A light travels around the border of a card continuously.
 */
export function BorderBeam({
  className,
  size = 200,
  duration = 12,
  delay = 0,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className
      )}
      style={{
        mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        maskComposite: "exclude",
        padding: "1px",
      }}
    >
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: `conic-gradient(from calc(var(--beam-angle, 0) * 1deg), transparent, ${colorFrom}, ${colorTo}, transparent)`,
          animation: `border-beam ${duration}s linear ${delay}s infinite`,
        }}
      />
      <style>{`
        @keyframes border-beam {
          from { --beam-angle: 0; }
          to { --beam-angle: 360; }
        }
        @property --beam-angle {
          syntax: "<number>";
          inherits: false;
          initial-value: 0;
        }
      `}</style>
    </div>
  );
}
