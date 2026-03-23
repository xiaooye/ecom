"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TooltipWrapperProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

export function TooltipWrapper({ text, children, className }: TooltipWrapperProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute -top-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md">
          {text}
        </div>
      )}
    </div>
  );
}
