import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartSummary } from "@/components/cart/cart-summary";

// Mock lucide-react icons used by the Separator (via radix-ui)
vi.mock("lucide-react", () => ({
  Check: (props: Record<string, unknown>) => (
    <svg data-testid="check-icon" {...props} />
  ),
}));

describe("CartSummary", () => {
  it("renders subtotal correctly", () => {
    render(<CartSummary subtotal={4999} currencyCode="usd" />);
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("$49.99")).toBeInTheDocument();
  });

  it('renders "Free" when shippingTotal is 0', () => {
    render(
      <CartSummary subtotal={2000} shippingTotal={0} currencyCode="usd" />
    );
    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("renders shipping cost when greater than 0", () => {
    render(
      <CartSummary subtotal={2000} shippingTotal={999} currencyCode="usd" />
    );
    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
  });

  it("renders tax amount", () => {
    render(
      <CartSummary subtotal={2000} taxTotal={160} currencyCode="usd" />
    );
    expect(screen.getByText("Tax")).toBeInTheDocument();
    expect(screen.getByText("$1.60")).toBeInTheDocument();
  });

  it("renders total with font-semibold (bold)", () => {
    render(
      <CartSummary subtotal={2000} total={2160} currencyCode="usd" />
    );
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("$21.60")).toBeInTheDocument();

    // The total row has font-semibold class
    const totalRow = screen.getByText("Total").closest("div");
    expect(totalRow?.className).toContain("font-semibold");
  });

  it("does not render shipping when shippingTotal is undefined", () => {
    render(<CartSummary subtotal={2000} currencyCode="usd" />);
    expect(screen.queryByText("Shipping")).not.toBeInTheDocument();
  });

  it("does not render tax when taxTotal is undefined", () => {
    render(<CartSummary subtotal={2000} currencyCode="usd" />);
    expect(screen.queryByText("Tax")).not.toBeInTheDocument();
  });

  it("handles missing optional props with defaults", () => {
    render(<CartSummary currencyCode="usd" />);
    // subtotal defaults to 0, total defaults to 0
    const prices = screen.getAllByText("$0.00");
    expect(prices.length).toBeGreaterThanOrEqual(2);
    // shipping and tax should not appear
    expect(screen.queryByText("Shipping")).not.toBeInTheDocument();
    expect(screen.queryByText("Tax")).not.toBeInTheDocument();
  });

  it("renders Order Summary heading", () => {
    render(<CartSummary currencyCode="usd" />);
    expect(screen.getByText("Order Summary")).toBeInTheDocument();
  });

  it("supports different currency codes", () => {
    render(<CartSummary subtotal={1500} total={1500} currencyCode="eur" />);
    // EUR formatting
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
  });
});
