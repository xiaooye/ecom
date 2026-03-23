"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ColorPreviewProps {
  colors: string[];
  maxVisible?: number;
}

const colorMap: Record<string, string> = {
  black: "#000", white: "#fff", navy: "#1e3a5f", red: "#dc2626",
  blue: "#2563eb", green: "#16a34a", gray: "#6b7280", brown: "#92400e",
  pink: "#ec4899", beige: "#d4c5a9", olive: "#808000",
};

/**
 * Small color dot preview shown on product cards.
 */
export function ColorPreview({ colors, maxVisible = 4 }: ColorPreviewProps) {
  const visible = colors.slice(0, maxVisible);
  const remaining = colors.length - maxVisible;

  return (
    <div className="flex items-center gap-1">
      {visible.map((color) => (
        <motion.span
          key={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "h-3 w-3 rounded-full border border-gray-200",
            color.toLowerCase() === "white" && "border-gray-300"
          )}
          style={{
            backgroundColor: colorMap[color.toLowerCase()] || "#888",
          }}
          title={color}
        />
      ))}
      {remaining > 0 && (
        <span className="text-[10px] text-muted-foreground">+{remaining}</span>
      )}
    </div>
  );
}
