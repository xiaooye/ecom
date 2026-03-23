"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownTimer({
  targetDate,
  label = "Sale ends in",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        return;
      }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (expired) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="flex gap-1.5">
        {[
          { value: timeLeft.d, label: "D" },
          { value: timeLeft.h, label: "H" },
          { value: timeLeft.m, label: "M" },
          { value: timeLeft.s, label: "S" },
        ].map((unit) => (
          <div
            key={unit.label}
            className="flex h-10 w-10 flex-col items-center justify-center rounded-md bg-primary text-primary-foreground"
          >
            <span className="text-sm font-bold leading-none">
              {pad(unit.value)}
            </span>
            <span className="text-[9px] font-medium opacity-70">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
