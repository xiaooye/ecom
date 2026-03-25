"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AspectRatioImageProps {
  src: string;
  alt: string;
  /** Width of the full image */
  width: number;
  /** Height of the full image */
  height: number;
  /** Aspect ratio as "width/height", e.g. "16/9", "4/3", "1/1" */
  aspectRatio?: string;
  /** Base64 data URL for the LQIP blur placeholder */
  blurDataURL?: string;
  /** Light/dark/warm toned auto-generated placeholder if no blurDataURL provided */
  placeholderTone?: "light" | "dark" | "warm";
  /** Duration of the crossfade in ms */
  fadeDuration?: number;
  /** Object-fit for the image */
  objectFit?: "cover" | "contain" | "fill";
  className?: string;
  /** Additional props for the container */
  containerClassName?: string;
  priority?: boolean;
}

/**
 * Tiny inline SVG placeholders for when no blurDataURL is provided.
 * These are extremely small data URIs that render as colored rectangles.
 */
const TONE_PLACEHOLDERS: Record<string, string> = {
  light:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+",
  dark: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMjAyMDIwIi8+PC9zdmc+",
  warm: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjVlNmQzIi8+PC9zdmc+",
};

/**
 * Image wrapper that maintains aspect ratio with LQIP (Low Quality Image Placeholder).
 * Renders a tiny blurred version first, then crossfades to full image on load.
 * Uses Next.js Image with placeholder="blur".
 */
export function AspectRatioImage({
  src,
  alt,
  width,
  height,
  aspectRatio = `${width}/${height}`,
  blurDataURL,
  placeholderTone = "light",
  fadeDuration = 500,
  objectFit = "cover",
  className,
  containerClassName,
  priority = false,
}: AspectRatioImageProps) {
  const [loaded, setLoaded] = useState(false);

  const resolvedBlurDataURL =
    blurDataURL || TONE_PLACEHOLDERS[placeholderTone] || TONE_PLACEHOLDERS.light;

  return (
    <div
      className={cn("relative overflow-hidden", containerClassName)}
      style={{ aspectRatio }}
    >
      {/* Blurred placeholder background — visible until image loads */}
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center blur-xl transition-opacity",
          loaded ? "opacity-0" : "opacity-100"
        )}
        style={{
          backgroundImage: `url(${resolvedBlurDataURL})`,
          transitionDuration: `${fadeDuration}ms`,
          transform: "scale(1.1)", // prevent blur edge artifacts
        }}
        aria-hidden
      />

      {/* Actual image with Next.js blur placeholder */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder="blur"
        blurDataURL={resolvedBlurDataURL}
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full transition-opacity",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        style={{
          transitionDuration: `${fadeDuration}ms`,
        }}
      />
    </div>
  );
}
