import { cn } from "@/lib/utils";

interface ShimmerBorderProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  borderWidth?: string;
  duration?: string;
}

/**
 * Card with a shimmering/moving gradient border effect.
 * Uses CSS animation for smooth, continuous border shimmer.
 */
export function ShimmerBorder({
  children,
  className,
  shimmerColor = "#ffffff33",
  shimmerSize = "0.05em",
  borderRadius = "1rem",
  borderWidth = "1px",
  duration = "4s",
}: ShimmerBorderProps) {
  return (
    <div
      className={cn("relative overflow-hidden p-[1px]", className)}
      style={{
        borderRadius,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            var(--shimmer-angle, 0deg),
            transparent 40%,
            ${shimmerColor} 50%,
            transparent 60%
          )`,
          animation: `shimmer-border ${duration} linear infinite`,
          borderRadius,
        }}
      />
      <div
        className="relative bg-card"
        style={{ borderRadius: `calc(${borderRadius} - ${borderWidth})` }}
      >
        {children}
      </div>
      <style>{`
        @keyframes shimmer-border {
          from { --shimmer-angle: 0deg; }
          to { --shimmer-angle: 360deg; }
        }
        @property --shimmer-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
      `}</style>
    </div>
  );
}
