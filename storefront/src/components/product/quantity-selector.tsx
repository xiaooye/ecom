"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center">
      <span className="mr-3 text-sm font-medium">Quantity</span>
      <div className="flex items-center rounded-lg border">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className={cn(
            "flex h-10 w-10 items-center justify-center transition-colors hover:bg-muted",
            value <= min && "cursor-not-allowed opacity-40"
          )}
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="flex h-10 w-12 items-center justify-center border-x text-sm font-medium">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className={cn(
            "flex h-10 w-10 items-center justify-center transition-colors hover:bg-muted",
            value >= max && "cursor-not-allowed opacity-40"
          )}
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
