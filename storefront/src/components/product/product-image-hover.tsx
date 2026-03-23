"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageHoverProps {
  primaryImage: string;
  secondaryImage?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Product image that swaps to a secondary image on hover.
 * Creates a subtle reveal effect seen on premium fashion sites.
 */
export function ProductImageHover({
  primaryImage,
  secondaryImage,
  alt,
  width = 400,
  height = 533,
  className,
}: ProductImageHoverProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={primaryImage}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "h-full w-full object-cover transition-all duration-500",
          hovered && secondaryImage ? "opacity-0 scale-105" : "opacity-100"
        )}
      />
      {secondaryImage && (
        <Image
          src={secondaryImage}
          alt={`${alt} - alternate view`}
          width={width}
          height={height}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-all duration-500",
            hovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        />
      )}
    </div>
  );
}
