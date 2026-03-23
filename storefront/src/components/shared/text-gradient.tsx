import { cn } from "@/lib/utils";

interface TextGradientProps {
  children: React.ReactNode;
  from?: string;
  to?: string;
  className?: string;
}

export function TextGradient({
  children,
  from = "from-primary",
  to = "to-primary/60",
  className,
}: TextGradientProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        from,
        to,
        className
      )}
    >
      {children}
    </span>
  );
}
