"use client";

import { Check } from "lucide-react";
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

const colorMap: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#DC2626",
  blue: "#2563EB",
  green: "#16A34A",
  yellow: "#EAB308",
  pink: "#EC4899",
  purple: "#9333EA",
  orange: "#EA580C",
  gray: "#6B7280",
  grey: "#6B7280",
  navy: "#1E3A5F",
  brown: "#92400E",
  beige: "#D4C5A9",
  cream: "#FFFDD0",
  khaki: "#C3B091",
  olive: "#808000",
  teal: "#0D9488",
  maroon: "#800000",
  coral: "#FF7F50",
};

function isColor(value: string): boolean {
  return value.toLowerCase() in colorMap;
}

function getColorHex(value: string): string {
  return colorMap[value.toLowerCase()] || "#888888";
}

export function VariantSelector({
  options,
  selectedOptions,
  onOptionChange,
}: VariantSelectorProps) {
  return (
    <div className="flex flex-col gap-5">
      {options.map((option) => {
        const isColorOption =
          option.title.toLowerCase() === "color" ||
          option.values.every((v) => isColor(v.value));

        return (
          <div key={option.id}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{option.title}</h3>
              {selectedOptions[option.title] && (
                <span className="text-sm text-muted-foreground">
                  — {selectedOptions[option.title]}
                </span>
              )}
            </div>

            <div className="mt-2.5 flex flex-wrap gap-2">
              {option.values.map((optionValue) => {
                const isSelected =
                  selectedOptions[option.title] === optionValue.value;

                if (isColorOption) {
                  const hex = getColorHex(optionValue.value);
                  const isLight =
                    optionValue.value.toLowerCase() === "white" ||
                    optionValue.value.toLowerCase() === "cream" ||
                    optionValue.value.toLowerCase() === "beige";

                  return (
                    <button
                      key={optionValue.value}
                      onClick={() =>
                        onOptionChange(option.title, optionValue.value)
                      }
                      className={cn(
                        "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                        isSelected
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-gray-200 hover:border-gray-400"
                      )}
                      style={{ backgroundColor: hex }}
                      aria-label={optionValue.value}
                      title={optionValue.value}
                    >
                      {isSelected && (
                        <Check
                          className={cn(
                            "h-4 w-4",
                            isLight ? "text-black" : "text-white"
                          )}
                        />
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={optionValue.value}
                    onClick={() =>
                      onOptionChange(option.title, optionValue.value)
                    }
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-input bg-background hover:border-primary hover:bg-muted"
                    )}
                  >
                    {optionValue.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
