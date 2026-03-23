"use client";

import { motion, useAnimation } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedHeartProps {
  filled: boolean;
  onClick: () => void;
  className?: string;
}

export function AnimatedHeart({ filled, onClick, className }: AnimatedHeartProps) {
  const controls = useAnimation();

  const handleClick = async () => {
    onClick();
    await controls.start({
      scale: [1, 1.4, 0.9, 1.1, 1],
      transition: { duration: 0.4, ease: "easeInOut" },
    });
  };

  return (
    <motion.button
      animate={controls}
      whileTap={{ scale: 0.85 }}
      onClick={handleClick}
      className={cn("relative", className)}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors duration-200",
          filled ? "fill-red-500 text-red-500" : "text-current"
        )}
      />
      {filled && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
        </motion.div>
      )}
    </motion.button>
  );
}
