import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

/**
 * SVG grid pattern background overlay.
 * Creates a subtle grid texture for hero sections and backgrounds.
 */
export function GridPattern({
  className,
  width = 40,
  height = 40,
  strokeWidth = 1,
}: GridPatternProps) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
}
