import { cn } from "@/lib/utils";

interface DividerWithTextProps {
  text: string;
  className?: string;
}

export function DividerWithText({ text, className }: DividerWithTextProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {text}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
