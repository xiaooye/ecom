import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/use-local-storage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns initial value", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default")
    );
    expect(result.current[0]).toBe("default");
  });

  it("updates value", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default")
    );

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
  });

  it("persists value to localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage("persist-key", "initial")
    );

    act(() => {
      result.current[1]("persisted");
    });

    expect(localStorage.getItem("persist-key")).toBe(
      JSON.stringify("persisted")
    );
  });

  it("accepts a function updater", () => {
    const { result } = renderHook(() =>
      useLocalStorage<number>("counter", 0)
    );

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });
});
