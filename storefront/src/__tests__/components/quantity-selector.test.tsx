import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuantitySelector } from "@/components/product/quantity-selector";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Minus: (props: Record<string, unknown>) => (
    <svg data-testid="minus-icon" {...props} />
  ),
  Plus: (props: Record<string, unknown>) => (
    <svg data-testid="plus-icon" {...props} />
  ),
}));

describe("QuantitySelector", () => {
  it("renders current value", () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={3} onChange={onChange} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("increments on + click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={3} onChange={onChange} />);

    const increaseBtn = screen.getByRole("button", {
      name: /increase quantity/i,
    });
    await user.click(increaseBtn);
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("decrements on - click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={3} onChange={onChange} />);

    const decreaseBtn = screen.getByRole("button", {
      name: /decrease quantity/i,
    });
    await user.click(decreaseBtn);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("disables - at minimum", () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={1} onChange={onChange} min={1} />);

    const decreaseBtn = screen.getByRole("button", {
      name: /decrease quantity/i,
    });
    expect(decreaseBtn).toBeDisabled();
  });

  it("disables + at maximum", () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={5} onChange={onChange} max={5} />);

    const increaseBtn = screen.getByRole("button", {
      name: /increase quantity/i,
    });
    expect(increaseBtn).toBeDisabled();
  });

  it("does not go below minimum", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={1} onChange={onChange} min={1} />);

    const decreaseBtn = screen.getByRole("button", {
      name: /decrease quantity/i,
    });
    // Button is disabled, but verify the constraint
    await user.click(decreaseBtn);
    // onChange should not fire since button is disabled
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not go above maximum", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={99} onChange={onChange} max={99} />);

    const increaseBtn = screen.getByRole("button", {
      name: /increase quantity/i,
    });
    await user.click(increaseBtn);
    expect(onChange).not.toHaveBeenCalled();
  });
});
