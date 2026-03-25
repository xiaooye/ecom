import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BackInStock } from "@/components/product/back-in-stock";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Bell: (props: Record<string, unknown>) => (
    <svg data-testid="bell-icon" {...props} />
  ),
  Check: (props: Record<string, unknown>) => (
    <svg data-testid="check-icon" {...props} />
  ),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe("BackInStock", () => {
  it("shows email input and notify button", () => {
    render(<BackInStock />);

    expect(
      screen.getByPlaceholderText("Enter your email")
    ).toBeInTheDocument();
    expect(screen.getByText("Notify Me")).toBeInTheDocument();
  });

  it("shows descriptive heading", () => {
    render(<BackInStock />);
    expect(
      screen.getByText("Get notified when back in stock")
    ).toBeInTheDocument();
  });

  it("shows bell icon", () => {
    render(<BackInStock />);
    expect(screen.getByTestId("bell-icon")).toBeInTheDocument();
  });

  it("shows success message after submitting email", async () => {
    const user = userEvent.setup();
    render(<BackInStock />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    await user.type(emailInput, "test@example.com");

    const submitBtn = screen.getByText("Notify Me");
    await user.click(submitBtn);

    // After submit, the success message is shown
    expect(
      screen.getByText(
        /ll email you when this item is back in stock/
      )
    ).toBeInTheDocument();

    // Check icon should appear in the success state
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();

    // The form should no longer be visible
    expect(
      screen.queryByPlaceholderText("Enter your email")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Notify Me")).not.toBeInTheDocument();
  });

  it("does not submit when email is empty", async () => {
    const user = userEvent.setup();
    render(<BackInStock />);

    // The input has required attribute, so the form won't submit
    const submitBtn = screen.getByText("Notify Me");
    await user.click(submitBtn);

    // Should still show the form (not the success message)
    expect(
      screen.getByPlaceholderText("Enter your email")
    ).toBeInTheDocument();
    expect(screen.getByText("Notify Me")).toBeInTheDocument();
  });

  it("email input has type=email", () => {
    render(<BackInStock />);
    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toHaveAttribute("type", "email");
  });
});
