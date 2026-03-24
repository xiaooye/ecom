import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceDisplay } from "@/components/product/price-display";

describe("PriceDisplay", () => {
  it("shows formatted price", () => {
    render(<PriceDisplay amount={2999} currencyCode="usd" />);
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("shows original price with strikethrough when on sale", () => {
    render(
      <PriceDisplay amount={1999} originalAmount={2999} currencyCode="usd" />
    );
    // Current price
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    // Original price with line-through class
    const originalPrice = screen.getByText("$29.99");
    expect(originalPrice).toBeInTheDocument();
    expect(originalPrice.className).toContain("line-through");
  });

  it("shows percentage discount", () => {
    render(
      <PriceDisplay amount={1500} originalAmount={3000} currencyCode="usd" />
    );
    // 50% off
    expect(screen.getByText(/50%/)).toBeInTheDocument();
    expect(screen.getByText(/OFF/)).toBeInTheDocument();
  });

  it("does not show discount when no original price", () => {
    render(<PriceDisplay amount={2999} currencyCode="usd" />);
    expect(screen.queryByText(/OFF/)).not.toBeInTheDocument();
    expect(screen.queryByText(/line-through/)).not.toBeInTheDocument();
  });

  it("does not show discount when original price is null", () => {
    render(
      <PriceDisplay amount={2999} originalAmount={null} currencyCode="usd" />
    );
    expect(screen.queryByText(/OFF/)).not.toBeInTheDocument();
  });

  it("does not show discount when original equals current", () => {
    render(
      <PriceDisplay amount={2999} originalAmount={2999} currencyCode="usd" />
    );
    expect(screen.queryByText(/OFF/)).not.toBeInTheDocument();
  });
});
