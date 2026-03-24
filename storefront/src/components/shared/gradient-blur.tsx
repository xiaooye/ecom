import { cn } from "@/lib/utils";

interface GradientBlurProps {
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  intensity?: number;
}

/**
 * Gradient blur edge effect.
 * Applies progressive blur at the edge of a container for smooth content fade.
 */
export function GradientBlur({
  position = "bottom",
  className,
  intensity = 4,
}: GradientBlurProps) {
  const positionClasses = {
    top: "inset-x-0 top-0 h-20 bg-gradient-to-b",
    bottom: "inset-x-0 bottom-0 h-20 bg-gradient-to-t",
    left: "inset-y-0 left-0 w-20 bg-gradient-to-r",
    right: "inset-y-0 right-0 w-20 bg-gradient-to-l",
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute from-background to-transparent",
        positionClasses[position],
        className
      )}
      style={{ backdropFilter: `blur(${intensity}px)`, mask: "linear-gradient(to top, black, transparent)" }}
    />
  );
}
