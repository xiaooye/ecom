import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number;
  originalAmount?: number | null;
  currencyCode?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

export function PriceDisplay({
  amount,
  originalAmount,
  currencyCode = "usd",
  size = "md",
}: PriceDisplayProps) {
  const isOnSale = originalAmount != null && originalAmount > amount;

  return (
    <div className="flex items-baseline gap-2">
      <span className={cn("font-semibold", sizeClasses[size])}>
        {formatPrice(amount, currencyCode)}
      </span>
      {isOnSale && (
        <>
          <span
            className={cn(
              "text-muted-foreground line-through",
              size === "lg" ? "text-base" : "text-sm"
            )}
          >
            {formatPrice(originalAmount, currencyCode)}
          </span>
          <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {Math.round(((originalAmount - amount) / originalAmount) * 100)}%
            OFF
          </span>
        </>
      )}
    </div>
  );
}
