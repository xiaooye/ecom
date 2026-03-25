import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useClickOutside } from "@/hooks/use-click-outside";

describe("useClickOutside", () => {
  it("calls handler when clicking outside the ref element", () => {
    const handler = vi.fn();
    const { result } = renderHook(() =>
      useClickOutside<HTMLDivElement>(handler)
    );

    // Create and mount the ref element
    const refElement = document.createElement("div");
    document.body.appendChild(refElement);

    // Assign the ref element manually
    Object.defineProperty(result.current, "current", {
      value: refElement,
      writable: true,
    });

    // Click outside the ref element (on the body)
    const outsideEvent = new MouseEvent("mousedown", { bubbles: true });
    document.body.dispatchEvent(outsideEvent);

    expect(handler).toHaveBeenCalledTimes(1);

    // Clean up
    document.body.removeChild(refElement);
  });

  it("does not call handler when clicking inside the ref element", () => {
    const handler = vi.fn();
    const { result } = renderHook(() =>
      useClickOutside<HTMLDivElement>(handler)
    );

    // Create and mount the ref element
    const refElement = document.createElement("div");
    const childElement = document.createElement("span");
    refElement.appendChild(childElement);
    document.body.appendChild(refElement);

    // Assign the ref element
    Object.defineProperty(result.current, "current", {
      value: refElement,
      writable: true,
    });

    // Click inside the ref element (on the child)
    const insideEvent = new MouseEvent("mousedown", { bubbles: true });
    childElement.dispatchEvent(insideEvent);

    expect(handler).not.toHaveBeenCalled();

    // Click on the ref element itself
    const selfEvent = new MouseEvent("mousedown", { bubbles: true });
    refElement.dispatchEvent(selfEvent);

    expect(handler).not.toHaveBeenCalled();

    // Clean up
    document.body.removeChild(refElement);
  });

  it("cleanup removes event listeners", () => {
    const handler = vi.fn();
    const { result, unmount } = renderHook(() =>
      useClickOutside<HTMLDivElement>(handler)
    );

    // Create and mount the ref element
    const refElement = document.createElement("div");
    document.body.appendChild(refElement);

    Object.defineProperty(result.current, "current", {
      value: refElement,
      writable: true,
    });

    // Unmount the hook (triggers cleanup)
    unmount();

    // Click outside after unmount — handler should NOT be called
    const outsideEvent = new MouseEvent("mousedown", { bubbles: true });
    document.body.dispatchEvent(outsideEvent);

    expect(handler).not.toHaveBeenCalled();

    // Clean up
    document.body.removeChild(refElement);
  });

  it("returns a ref object", () => {
    const handler = vi.fn();
    const { result } = renderHook(() =>
      useClickOutside<HTMLDivElement>(handler)
    );

    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty("current");
  });

  it("also handles touchstart events outside", () => {
    const handler = vi.fn();
    const { result } = renderHook(() =>
      useClickOutside<HTMLDivElement>(handler)
    );

    const refElement = document.createElement("div");
    document.body.appendChild(refElement);

    Object.defineProperty(result.current, "current", {
      value: refElement,
      writable: true,
    });

    // Touch outside
    const touchEvent = new TouchEvent("touchstart", { bubbles: true });
    document.body.dispatchEvent(touchEvent);

    expect(handler).toHaveBeenCalledTimes(1);

    // Clean up
    document.body.removeChild(refElement);
  });
});
