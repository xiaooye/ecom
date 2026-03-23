"use client";

import { Check, Mail, Truck, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "information" | "shipping" | "payment";

const steps: { key: Step; label: string; icon: typeof Mail }[] = [
  { key: "information", label: "Information", icon: Mail },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "payment", label: "Payment", icon: CreditCard },
];

const stepIndex = { information: 0, shipping: 1, payment: 2 };

export function CheckoutStepper({ currentStep }: { currentStep: Step }) {
  const currentIdx = stepIndex[currentStep];

  return (
    <div className="mb-8 flex items-center justify-between">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const Icon = isCompleted ? Check : step.icon;

        return (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isCurrent
                    ? "text-primary"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="mx-2 mb-5 h-0.5 flex-1">
                <div
                  className={cn(
                    "h-full rounded-full transition-colors",
                    idx < currentIdx ? "bg-primary" : "bg-muted"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
