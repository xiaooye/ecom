import { cn } from "@/lib/utils";

interface NoiseOverlayProps {
  className?: string;
  opacity?: number;
}

/**
 * SVG noise texture overlay for adding grain to sections.
 * Adds analog warmth to gradients and hero sections.
 */
export function NoiseOverlay({ className, opacity = 0.04 }: NoiseOverlayProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ opacity }}
    >
      <svg className="h-full w-full">
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>
    </div>
  );
}
