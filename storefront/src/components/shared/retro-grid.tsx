import { cn } from "@/lib/utils";

interface RetroGridProps {
  className?: string;
  angle?: number;
}

/**
 * Retro perspective grid background.
 * Creates a vaporwave/80s-style perspective grid effect.
 */
export function RetroGrid({ className, angle = 65 }: RetroGridProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]",
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `rotateX(${angle}deg)`,
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 0),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 0)
          `,
          backgroundSize: "60px 40px",
          backgroundRepeat: "repeat",
          transformOrigin: "bottom",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
