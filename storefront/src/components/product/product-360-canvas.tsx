"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { RotateCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product360CanvasProps {
  /** Array of image URLs representing each frame of the 360 rotation */
  frames: string[];
  /** Alt text for accessibility */
  alt?: string;
  /** Pixels of drag movement per frame change (default: 5) */
  sensitivity?: number;
  /** Whether to auto-rotate on load (default: false) */
  autoRotate?: boolean;
  /** Auto-rotation speed in frames per second (default: 12) */
  autoRotateSpeed?: number;
  className?: string;
}

/**
 * Canvas-based 360 degree product viewer that preloads image frames and renders
 * them on Canvas for smoother performance than DOM image swapping.
 * Shows loading progress bar during preload. Touch/mouse drag to rotate.
 */
export function Product360Canvas({
  frames,
  alt = "360° product view",
  sensitivity = 5,
  autoRotate = false,
  autoRotateSpeed = 12,
  className,
}: Product360CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastX = useRef(0);
  const autoRotateRef = useRef<number | null>(null);
  const totalFrames = frames.length;

  // Preload all images
  useEffect(() => {
    if (totalFrames === 0) return;

    let loaded = 0;
    const images: HTMLImageElement[] = new Array(totalFrames);
    let cancelled = false;

    const onLoad = () => {
      loaded++;
      if (!cancelled) {
        setLoadProgress(Math.round((loaded / totalFrames) * 100));
        if (loaded === totalFrames) {
          imagesRef.current = images;
          setIsLoaded(true);
        }
      }
    };

    frames.forEach((src, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = onLoad;
      img.onerror = onLoad; // Count errors toward progress so it eventually completes
      img.src = src;
      images[i] = img;
    });

    return () => {
      cancelled = true;
    };
  }, [frames, totalFrames]);

  // Draw current frame on canvas
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || !isLoaded) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = imagesRef.current[frameIndex];
      if (!img || !img.naturalWidth) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = container.offsetWidth;
      const displayHeight = container.offsetHeight;

      if (
        canvas.width !== displayWidth * dpr ||
        canvas.height !== displayHeight * dpr
      ) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Fit image within container while maintaining aspect ratio
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const containerAspect = displayWidth / displayHeight;
      let drawW: number, drawH: number, drawX: number, drawY: number;

      if (imgAspect > containerAspect) {
        drawW = displayWidth;
        drawH = displayWidth / imgAspect;
        drawX = 0;
        drawY = (displayHeight - drawH) / 2;
      } else {
        drawH = displayHeight;
        drawW = displayHeight * imgAspect;
        drawX = (displayWidth - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    },
    [isLoaded]
  );

  // Draw whenever frame changes
  useEffect(() => {
    if (isLoaded) {
      drawFrame(currentFrame);
    }
  }, [currentFrame, isLoaded, drawFrame]);

  // Handle resize
  useEffect(() => {
    if (!isLoaded) return;

    const handleResize = () => drawFrame(currentFrame);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, currentFrame, drawFrame]);

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate || !isLoaded || isDragging) return;

    const intervalMs = 1000 / autoRotateSpeed;
    autoRotateRef.current = window.setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, intervalMs);

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [autoRotate, autoRotateSpeed, isLoaded, isDragging, totalFrames]);

  // Drag handlers
  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    lastX.current = clientX;
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !isLoaded) return;

      const delta = clientX - lastX.current;
      if (Math.abs(delta) >= sensitivity) {
        const frameDelta = Math.round(delta / sensitivity);
        setCurrentFrame((prev) => {
          let next = prev - frameDelta;
          while (next < 0) next += totalFrames;
          return next % totalFrames;
        });
        lastX.current = clientX;
      }
    },
    [isDragging, isLoaded, sensitivity, totalFrames]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (totalFrames === 0) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-square cursor-grab select-none overflow-hidden rounded-xl bg-gray-100 active:cursor-grabbing",
        className
      )}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <div className="w-48">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="mt-1.5 text-center text-xs text-muted-foreground">
              Loading 360° view... {loadProgress}%
            </p>
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className={cn("h-full w-full", !isLoaded && "invisible")}
        role="img"
        aria-label={alt}
      />

      {/* Controls overlay */}
      {isLoaded && (
        <>
          {/* Drag hint */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
            <RotateCw className="h-3 w-3" />
            Drag to rotate
          </div>

          {/* Frame indicator */}
          <div className="absolute right-3 top-3 rounded bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
            {currentFrame + 1}/{totalFrames}
          </div>
        </>
      )}
    </div>
  );
}
