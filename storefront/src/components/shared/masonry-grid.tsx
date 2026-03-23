"use client";

import { cn } from "@/lib/utils";

interface MasonryGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

/**
 * CSS-only masonry grid layout using CSS columns.
 * Avoids JS layout calculations for better performance.
 */
export function MasonryGrid({
  children,
  columns = 3,
  gap = 16,
  className,
}: MasonryGridProps) {
  return (
    <div
      className={cn("w-full", className)}
      style={{
        columnCount: columns,
        columnGap: gap,
      }}
    >
      {children}
    </div>
  );
}

export function MasonryItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mb-4 break-inside-avoid", className)}
      style={{ breakInside: "avoid" }}
    >
      {children}
    </div>
  );
}
