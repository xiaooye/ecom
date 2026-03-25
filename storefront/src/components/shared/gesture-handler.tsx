"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SwipeDirection = "left" | "right" | "up" | "down";

interface GestureHandlerProps {
  children: ReactNode;
  className?: string;
  /** Called when a swipe gesture completes */
  onSwipe?: (direction: SwipeDirection, velocity: number) => void;
  /** Called during a pinch-zoom gesture with the scale factor */
  onPinch?: (scale: number) => void;
  /** Called when a long-press is detected */
  onLongPress?: (x: number, y: number) => void;
  /** Minimum distance in px to register a swipe (default: 50) */
  swipeThreshold?: number;
  /** Duration in ms before a long-press fires (default: 500) */
  longPressDelay?: number;
  /** Whether to prevent default on pointer events (default: false) */
  preventDefault?: boolean;
}

interface PointerState {
  id: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
}

/**
 * Touch gesture detection wrapper using pointer events.
 * Detects swipe-left, swipe-right, swipe-up, swipe-down, pinch-zoom,
 * and long-press gestures. Exposes onSwipe, onPinch, onLongPress callbacks.
 * Used for mobile product gallery navigation.
 */
export function GestureHandler({
  children,
  className,
  onSwipe,
  onPinch,
  onLongPress,
  swipeThreshold = 50,
  longPressDelay = 500,
  preventDefault = false,
}: GestureHandlerProps) {
  const pointers = useRef<Map<number, PointerState>>(new Map());
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialPinchDistance = useRef<number | null>(null);
  const lastPinchScale = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const getDistance = useCallback((p1: PointerState, p2: PointerState) => {
    const dx = p1.currentX - p2.currentX;
    const dy = p1.currentY - p2.currentY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (preventDefault) e.preventDefault();
      const el = containerRef.current;
      if (el) {
        (el as Element).setPointerCapture(e.pointerId);
      }

      const state: PointerState = {
        id: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
        startTime: Date.now(),
      };
      pointers.current.set(e.pointerId, state);

      // Single finger: start long-press timer
      if (pointers.current.size === 1 && onLongPress) {
        clearLongPress();
        longPressTimer.current = setTimeout(() => {
          const ptr = pointers.current.get(e.pointerId);
          if (ptr) {
            const dx = Math.abs(ptr.currentX - ptr.startX);
            const dy = Math.abs(ptr.currentY - ptr.startY);
            // Only fire if finger hasn't moved significantly
            if (dx < 10 && dy < 10) {
              onLongPress(ptr.currentX, ptr.currentY);
            }
          }
        }, longPressDelay);
      }

      // Two fingers: initialize pinch
      if (pointers.current.size === 2) {
        clearLongPress();
        const pts = Array.from(pointers.current.values());
        initialPinchDistance.current = getDistance(pts[0], pts[1]);
        lastPinchScale.current = 1;
      }
    },
    [onLongPress, longPressDelay, clearLongPress, getDistance, preventDefault]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (preventDefault) e.preventDefault();
      const ptr = pointers.current.get(e.pointerId);
      if (!ptr) return;

      ptr.currentX = e.clientX;
      ptr.currentY = e.clientY;

      // Cancel long-press if finger moves too much
      const dx = Math.abs(ptr.currentX - ptr.startX);
      const dy = Math.abs(ptr.currentY - ptr.startY);
      if (dx > 10 || dy > 10) {
        clearLongPress();
      }

      // Pinch detection
      if (pointers.current.size === 2 && initialPinchDistance.current && onPinch) {
        const pts = Array.from(pointers.current.values());
        const currentDist = getDistance(pts[0], pts[1]);
        const scale = currentDist / initialPinchDistance.current;

        // Only fire if scale changed meaningfully
        if (Math.abs(scale - lastPinchScale.current) > 0.01) {
          lastPinchScale.current = scale;
          onPinch(scale);
        }
      }
    },
    [clearLongPress, getDistance, onPinch, preventDefault]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (preventDefault) e.preventDefault();
      clearLongPress();

      const ptr = pointers.current.get(e.pointerId);
      if (ptr && pointers.current.size === 1 && onSwipe) {
        const dx = ptr.currentX - ptr.startX;
        const dy = ptr.currentY - ptr.startY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        const elapsed = (Date.now() - ptr.startTime) / 1000;

        if (absDx >= swipeThreshold || absDy >= swipeThreshold) {
          let direction: SwipeDirection;
          let distance: number;

          if (absDx > absDy) {
            direction = dx > 0 ? "right" : "left";
            distance = absDx;
          } else {
            direction = dy > 0 ? "down" : "up";
            distance = absDy;
          }

          const velocity = elapsed > 0 ? distance / elapsed : 0;
          onSwipe(direction, velocity);
        }
      }

      pointers.current.delete(e.pointerId);

      if (pointers.current.size < 2) {
        initialPinchDistance.current = null;
      }
    },
    [onSwipe, swipeThreshold, clearLongPress, preventDefault]
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      clearLongPress();
      pointers.current.delete(e.pointerId);
      if (pointers.current.size < 2) {
        initialPinchDistance.current = null;
      }
    },
    [clearLongPress]
  );

  return (
    <div
      ref={containerRef}
      className={cn("touch-none", className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
    >
      {children}
    </div>
  );
}
