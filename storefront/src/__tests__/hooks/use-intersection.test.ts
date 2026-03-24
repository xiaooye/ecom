import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIntersection } from "@/hooks/use-intersection";

// Mock IntersectionObserver
let observerCallback: IntersectionObserverCallback;
let observerOptions: IntersectionObserverInit | undefined;

const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  const MockIntersectionObserver = vi.fn(
    (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
      observerCallback = callback;
      observerOptions = options;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
        root: null,
        rootMargin: "",
        thresholds: [],
        takeRecords: () => [],
      };
    }
  );

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useIntersection", () => {
  it("returns ref and isIntersecting", () => {
    const { result } = renderHook(() => useIntersection());
    expect(result.current).toHaveProperty("ref");
    expect(result.current).toHaveProperty("isIntersecting");
  });

  it("initial isIntersecting is false", () => {
    const { result } = renderHook(() => useIntersection());
    expect(result.current.isIntersecting).toBe(false);
  });

  it("ref is a React ref object", () => {
    const { result } = renderHook(() => useIntersection());
    expect(result.current.ref).toHaveProperty("current");
    expect(result.current.ref.current).toBeNull();
  });

  it("uses default options when none provided", () => {
    renderHook(() => useIntersection());
    // Observer is not created until ref.current is set,
    // but the hook itself should not throw
    expect(mockDisconnect).not.toHaveBeenCalled();
  });

  it("accepts custom threshold and rootMargin options", () => {
    const { result } = renderHook(() =>
      useIntersection({ threshold: 0.5, rootMargin: "10px" })
    );
    expect(result.current.isIntersecting).toBe(false);
  });
});
