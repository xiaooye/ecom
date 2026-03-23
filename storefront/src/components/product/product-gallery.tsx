"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: Array<{ url: string }>;
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-muted-foreground">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[selectedIndex].url}
          alt={`${title} - Image ${selectedIndex + 1}`}
          width={800}
          height={800}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2",
                selectedIndex === index
                  ? "border-primary"
                  : "border-transparent"
              )}
            >
              <Image
                src={image.url}
                alt={`${title} thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
