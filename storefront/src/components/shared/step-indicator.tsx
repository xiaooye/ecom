"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

/**
 * Horizontal step indicator with animated connecting lines.
 * Smooth progress animation between steps.
 */
export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center">
          {/* Circle */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                scale: idx === currentStep ? 1.1 : 1,
                backgroundColor:
                  idx <= currentStep
                    ? "var(--color-primary)"
                    : "var(--color-muted)",
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                idx <= currentStep
                  ? "text-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
            </motion.div>
            <span
              className={cn(
                "mt-1.5 text-[10px] font-medium",
                idx <= currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>

          {/* Connector */}
          {idx < steps.length - 1 && (
            <div className="mx-2 mb-5 h-0.5 w-12 overflow-hidden bg-muted sm:w-20">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{
                  width: idx < currentStep ? "100%" : "0%",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
