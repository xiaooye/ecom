"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

/**
 * Vertical progress steps indicator.
 * Supports completed, current, and upcoming states.
 */
export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <div key={idx} className="flex gap-3">
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "var(--color-primary)"
                    : isCurrent
                      ? "var(--color-primary)"
                      : "var(--color-muted)",
                }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                  (isCompleted || isCurrent) ? "text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
              </motion.div>
              {idx < steps.length - 1 && (
                <div className={cn(
                  "h-8 w-0.5",
                  isCompleted ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
            <div className="pb-8 pt-1">
              <p className={cn(
                "text-sm font-medium",
                isCurrent ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </p>
              {step.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
