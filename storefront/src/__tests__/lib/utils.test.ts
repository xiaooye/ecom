import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (class name utility)", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe(
      "base active"
    );
  });

  it("handles undefined inputs", () => {
    expect(cn("base", undefined, "extra")).toBe("base extra");
  });

  it("handles null inputs", () => {
    expect(cn("base", null, "extra")).toBe("base extra");
  });

  it("deduplicates tailwind classes via tailwind-merge", () => {
    // tailwind-merge should keep the last conflicting class
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("merges conflicting tailwind text colors", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles empty arguments", () => {
    expect(cn()).toBe("");
  });

  it("handles array inputs via clsx", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });
});
