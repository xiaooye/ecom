import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GiftWrap } from "@/components/cart/gift-wrap";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Gift: (props: Record<string, unknown>) => (
    <svg data-testid="gift-icon" {...props} />
  ),
  CheckIcon: (props: Record<string, unknown>) => (
    <svg data-testid="check-icon" {...props} />
  ),
}));

describe("GiftWrap", () => {
  it("shows checkbox with label text", () => {
    render(<GiftWrap />);
    expect(
      screen.getByText("Add gift wrapping (+$5.00)")
    ).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("checking checkbox reveals message input", async () => {
    const user = userEvent.setup();
    render(<GiftWrap />);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(
      screen.getByPlaceholderText("Add a gift message (optional)")
    ).toBeInTheDocument();
  });

  it("unchecking checkbox hides message input", async () => {
    const user = userEvent.setup();
    render(<GiftWrap />);

    const checkbox = screen.getByRole("checkbox");

    // Check to reveal
    await user.click(checkbox);
    expect(
      screen.getByPlaceholderText("Add a gift message (optional)")
    ).toBeInTheDocument();

    // Uncheck to hide — the container gets max-h-0 and opacity-0
    await user.click(checkbox);

    const messageContainer = screen
      .getByPlaceholderText("Add a gift message (optional)")
      .closest(".mt-3");
    expect(messageContainer?.className).toContain("max-h-0");
    expect(messageContainer?.className).toContain("opacity-0");
  });

  it("shows character count", async () => {
    const user = userEvent.setup();
    render(<GiftWrap />);

    // Enable gift wrap
    await user.click(screen.getByRole("checkbox"));

    // Initially 0/150
    expect(screen.getByText("0/150")).toBeInTheDocument();

    // Type a message
    const input = screen.getByPlaceholderText(
      "Add a gift message (optional)"
    );
    await user.type(input, "Happy Birthday!");

    expect(screen.getByText("15/150")).toBeInTheDocument();
  });

  it("shows gift icon", () => {
    render(<GiftWrap />);
    expect(screen.getByTestId("gift-icon")).toBeInTheDocument();
  });
});
