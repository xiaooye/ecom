import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
  border?: boolean;
  noise?: boolean;
}

const blurMap = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

/**
 * Glassmorphism card with frosted glass effect.
 * Supports configurable blur, opacity, gradient border, and noise texture.
 */
export function GlassCard({
  children,
  className,
  blur = "lg",
  opacity = 0.6,
  border = true,
  noise = true,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        blurMap[blur],
        border && "border border-white/20 dark:border-white/10",
        className
      )}
      style={{
        backgroundColor: `rgba(var(--glass-bg, 255 255 255) / ${opacity})`,
      }}
    >
      {/* Noise texture overlay */}
      {noise && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Gradient shine */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
