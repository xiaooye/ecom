"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export function TruncatedText({
  text,
  maxLength = 200,
  className,
}: TruncatedTextProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;

  return (
    <div className={className}>
      <p className={cn("text-sm leading-relaxed text-muted-foreground")}>
        {expanded || !shouldTruncate ? text : `${text.slice(0, maxLength)}...`}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
