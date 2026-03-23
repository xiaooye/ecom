"use client";

import { Truck } from "lucide-react";

export function DeliveryEstimate() {
  const today = new Date();
  const minDays = 3;
  const maxDays = 5;
  const minDate = new Date(today.getTime() + minDays * 86400000);
  const maxDate = new Date(today.getTime() + maxDays * 86400000);

  const format = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="flex items-center gap-2 text-sm">
      <Truck className="h-4 w-4 text-green-600" />
      <span>
        Get it <strong>{format(minDate)}</strong> – <strong>{format(maxDate)}</strong>
      </span>
    </div>
  );
}
