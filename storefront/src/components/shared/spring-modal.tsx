"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpringModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Spring-animated modal with scale-bounce entrance.
 * More dynamic feel than standard dialog transitions.
 */
export function SpringModal({ open, onClose, children, className }: SpringModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className={cn(
                "relative w-full max-w-lg overflow-hidden rounded-2xl bg-card p-6 shadow-2xl",
                className
              )}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
