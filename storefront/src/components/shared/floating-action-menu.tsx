"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  ShoppingCart,
  Heart,
  ArrowLeftRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FloatingActionMenuProps {
  className?: string;
  actions?: FloatingAction[];
}

const defaultActions: FloatingAction[] = [
  {
    icon: <ShoppingCart className="h-5 w-5" />,
    label: "Cart",
    onClick: () => {},
  },
  {
    icon: <Heart className="h-5 w-5" />,
    label: "Wishlist",
    onClick: () => {},
  },
  {
    icon: <ArrowLeftRight className="h-5 w-5" />,
    label: "Compare",
    onClick: () => {},
  },
  {
    icon: <Search className="h-5 w-5" />,
    label: "Search",
    onClick: () => {},
  },
];

/**
 * Floating action button (bottom-right) that expands into a radial menu
 * of action icons using framer-motion spring animations.
 * Items fan out in a quarter circle.
 */
export function FloatingActionMenu({
  className,
  actions = defaultActions,
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  // Quarter-circle angles: from 180deg (left) to 270deg (up)
  const totalAngle = Math.PI / 2; // 90 degrees
  const startAngle = Math.PI; // 180 degrees (pointing left)
  const radius = 80;

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Action items */}
      <AnimatePresence>
        {isOpen &&
          actions.map((action, i) => {
            const angle =
              startAngle +
              (actions.length > 1
                ? (i / (actions.length - 1)) * totalAngle
                : 0);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                animate={{
                  opacity: 1,
                  x,
                  y,
                  scale: 1,
                }}
                exit={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 22,
                  delay: i * 0.05,
                }}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
                aria-label={action.label}
                title={action.label}
              >
                {action.icon}
              </motion.button>
            );
          })}
      </AnimatePresence>

      {/* Main FAB trigger */}
      <motion.button
        onClick={toggle}
        animate={{ rotate: isOpen ? 135 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-colors hover:bg-primary/90"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
