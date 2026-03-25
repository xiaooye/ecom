import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "@/hooks/use-media-query";

describe("useMediaQuery", () => {
  let listeners: Array<(e: MediaQueryListEvent) => void>;
  let mockMatches: boolean;

  beforeEach(() => {
    listeners = [];
    mockMatches = false;

    // Mock window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: mockMatches,
        media: query,
        onchange: null,
        addEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
          if (event === "change") {
            listeners.push(listener);
          }
        }),
        removeEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
          if (event === "change") {
            listeners = listeners.filter((l) => l !== listener);
          }
        }),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    listeners = [];
  });

  describe("returns boolean", () => {
    it("returns a boolean value", () => {
      const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
      expect(typeof result.current).toBe("boolean");
    });

    it("returns false when match is false", () => {
      mockMatches = false;
      const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
      expect(result.current).toBe(false);
    });

    it("returns true when match is true", () => {
      mockMatches = true;
      const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
      expect(result.current).toBe(true);
    });
  });

  describe("initial value matches mock matchMedia", () => {
    it("starts as false when matchMedia returns false", () => {
      mockMatches = false;
      const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));
      expect(result.current).toBe(false);
    });

    it("starts as true when matchMedia returns true", () => {
      mockMatches = true;
      const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));
      expect(result.current).toBe(true);
    });
  });

  describe("responds to media query changes via listener", () => {
    it("updates to true when listener fires with matches=true", () => {
      mockMatches = false;
      const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
      expect(result.current).toBe(false);

      // Simulate a media query change
      act(() => {
        listeners.forEach((listener) =>
          listener({ matches: true } as MediaQueryListEvent)
        );
      });

      expect(result.current).toBe(true);
    });

    it("updates to false when listener fires with matches=false", () => {
      mockMatches = true;
      const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
      expect(result.current).toBe(true);

      act(() => {
        listeners.forEach((listener) =>
          listener({ matches: false } as MediaQueryListEvent)
        );
      });

      expect(result.current).toBe(false);
    });

    it("handles multiple changes in sequence", () => {
      mockMatches = false;
      const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

      // Change to true
      act(() => {
        listeners.forEach((l) => l({ matches: true } as MediaQueryListEvent));
      });
      expect(result.current).toBe(true);

      // Change back to false
      act(() => {
        listeners.forEach((l) => l({ matches: false } as MediaQueryListEvent));
      });
      expect(result.current).toBe(false);

      // Change to true again
      act(() => {
        listeners.forEach((l) => l({ matches: true } as MediaQueryListEvent));
      });
      expect(result.current).toBe(true);
    });
  });
});
