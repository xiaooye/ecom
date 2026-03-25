import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WishlistButton } from "@/components/product/wishlist-button";
import { useWishlistStore } from "@/stores/wishlist-store";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Heart: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="heart-icon" className={className as string} {...props} />
  ),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

const product = {
  id: "prod_123",
  title: "Classic T-Shirt",
  handle: "classic-t-shirt",
  thumbnail: "/images/tshirt.jpg",
};

describe("WishlistButton", () => {
  beforeEach(() => {
    // Reset the wishlist store before each test
    useWishlistStore.setState({ items: [] });
  });

  it("renders heart icon", () => {
    render(<WishlistButton product={product} />);
    expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
  });

  it('shows "Add to Wishlist" text in default variant', () => {
    render(<WishlistButton product={product} variant="default" />);
    expect(screen.getByText("Add to Wishlist")).toBeInTheDocument();
    expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
  });

  it("heart icon is filled when product is in wishlist", () => {
    // Pre-populate the wishlist store
    useWishlistStore.setState({ items: [product] });

    render(<WishlistButton product={product} />);

    const heart = screen.getByTestId("heart-icon");
    expect(heart.getAttribute("class")).toContain("fill-red-500");
    expect(heart.getAttribute("class")).toContain("text-red-500");
  });

  it("heart icon is not filled when product is not in wishlist", () => {
    render(<WishlistButton product={product} />);

    const heart = screen.getByTestId("heart-icon");
    expect(heart.getAttribute("class")).not.toContain("fill-red-500");
  });

  it('shows "Remove from Wishlist" when product is in wishlist (default variant)', () => {
    useWishlistStore.setState({ items: [product] });

    render(<WishlistButton product={product} variant="default" />);
    expect(screen.getByText("Remove from Wishlist")).toBeInTheDocument();
  });

  it("has correct aria-label for icon variant when not in wishlist", () => {
    render(<WishlistButton product={product} variant="icon" />);
    expect(
      screen.getByRole("button", { name: "Add to wishlist" })
    ).toBeInTheDocument();
  });

  it("has correct aria-label for icon variant when in wishlist", () => {
    useWishlistStore.setState({ items: [product] });

    render(<WishlistButton product={product} variant="icon" />);
    expect(
      screen.getByRole("button", { name: "Remove from wishlist" })
    ).toBeInTheDocument();
  });

  it("toggles wishlist state on click", async () => {
    const user = userEvent.setup();
    render(<WishlistButton product={product} variant="default" />);

    expect(screen.getByText("Add to Wishlist")).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("Remove from Wishlist")).toBeInTheDocument();
  });
});
