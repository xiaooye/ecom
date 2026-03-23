"use client";

import { Check, Package, Truck, Home, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface OrderTimelineProps {
  status: OrderStatus;
  createdAt: string;
}

const steps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: Check },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

const statusIndex: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
};

export function OrderTimeline({ status, createdAt }: OrderTimelineProps) {
  const currentIdx = statusIndex[status] ?? 0;

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <Package className="h-5 w-5 text-destructive" />
        <div>
          <p className="font-medium text-destructive">Order Cancelled</p>
          <p className="text-sm text-muted-foreground">
            This order was cancelled on{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold">Order Status</h3>
      <div className="relative">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex gap-4">
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-10 w-0.5",
                      idx < currentIdx ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>

              {/* Label */}
              <div className="flex flex-col justify-center pb-10 last:pb-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(createdAt).toLocaleDateString()} — Current status
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
