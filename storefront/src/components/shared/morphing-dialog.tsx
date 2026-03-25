"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MorphingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

interface MorphingDialogTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  layoutId: string;
}

interface MorphingDialogContentProps {
  children: React.ReactNode;
  className?: string;
  layoutId: string;
}

/**
 * Trigger element that morphs into the dialog.
 * Wrap the card or element that should expand into the dialog.
 */
export function MorphingDialogTrigger({
  children,
  className,
  onClick,
  layoutId,
}: MorphingDialogTriggerProps) {
  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      className={cn("cursor-pointer", className)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Dialog content that the trigger morphs into.
 * Must share the same layoutId as MorphingDialogTrigger.
 */
export function MorphingDialogContent({
  children,
  className,
  layoutId,
}: MorphingDialogContentProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className={cn(
        "relative w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/**
 * Dialog that morphs from a trigger element using shared layout animation.
 * Click a card, it smoothly expands into a full dialog. Close reverses the morph.
 */
export function MorphingDialog({
  open,
  onOpenChange,
  children,
  className,
}: MorphingDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className={cn("fixed inset-0 z-50", className)}>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          />

          {/* Dialog container */}
          <div className="relative flex h-full items-center justify-center p-4">
            <div className="relative">
              {children}

              {/* Close button */}
              <motion.button
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
                onClick={handleClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15 }}
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to generate a unique layoutId for a morphing dialog pair.
 */
export function useMorphingDialogId(prefix?: string) {
  const reactId = useId();
  return `${prefix ?? "morphing-dialog"}-${reactId}`;
}
