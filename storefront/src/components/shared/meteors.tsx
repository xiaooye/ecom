"use client";

import { cn } from "@/lib/utils";

interface MeteorsProps {
  count?: number;
  className?: string;
}

/**
 * Animated meteor shower background effect.
 * Diagonal streaking lines that simulate falling stars.
 */
export function Meteors({ count = 20, className }: MeteorsProps) {
  const meteors = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 3 + 2}s`,
    size: Math.random() * 2 + 1,
  }));

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute animate-meteor block rounded-full bg-gradient-to-r from-white/80 to-transparent"
          style={{
            left: meteor.left,
            top: "-5%",
            width: `${meteor.size}px`,
            height: `${meteor.size * 40}px`,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
          }}
        />
      ))}
      <style>{`
        @keyframes meteor {
          0% { transform: translateY(-10%) translateX(0) rotate(-45deg); opacity: 1; }
          100% { transform: translateY(300%) translateX(-200px) rotate(-45deg); opacity: 0; }
        }
        .animate-meteor { animation: meteor linear infinite; }
      `}</style>
    </div>
  );
}
