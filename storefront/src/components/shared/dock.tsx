"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface DockProps {
  children: React.ReactNode;
  className?: string;
  magnification?: number;
  distance?: number;
}

/**
 * macOS-style dock with magnification on hover.
 * Items scale up when cursor is near, creating a fisheye lens effect.
 */
export function Dock({
  children,
  className,
  magnification = 1.5,
  distance = 100,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex items-end gap-2 rounded-2xl border bg-card/80 px-3 py-2 backdrop-blur-xl",
        className
      )}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <DockItem key={i} mouseX={mouseX} magnification={magnification} distance={distance}>
              {child}
            </DockItem>
          ))
        : children}
    </motion.div>
  );
}

function DockItem({
  children,
  mouseX,
  magnification,
  distance,
}: {
  children: React.ReactNode;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  magnification: number;
  distance: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseDistance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const scale = useSpring(
    useTransform(mouseDistance, [-distance, 0, distance], [1, magnification, 1]),
    { mass: 0.1, stiffness: 300, damping: 15 }
  );

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      className="flex aspect-square w-10 items-center justify-center rounded-xl"
    >
      {children}
    </motion.div>
  );
}
