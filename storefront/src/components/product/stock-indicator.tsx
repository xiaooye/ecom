"use client";

import { cn } from "@/lib/utils";

interface StockIndicatorProps {
  quantity?: number;
}

export function StockIndicator({ quantity }: StockIndicatorProps) {
  if (quantity == null) return null;

  if (quantity <= 0) {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        <span className="font-medium text-red-600 dark:text-red-400">Out of Stock</span>
      </div>
    );
  }

  if (quantity <= 5) {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
        <span className="font-medium text-amber-600 dark:text-amber-400">
          Only {quantity} left — order soon
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      <span className="text-green-600 dark:text-green-400">In Stock</span>
    </div>
  );
}
