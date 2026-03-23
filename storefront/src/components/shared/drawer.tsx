"use client";

import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: "bottom" | "right";
  className?: string;
}

/**
 * Mobile-friendly drawer with drag-to-close gesture.
 * Bottom drawer on mobile, side panel on desktop.
 */
export function Drawer({
  open,
  onClose,
  children,
  title,
  side = "bottom",
  className,
}: DrawerProps) {
  const dragControls = useDragControls();

  const variants = {
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
      drag: "y" as const,
      dragConstraints: { top: 0 },
    },
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
      drag: "x" as const,
      dragConstraints: { left: 0 },
    },
  };

  const v = variants[side];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag={v.drag}
            dragControls={dragControls}
            dragConstraints={v.dragConstraints}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const threshold = side === "bottom" ? info.offset.y > 100 : info.offset.x > 100;
              if (threshold) onClose();
            }}
            className={cn(
              "fixed z-50 bg-background shadow-xl",
              side === "bottom" && "inset-x-0 bottom-0 rounded-t-2xl",
              side === "right" && "inset-y-0 right-0 w-full max-w-md",
              className
            )}
          >
            {/* Drag handle (bottom drawer) */}
            {side === "bottom" && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
