"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PerformanceMetrics {
  fps: number;
  memory?: number;
  domNodes: number;
}

/**
 * Development-only performance monitor overlay.
 * Shows FPS, memory usage, and DOM node count.
 * Only renders in development mode.
 */
export function PerformanceMonitor({ className }: { className?: string }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    domNodes: 0,
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    let frames = 0;
    let lastTime = performance.now();
    let animId: number;

    const measure = () => {
      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        const perf = performance as Performance & {
          memory?: { usedJSHeapSize: number };
        };
        setMetrics({
          fps: frames,
          memory: perf.memory
            ? Math.round(perf.memory.usedJSHeapSize / 1048576)
            : undefined,
          domNodes: document.querySelectorAll("*").length,
        });
        frames = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    measure();
    return () => cancelAnimationFrame(animId);
  }, []);

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setVisible(!visible)}
        className="fixed bottom-4 left-4 z-[9999] h-6 w-6 rounded-full bg-green-500 text-[8px] font-bold text-white shadow-lg"
        title="Performance Monitor"
      >
        {metrics.fps}
      </button>

      {visible && (
        <div
          className={cn(
            "fixed bottom-12 left-4 z-[9999] rounded-lg border bg-card p-3 font-mono text-xs shadow-xl",
            className
          )}
        >
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">FPS</span>
              <span
                className={cn(
                  "font-bold",
                  metrics.fps >= 55
                    ? "text-green-500"
                    : metrics.fps >= 30
                      ? "text-yellow-500"
                      : "text-red-500"
                )}
              >
                {metrics.fps}
              </span>
            </div>
            {metrics.memory != null && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Memory</span>
                <span>{metrics.memory} MB</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">DOM</span>
              <span>{metrics.domNodes}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
