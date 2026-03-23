import { cn } from "@/lib/utils";

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  gradient?: string;
}

/**
 * Card wrapper with animated gradient border effect.
 * Uses pseudo-element background trick for smooth gradient borders.
 */
export function GradientBorder({
  children,
  className,
  borderWidth = 1,
  gradient = "from-primary via-primary/50 to-primary",
}: GradientBorderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r",
          gradient
        )}
      />
      <div
        className="relative rounded-xl bg-background"
        style={{
          margin: borderWidth,
        }}
      >
        {children}
      </div>
    </div>
  );
}
