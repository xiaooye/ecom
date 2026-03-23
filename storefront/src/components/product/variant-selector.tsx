"use client";

import { cn } from "@/lib/utils";

interface Option {
  id: string;
  title: string;
  values: Array<{ value: string }>;
}

interface VariantSelectorProps {
  options: Option[];
  selectedOptions: Record<string, string>;
  onOptionChange: (title: string, value: string) => void;
}

export function VariantSelector({
  options,
  selectedOptions,
  onOptionChange,
}: VariantSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => (
        <div key={option.id}>
          <h3 className="text-sm font-medium">{option.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {option.values.map((optionValue) => {
              const isSelected =
                selectedOptions[option.title] === optionValue.value;
              return (
                <button
                  key={optionValue.value}
                  onClick={() => onOptionChange(option.title, optionValue.value)}
                  className={cn(
                    "rounded-md border px-4 py-2 text-sm transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input hover:border-primary"
                  )}
                >
                  {optionValue.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
