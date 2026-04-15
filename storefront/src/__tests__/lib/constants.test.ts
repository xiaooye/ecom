import { describe, it, expect } from "vitest";
import {
  DEFAULT_REGION,
  ITEMS_PER_PAGE,
  STORE_NAME,
  MEDUSA_BACKEND_URL,
} from "@/lib/constants";

describe("constants", () => {
  it('DEFAULT_REGION is "us"', () => {
    expect(DEFAULT_REGION).toBe("us");
  });

  it("ITEMS_PER_PAGE is 12", () => {
    expect(ITEMS_PER_PAGE).toBe(12);
  });

  it('STORE_NAME is "THREAD"', () => {
    expect(STORE_NAME).toBe("THREAD");
  });

  it("MEDUSA_BACKEND_URL has a default value", () => {
    expect(MEDUSA_BACKEND_URL).toBeDefined();
    expect(typeof MEDUSA_BACKEND_URL).toBe("string");
    expect(MEDUSA_BACKEND_URL.length).toBeGreaterThan(0);
  });

  it("MEDUSA_BACKEND_URL defaults to localhost:9000", () => {
    // When NEXT_PUBLIC_MEDUSA_BACKEND_URL env var is not set
    expect(MEDUSA_BACKEND_URL).toBe("http://localhost:9000");
  });
});
