import { cn } from "@/lib/utils";

interface DotPatternProps {
  className?: string;
  spacing?: number;
  radius?: number;
}

/**
 * SVG dot pattern background.
 * Subtle, modern alternative to grid patterns.
 */
export function DotPattern({
  className,
  spacing = 20,
  radius = 1,
}: DotPatternProps) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dot-pattern"
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={spacing / 2}
            cy={spacing / 2}
            r={radius}
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
  );
}
