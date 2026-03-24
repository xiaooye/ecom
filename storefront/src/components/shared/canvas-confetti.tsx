"use client";

import { useCallback } from "react";
import confetti from "canvas-confetti";

/**
 * High-performance confetti trigger using canvas-confetti.
 * Uses native Canvas rendering for smooth 60fps particle effects.
 * Returns a fire function to trigger on demand.
 */
export function useConfetti() {
  const fireConfetti = useCallback(() => {
    // Center burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f43f5e", "#3b82f6", "#22c55e", "#eab308", "#a855f7"],
    });
  }, []);

  const fireSides = useCallback(() => {
    // Left cannon
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
    });
    // Right cannon
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
    });
  }, []);

  const fireStars = useCallback(() => {
    confetti({
      particleCount: 30,
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: ["star"],
      colors: ["#FFD700", "#FFA500"],
      origin: { y: 0.5 },
    });
  }, []);

  return { fireConfetti, fireSides, fireStars };
}

/**
 * Preset: celebration burst for order completion
 */
export function celebrationConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ["#f43f5e", "#3b82f6", "#22c55e"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ["#eab308", "#a855f7", "#06b6d4"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
