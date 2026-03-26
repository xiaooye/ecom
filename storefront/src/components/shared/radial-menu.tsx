"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface RadialMenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

interface RadialMenuProps {
  items: RadialMenuItem[];
  children: ReactNode;
  /** Radius of the pie menu in px (default 120) */
  radius?: number;
  className?: string;
  /** Minimum distance from centre to register a hover (default 30) */
  innerDeadzone?: number;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * Right-click radial / pie menu.
 * Items arranged in a circle; selection is based on cursor angle from centre.
 */
export function RadialMenu({
  items,
  children,
  radius = 120,
  className,
  innerDeadzone = 30,
}: RadialMenuProps) {
  const [open, setOpen] = useState(false);
  const [centre, setCentre] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Open on context menu */
  const handleContext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setCentre({ x: e.clientX, y: e.clientY });
      setOpen(true);
      setHovered(null);
    },
    [],
  );

  /* Track cursor angle to determine hovered slice */
  useEffect(() => {
    if (!open) return;

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - centre.x;
      const dy = e.clientY - centre.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < innerDeadzone) {
        setHovered(null);
        return;
      }

      // angle in degrees, 0 = right, clockwise
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (angle < 0) angle += 360;

      const sliceSize = 360 / items.length;
      const idx = Math.floor(((angle + sliceSize / 2) % 360) / sliceSize);
      const item = items[idx];
      setHovered(item && !item.disabled ? item.id : null);
    };

    const onUp = () => {
      if (hovered) {
        const item = items.find((i) => i.id === hovered);
        item?.onSelect?.();
      }
      setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, centre, items, hovered, innerDeadzone]);

  /* Close if user clicks outside */
  useEffect(() => {
    if (!open) return;
    const onClick = () => setOpen(false);
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [open]);

  const sliceAngle = 360 / items.length;

  return (
    <div className={cn("relative", className)} onContextMenu={handleContext}>
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            className="fixed z-[100]"
            style={{ left: centre.x, top: centre.y }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {items.map((item, i) => {
              const angle = (sliceAngle * i * Math.PI) / 180;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isHovered = hovered === item.id;

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1",
                    item.disabled && "pointer-events-none opacity-40",
                  )}
                  style={{ left: x, top: y }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <motion.div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border bg-background shadow-lg transition-colors",
                      isHovered && "border-primary bg-primary text-primary-foreground",
                    )}
                    animate={{ scale: isHovered ? 1.2 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span
                    className={cn(
                      "whitespace-nowrap rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium shadow transition-colors",
                      isHovered && "bg-primary text-primary-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </motion.div>
              );
            })}

            {/* Centre dot */}
            <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-muted-foreground/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
