import { cn } from "@/lib/utils";

interface PulseDotProps {
  color?: "green" | "red" | "amber" | "blue";
  className?: string;
}

const colors = {
  green: "bg-green-500",
  red: "bg-red-500",
  amber: "bg-amber-500",
  blue: "bg-blue-500",
};

export function PulseDot({ color = "green", className }: PulseDotProps) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          colors[color]
        )}
      />
      <span
        className={cn(
          "relative inline-flex h-2 w-2 rounded-full",
          colors[color]
        )}
      />
    </span>
  );
}
