import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  className?: string;
  text?: string;
}

/**
 * Visually appealing placeholder when no product image is available.
 * Uses gradient background with centered icon instead of plain gray.
 */
export function ImagePlaceholder({
  className,
  text = "No image",
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/60",
        className
      )}
    >
      <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
      <span className="mt-1 text-xs text-muted-foreground/50">{text}</span>
    </div>
  );
}
