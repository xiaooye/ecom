import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
};

export function BrandLogo({ className, size = "md" }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "font-bold tracking-tight",
        sizeMap[size],
        className
      )}
    >
      Web<span className="text-primary">Store</span>
    </span>
  );
}
