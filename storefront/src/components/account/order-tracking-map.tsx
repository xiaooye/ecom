"use client";

import { motion } from "framer-motion";
import { MapPin, Package, Home, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTrackingMapProps {
  status: "processing" | "shipped" | "out-for-delivery" | "delivered";
  className?: string;
}

const stages = [
  { key: "processing", icon: Package, label: "Warehouse", x: 10 },
  { key: "shipped", icon: Truck, label: "In Transit", x: 37 },
  { key: "out-for-delivery", icon: MapPin, label: "Local Hub", x: 63 },
  { key: "delivered", icon: Home, label: "Delivered", x: 90 },
];

const statusIndex: Record<string, number> = {
  processing: 0,
  shipped: 1,
  "out-for-delivery": 2,
  delivered: 3,
};

/**
 * Visual order tracking map showing package journey.
 * Animated progress line connecting warehouse → transit → hub → home.
 */
export function OrderTrackingMap({ status, className }: OrderTrackingMapProps) {
  const currentIdx = statusIndex[status];
  const progress = (currentIdx / (stages.length - 1)) * 100;

  return (
    <div className={cn("rounded-xl border bg-gradient-to-br from-muted/30 to-muted/60 p-6", className)}>
      <h3 className="mb-6 text-sm font-semibold">Package Journey</h3>

      <div className="relative">
        {/* Track line */}
        <div className="absolute left-[5%] right-[5%] top-5 h-1 rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        {/* Animated truck on progress */}
        {status !== "delivered" && (
          <motion.div
            className="absolute -top-0.5 z-10"
            initial={{ left: "5%" }}
            animate={{ left: `${5 + progress * 0.9}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Truck className="h-3 w-3" />
            </div>
          </motion.div>
        )}

        {/* Stage markers */}
        <div className="relative flex justify-between">
          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.15 : 1 }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                <span
                  className={cn(
                    "mt-2 text-[10px] font-medium",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
