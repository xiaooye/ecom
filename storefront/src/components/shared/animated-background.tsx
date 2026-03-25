"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Pattern = "dots-flow" | "grid-beam" | "gradient-conic";

interface AnimatedBackgroundProps {
  pattern: Pattern;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Animated CSS background patterns.
 * - "dots-flow": dots that pulse in waves
 * - "grid-beam": grid lines with traveling light beams
 * - "gradient-conic": rotating conic gradient
 */
export function AnimatedBackground({
  pattern,
  className,
  children,
}: AnimatedBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {pattern === "dots-flow" && <DotsFlow />}
      {pattern === "grid-beam" && <GridBeam />}
      {pattern === "gradient-conic" && <GradientConic />}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dots that pulse in waves                                           */
/* ------------------------------------------------------------------ */
function DotsFlow() {
  const id = useId();
  const animName = `dots-flow-pulse-${id.replace(/:/g, "")}`;

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.15,
          animation: `${animName} 4s ease-in-out infinite`,
        }}
      />
      <style>{`
        @keyframes ${animName} {
          0%, 100% {
            opacity: 0.08;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.03);
          }
        }
      `}</style>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Grid lines with traveling light beams                              */
/* ------------------------------------------------------------------ */
function GridBeam() {
  const id = useId();
  const beamH = `grid-beam-h-${id.replace(/:/g, "")}`;
  const beamV = `grid-beam-v-${id.replace(/:/g, "")}`;

  return (
    <>
      {/* Static grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Horizontal beam */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, transparent, currentColor 50%, transparent)",
          height: "1px",
          top: "50%",
          opacity: 0.15,
          animation: `${beamH} 6s linear infinite`,
        }}
      />

      {/* Vertical beam */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent, currentColor 50%, transparent)",
          width: "1px",
          left: "50%",
          opacity: 0.15,
          animation: `${beamV} 8s linear infinite`,
        }}
      />

      <style>{`
        @keyframes ${beamH} {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes ${beamV} {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Rotating conic gradient                                            */
/* ------------------------------------------------------------------ */
function GradientConic() {
  const id = useId();
  const animName = `conic-rotate-${id.replace(/:/g, "")}`;

  return (
    <>
      <div
        className="pointer-events-none absolute inset-[-50%]"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent, rgba(120, 119, 198, 0.12), transparent, rgba(255, 119, 198, 0.08), transparent)",
          animation: `${animName} 8s linear infinite`,
        }}
      />
      <style>{`
        @keyframes ${animName} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
