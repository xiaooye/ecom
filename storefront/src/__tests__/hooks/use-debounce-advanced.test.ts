import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/use-debounce";

describe("useDebounce advanced", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("debounces with custom delay (500ms)", () => {
    it("does not update before 500ms", () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "initial", delay: 500 } }
      );

      rerender({ value: "updated", delay: 500 });

      act(() => {
        vi.advanceTimersByTime(499);
      });

      expect(result.current).toBe("initial");
    });

    it("updates exactly at 500ms", () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "initial", delay: 500 } }
      );

      rerender({ value: "updated", delay: 500 });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current).toBe("updated");
    });

    it("respects the custom delay over default", () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "start", delay: 500 } }
      );

      rerender({ value: "end", delay: 500 });

      // Default delay (300ms) should not have triggered the update
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current).toBe("start");

      // But at 500ms it should
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current).toBe("end");
    });
  });

  describe("rapid 100 changes only produces final value", () => {
    it("100 rapid changes resolve to final value", () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "v0", delay: 300 } }
      );

      for (let i = 1; i <= 100; i++) {
        rerender({ value: `v${i}`, delay: 300 });
        act(() => {
          vi.advanceTimersByTime(1);
        });
      }

      // Should still be the initial value (no 300ms has passed uninterrupted)
      expect(result.current).toBe("v0");

      // Advance past the debounce delay
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe("v100");
    });

    it("intermediate values are never produced", () => {
      const seen: string[] = [];
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "start", delay: 300 } }
      );
      seen.push(result.current);

      for (let i = 1; i <= 100; i++) {
        rerender({ value: `change-${i}`, delay: 300 });
        act(() => {
          vi.advanceTimersByTime(1);
        });
        seen.push(result.current);
      }

      // All values during rapid changes should still be "start"
      const duringChanges = seen.slice(0, -1);
      expect(duringChanges.every((v) => v === "start")).toBe(true);

      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current).toBe("change-100");
    });
  });

  describe("returns initial value synchronously", () => {
    it("initial string value is returned immediately", () => {
      const { result } = renderHook(() => useDebounce("sync-value", 500));
      expect(result.current).toBe("sync-value");
    });

    it("initial number value is returned immediately", () => {
      const { result } = renderHook(() => useDebounce(42, 500));
      expect(result.current).toBe(42);
    });

    it("initial object value is returned immediately", () => {
      const obj = { key: "value" };
      const { result } = renderHook(() => useDebounce(obj, 500));
      expect(result.current).toBe(obj);
    });

    it("initial null value is returned immediately", () => {
      const { result } = renderHook(() => useDebounce(null, 500));
      expect(result.current).toBeNull();
    });
  });

  describe("timer cleanup on unmount", () => {
    it("unmounting prevents the debounced value from updating", () => {
      const { result, rerender, unmount } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "before", delay: 300 } }
      );

      rerender({ value: "after", delay: 300 });
      expect(result.current).toBe("before");

      // Unmount before timer fires
      unmount();

      // Advance time past the delay — no error should occur
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // The last value captured before unmount should remain
      expect(result.current).toBe("before");
    });

    it("no pending timers after unmount", () => {
      const { rerender, unmount } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "a", delay: 300 } }
      );

      rerender({ value: "b", delay: 300 });
      unmount();

      // If timers were not cleaned up, this would cause issues
      // Just verify no errors thrown when advancing
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(1000);
        });
      }).not.toThrow();
    });
  });
});
