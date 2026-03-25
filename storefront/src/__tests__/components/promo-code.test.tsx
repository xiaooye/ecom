import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PromoCode } from "@/components/cart/promo-code";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Tag: (props: Record<string, unknown>) => (
    <svg data-testid="tag-icon" {...props} />
  ),
  Loader2: (props: Record<string, unknown>) => (
    <svg data-testid="loader-icon" {...props} />
  ),
  X: (props: Record<string, unknown>) => (
    <svg data-testid="x-icon" {...props} />
  ),
  Check: (props: Record<string, unknown>) => (
    <svg data-testid="check-icon" {...props} />
  ),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("PromoCode", () => {
  it('shows "Have a promo code?" link initially', () => {
    render(<PromoCode cartId="cart_123" />);
    expect(screen.getByText("Have a promo code?")).toBeInTheDocument();
  });

  it("clicking link shows input field", async () => {
    const user = userEvent.setup();
    render(<PromoCode cartId="cart_123" />);

    const link = screen.getByText("Have a promo code?");
    await user.click(link);

    expect(screen.getByPlaceholderText("Enter code")).toBeInTheDocument();
    expect(screen.getByText("Apply")).toBeInTheDocument();
  });

  it("close button hides input and returns to initial state", async () => {
    const user = userEvent.setup();
    render(<PromoCode cartId="cart_123" />);

    // Expand
    await user.click(screen.getByText("Have a promo code?"));
    expect(screen.getByPlaceholderText("Enter code")).toBeInTheDocument();

    // Click the close (X) button — it's the ghost variant button with X icon
    const closeButtons = screen.getAllByRole("button");
    // The last button is the close/X button (ghost variant)
    const closeBtn = closeButtons[closeButtons.length - 1];
    await user.click(closeBtn);

    // Should be back to the initial collapsed state
    expect(screen.getByText("Have a promo code?")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Enter code")).not.toBeInTheDocument();
  });

  it("shows applied code with green check icon after applying", async () => {
    const user = userEvent.setup();
    render(<PromoCode cartId="cart_123" />);

    // Expand
    await user.click(screen.getByText("Have a promo code?"));

    // Type a promo code
    const input = screen.getByPlaceholderText("Enter code");
    await user.type(input, "SAVE20");

    // Click Apply
    await user.click(screen.getByText("Apply"));

    // The applied code should be displayed in uppercase
    expect(await screen.findByText("SAVE20")).toBeInTheDocument();

    // Check icon should be present
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("Apply button is disabled when input is empty", async () => {
    const user = userEvent.setup();
    render(<PromoCode cartId="cart_123" />);

    // Expand
    await user.click(screen.getByText("Have a promo code?"));

    const applyBtn = screen.getByText("Apply");
    expect(applyBtn.closest("button")).toBeDisabled();
  });
});
