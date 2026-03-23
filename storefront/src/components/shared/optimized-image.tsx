"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getPlaceholderBlur } from "@/lib/thumbhash";

interface OptimizedImageProps extends Omit<ImageProps, "placeholder" | "blurDataURL"> {
  placeholderType?: "light" | "dark" | "warm";
  fadeIn?: boolean;
}

/**
 * Optimized Image component with WASM-powered ThumbHash blur placeholders
 * and fade-in loading transition.
 */
export function OptimizedImage({
  placeholderType = "light",
  fadeIn = true,
  className,
  alt,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const blurDataURL = getPlaceholderBlur(placeholderType);

  return (
    <Image
      {...props}
      alt={alt}
      placeholder="blur"
      blurDataURL={blurDataURL}
      className={cn(
        className,
        fadeIn && "transition-opacity duration-500",
        fadeIn && !loaded && "opacity-0",
        fadeIn && loaded && "opacity-100"
      )}
      onLoad={() => setLoaded(true)}
    />
  );
}
