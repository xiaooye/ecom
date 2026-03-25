import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  /** Duration of one full shimmer sweep in seconds */
  duration?: number;
  /** Base text color */
  color?: string;
  /** Shimmer highlight color */
  shimmerColor?: string;
  /** Render as a different HTML element */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
}

/**
 * Text with a metallic shimmer sweep effect using CSS gradient animation.
 * The shimmer highlight travels across the text continuously, like shiny metal text.
 */
export function TextShimmer({
  children,
  className,
  duration = 2.5,
  color = "currentColor",
  shimmerColor = "rgba(255, 255, 255, 0.9)",
  as: Tag = "span",
}: TextShimmerProps) {
  const animationName = "text-shimmer-sweep";

  return (
    <>
      <Tag
        className={cn(
          "inline-block bg-clip-text text-transparent",
          className
        )}
        style={{
          backgroundImage: `linear-gradient(
            110deg,
            ${color} 35%,
            ${shimmerColor} 50%,
            ${color} 65%
          )`,
          backgroundSize: "250% 100%",
          animation: `${animationName} ${duration}s ease-in-out infinite`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </Tag>
      <style>{`
        @keyframes ${animationName} {
          0% { background-position: 100% center; }
          100% { background-position: -50% center; }
        }
      `}</style>
    </>
  );
}
