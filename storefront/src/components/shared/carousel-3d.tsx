"use client";

import { useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface Carousel3DProps {
  items: ReactNode[];
  /** Distance from centre to item in px (default 320) */
  radius?: number;
  className?: string;
  itemClassName?: string;
  /** Enable auto-rotation (default false) */
  autoRotate?: boolean;
  /** Auto-rotation speed in deg/s (default 15) */
  autoSpeed?: number;
}

/**
 * 3D perspective carousel.
 * Items are arranged in a circle in 3D space using CSS 3D transforms.
 * Drag horizontally to rotate. Centre item is largest; side items shrink
 * and angle away. Framer-motion powers drag + spring physics.
 */
export function Carousel3D({
  items,
  radius = 320,
  className,
  itemClassName,
  autoRotate = false,
  autoSpeed = 15,
}: Carousel3DProps) {
  const count = items.length;
  const sliceAngle = 360 / count;

  const rotationY = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);
  const autoFrameRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  // Keep ref in sync for the rAF callback
  isDraggingRef.current = isDragging;

  const stopAuto = useCallback(() => {
    if (autoFrameRef.current) {
      cancelAnimationFrame(autoFrameRef.current);
      autoFrameRef.current = 0;
    }
    lastTimeRef.current = null;
  }, []);

  const startAuto = useCallback(() => {
    if (!autoRotate) return;
    stopAuto();

    const tick = (ts: number) => {
      if (isDraggingRef.current) {
        lastTimeRef.current = null;
        return;
      }
      if (lastTimeRef.current !== null) {
        const dt = (ts - lastTimeRef.current) / 1000;
        rotationY.set(rotationY.get() + autoSpeed * dt);
      }
      lastTimeRef.current = ts;
      autoFrameRef.current = requestAnimationFrame(tick);
    };

    autoFrameRef.current = requestAnimationFrame(tick);
  }, [autoRotate, autoSpeed, rotationY, stopAuto]);

  useEffect(() => {
    if (autoRotate && !isDragging) {
      startAuto();
    }
    return () => stopAuto();
  }, [autoRotate, isDragging, startAuto, stopAuto]);

  /* Drag handlers */
  const handleDragStart = () => {
    setIsDragging(true);
    stopAuto();
    dragStartRef.current = rotationY.get();
  };

  const handleDrag = (_: unknown, info: { offset: { x: number } }) => {
    rotationY.set(dragStartRef.current + info.offset.x * 0.3);
  };

  const handleDragEnd = (_: unknown, info: { velocity: { x: number } }) => {
    setIsDragging(false);
    const momentum = info.velocity.x * 0.08;
    const raw = rotationY.get() + momentum;
    const snapped = Math.round(raw / sliceAngle) * sliceAngle;
    animate(rotationY, snapped, {
      type: "spring",
      stiffness: 200,
      damping: 25,
    });
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{ perspective: 1000, minHeight: 400 }}
    >
      {/* Drag surface */}
      <motion.div
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />

      {/* Carousel ring */}
      <motion.div
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          width: radius * 2,
          height: 300,
          rotateY: rotationY,
        }}
      >
        {items.map((item, i) => {
          const angle = sliceAngle * i;

          return (
            <CarouselItem
              key={i}
              angle={angle}
              radius={radius}
              rotationY={rotationY}
              className={itemClassName}
            >
              {item}
            </CarouselItem>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface CarouselItemProps {
  angle: number;
  radius: number;
  rotationY: ReturnType<typeof useMotionValue<number>>;
  children: ReactNode;
  className?: string;
}

function CarouselItem({
  angle,
  radius,
  rotationY,
  children,
  className,
}: CarouselItemProps) {
  const itemRotation = useTransform(rotationY, (ry) => angle + ry);

  const scale = useTransform(itemRotation, (r) => {
    const cosVal = Math.cos(((r % 360) * Math.PI) / 180);
    return 0.6 + 0.4 * Math.max(0, cosVal);
  });

  const opacity = useTransform(itemRotation, (r) => {
    const cosVal = Math.cos(((r % 360) * Math.PI) / 180);
    return 0.4 + 0.6 * Math.max(0, cosVal);
  });

  const zIndex = useTransform(itemRotation, (r) => {
    const cosVal = Math.cos(((r % 360) * Math.PI) / 180);
    return Math.round(cosVal * 100);
  });

  const transformStr = useTransform(
    itemRotation,
    (r) => `rotateY(${r}deg) translateZ(${radius}px)`,
  );

  return (
    <motion.div
      className={cn(
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        className,
      )}
      style={{
        transformStyle: "preserve-3d",
        transform: transformStr,
        scale,
        opacity,
        zIndex,
      }}
    >
      {children}
    </motion.div>
  );
}
