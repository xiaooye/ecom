import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn() advanced", () => {
  describe("handles 10+ arguments", () => {
    it("merges 10 distinct class names", () => {
      const result = cn(
        "a", "b", "c", "d", "e",
        "f", "g", "h", "i", "j"
      );
      expect(result).toBe("a b c d e f g h i j");
    });

    it("merges 15 class names", () => {
      const result = cn(
        "c1", "c2", "c3", "c4", "c5",
        "c6", "c7", "c8", "c9", "c10",
        "c11", "c12", "c13", "c14", "c15"
      );
      expect(result).toContain("c1");
      expect(result).toContain("c15");
      const parts = result.split(" ");
      expect(parts).toHaveLength(15);
    });

    it("handles 10+ args with some tailwind conflicts resolved", () => {
      const result = cn(
        "p-1", "p-2", "m-1", "m-2", "text-sm",
        "text-lg", "bg-red-500", "bg-blue-500", "rounded", "shadow",
        "border", "flex"
      );
      // tailwind-merge keeps last conflicting: p-2, m-2, text-lg, bg-blue-500
      expect(result).toContain("p-2");
      expect(result).not.toContain("p-1");
      expect(result).toContain("m-2");
      expect(result).not.toContain("m-1");
      expect(result).toContain("text-lg");
      expect(result).not.toContain("text-sm");
      expect(result).toContain("bg-blue-500");
      expect(result).not.toContain("bg-red-500");
    });
  });

  describe("handles deeply nested conditional classes", () => {
    it("handles nested ternaries", () => {
      const isActive = true;
      const isLarge = false;
      const result = cn(
        "base",
        isActive ? (isLarge ? "active-large" : "active-small") : "inactive"
      );
      expect(result).toBe("base active-small");
    });

    it("handles multiple nested conditionals", () => {
      const a = true;
      const b = false;
      const c = true;
      const result = cn(
        a && "alpha",
        b && "beta",
        c && "gamma",
        a && c && "alpha-gamma",
        !b && "not-beta"
      );
      expect(result).toBe("alpha gamma alpha-gamma not-beta");
    });

    it("handles object syntax with clsx", () => {
      const result = cn({
        "bg-red-500": true,
        "text-white": true,
        "border": false,
        "rounded": true,
      });
      expect(result).toContain("bg-red-500");
      expect(result).toContain("text-white");
      expect(result).not.toContain("border");
      expect(result).toContain("rounded");
    });
  });

  describe("handles template literal classes", () => {
    it("handles a template literal string", () => {
      const size = "lg";
      const result = cn(`text-${size}`, "font-bold");
      expect(result).toBe("text-lg font-bold");
    });

    it("handles multiple template literals", () => {
      const color = "blue";
      const shade = "500";
      const result = cn(`bg-${color}-${shade}`, `text-${color}-100`);
      expect(result).toBe("bg-blue-500 text-blue-100");
    });

    it("handles template literal with conditional", () => {
      const isError = true;
      const result = cn(
        "input",
        `border-${isError ? "red" : "gray"}-500`
      );
      expect(result).toBe("input border-red-500");
    });
  });

  describe("returns empty string for all falsy inputs", () => {
    it("returns empty for false", () => {
      expect(cn(false)).toBe("");
    });

    it("returns empty for null", () => {
      expect(cn(null)).toBe("");
    });

    it("returns empty for undefined", () => {
      expect(cn(undefined)).toBe("");
    });

    it("returns empty for 0", () => {
      expect(cn(0)).toBe("");
    });

    it("returns empty for empty string", () => {
      expect(cn("")).toBe("");
    });

    it("returns empty for multiple falsy values", () => {
      expect(cn(false, null, undefined, 0, "")).toBe("");
    });

    it("returns empty for no arguments", () => {
      expect(cn()).toBe("");
    });
  });

  describe("handles array of arrays", () => {
    it("flattens nested arrays", () => {
      const result = cn(["foo", "bar"], ["baz", "qux"]);
      expect(result).toBe("foo bar baz qux");
    });

    it("handles mixed arrays and strings", () => {
      const result = cn("standalone", ["arr1", "arr2"], "another");
      expect(result).toBe("standalone arr1 arr2 another");
    });

    it("handles arrays with falsy values", () => {
      const result = cn(["valid", false && "invalid", null, "also-valid"]);
      expect(result).toBe("valid also-valid");
    });

    it("handles empty arrays", () => {
      const result = cn([], [], "something");
      expect(result).toBe("something");
    });
  });
});
