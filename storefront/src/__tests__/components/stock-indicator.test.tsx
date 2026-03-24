import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StockIndicator } from "@/components/product/stock-indicator";

describe("StockIndicator", () => {
  it('shows "Out of Stock" with red dot when quantity is 0', () => {
    render(<StockIndicator quantity={0} />);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();

    // Red dot indicator
    const dot = screen.getByText("Out of Stock")
      .closest("div")!
      .querySelector("span.rounded-full");
    expect(dot).toHaveClass("bg-red-500");
  });

  it('shows "Only X left" with amber dot when quantity <= 5', () => {
    render(<StockIndicator quantity={3} />);
    expect(
      screen.getByText(/Only 3 left/)
    ).toBeInTheDocument();

    // Amber dot indicator
    const dot = screen
      .getByText(/Only 3 left/)
      .closest("div")!
      .querySelector("span.rounded-full");
    expect(dot).toHaveClass("bg-amber-500");
  });

  it('shows "Only X left" at boundary quantity of 5', () => {
    render(<StockIndicator quantity={5} />);
    expect(
      screen.getByText(/Only 5 left/)
    ).toBeInTheDocument();
  });

  it('shows "In Stock" with green dot when quantity > 5', () => {
    render(<StockIndicator quantity={10} />);
    expect(screen.getByText("In Stock")).toBeInTheDocument();

    // Green dot indicator
    const dot = screen.getByText("In Stock")
      .closest("div")!
      .querySelector("span.rounded-full");
    expect(dot).toHaveClass("bg-green-500");
  });

  it("returns null when quantity is undefined", () => {
    const { container } = render(<StockIndicator />);
    expect(container.firstChild).toBeNull();
  });

  it('shows "Out of Stock" for negative quantity', () => {
    render(<StockIndicator quantity={-1} />);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });
});
