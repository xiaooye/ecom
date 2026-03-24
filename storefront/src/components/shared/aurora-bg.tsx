"use client";

import { cn } from "@/lib/utils";

interface AuroraBgProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Aurora / Northern Lights background effect.
 * Uses CSS animations with blur and gradient overlay for
 * a mesmerizing ambient lighting effect.
 */
export function AuroraBg({ children, className }: AuroraBgProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Aurora layers */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -inset-[10%] opacity-50"
          style={{
            background:
              "repeating-linear-gradient(100deg, #4f46e5 10%, #7c3aed 15%, #2563eb 20%, #06b6d4 25%, #4f46e5 30%)",
            backgroundSize: "200% 200%",
            animation: "aurora 15s ease infinite",
            filter: "blur(60px) saturate(1.5)",
          }}
        />
        <div
          className="absolute -inset-[10%] opacity-30"
          style={{
            background:
              "repeating-linear-gradient(100deg, #06b6d4 10%, #22c55e 15%, #eab308 20%, #f43f5e 25%, #06b6d4 30%)",
            backgroundSize: "200% 200%",
            animation: "aurora 20s ease infinite reverse",
            filter: "blur(80px) saturate(1.2)",
          }}
        />
      </div>

      <style>{`
        @keyframes aurora {
          0%, 100% { background-position: 50% 50%; }
          25% { background-position: 0% 100%; }
          50% { background-position: 100% 0%; }
          75% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
