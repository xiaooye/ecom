"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/format-price";

interface PriceTickerProps {
  amount: number;
  currencyCode?: string;
  className?: string;
}

/**
 * Animated price that slides up/down when value changes.
 * Creates a stock-ticker-like effect for dynamic pricing.
 */
export function PriceTicker({
  amount,
  currencyCode = "usd",
  className,
}: PriceTickerProps) {
  return (
    <span className={className}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={amount}
          initial={{ y: 12, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -12, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="inline-block"
        >
          {formatPrice(amount, currencyCode)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
