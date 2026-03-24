import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RatingStars } from "@/components/shared/rating-stars";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Star: ({ className, ...props }: Record<string, unknown>) => (
    <svg
      data-testid="star-icon"
      data-classname={className}
      className={className as string}
      {...props}
    />
  ),
  StarHalf: ({ className, ...props }: Record<string, unknown>) => (
    <svg
      data-testid="star-half-icon"
      data-classname={className}
      className={className as string}
      {...props}
    />
  ),
}));

describe("RatingStars", () => {
  it("renders correct number of filled stars for rating 4", () => {
    render(<RatingStars rating={4} />);
    const stars = screen.getAllByTestId("star-icon");
    // 4 filled + 1 empty = 5 total stars
    const filledStars = stars.filter((star) =>
      star.getAttribute("data-classname")?.includes("fill-yellow-400")
    );
    expect(filledStars).toHaveLength(4);
  });

  it("renders half star for 4.5 rating", () => {
    render(<RatingStars rating={4.5} />);
    const halfStars = screen.getAllByTestId("star-half-icon");
    expect(halfStars).toHaveLength(1);
  });

  it("shows value when showValue=true", () => {
    render(<RatingStars rating={4.5} showValue />);
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("does not show value when showValue=false (default)", () => {
    render(<RatingStars rating={4.5} />);
    expect(screen.queryByText("4.5")).not.toBeInTheDocument();
  });

  it("shows count when provided", () => {
    render(<RatingStars rating={4} count={128} />);
    expect(screen.getByText("(128)")).toBeInTheDocument();
  });

  it("does not show count when not provided", () => {
    render(<RatingStars rating={4} />);
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it("renders 5 stars total by default", () => {
    render(<RatingStars rating={3} />);
    const allStars = screen.getAllByTestId("star-icon");
    expect(allStars).toHaveLength(5);
  });
});
