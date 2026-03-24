import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ColorPreview } from "@/components/product/color-preview";

// Mock framer-motion so motion.span renders as a plain span
vi.mock("framer-motion", () => ({
  motion: {
    span: ({
      children,
      style,
      title,
      className,
      ...props
    }: Record<string, unknown>) => (
      <span
        data-testid="color-dot"
        style={style as React.CSSProperties}
        title={title as string}
        className={className as string}
      >
        {children as React.ReactNode}
      </span>
    ),
  },
}));

describe("ColorPreview", () => {
  it("renders correct number of color dots", () => {
    render(<ColorPreview colors={["black", "white", "red"]} />);
    const dots = screen.getAllByTestId("color-dot");
    expect(dots).toHaveLength(3);
  });

  it("shows +N indicator when colors exceed maxVisible", () => {
    render(
      <ColorPreview
        colors={["black", "white", "red", "blue", "green", "navy"]}
        maxVisible={4}
      />
    );
    // Only 4 dots rendered
    const dots = screen.getAllByTestId("color-dot");
    expect(dots).toHaveLength(4);

    // +2 indicator (6 total - 4 visible = 2 remaining)
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("does not show +N indicator when colors fit within maxVisible", () => {
    render(<ColorPreview colors={["black", "white"]} maxVisible={4} />);
    expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
  });

  it("renders with correct background colors from colorMap", () => {
    render(<ColorPreview colors={["black", "red", "blue"]} />);
    const dots = screen.getAllByTestId("color-dot");

    expect(dots[0]).toHaveStyle({ backgroundColor: "#000" });
    expect(dots[1]).toHaveStyle({ backgroundColor: "#dc2626" });
    expect(dots[2]).toHaveStyle({ backgroundColor: "#2563eb" });
  });

  it("uses fallback color for unknown color names", () => {
    render(<ColorPreview colors={["unknown-color"]} />);
    const dots = screen.getAllByTestId("color-dot");
    expect(dots[0]).toHaveStyle({ backgroundColor: "#888" });
  });

  it("defaults maxVisible to 4", () => {
    render(
      <ColorPreview colors={["black", "white", "red", "blue", "green"]} />
    );
    const dots = screen.getAllByTestId("color-dot");
    expect(dots).toHaveLength(4);
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("sets title attribute on each dot", () => {
    render(<ColorPreview colors={["black", "red"]} />);
    expect(screen.getByTitle("black")).toBeInTheDocument();
    expect(screen.getByTitle("red")).toBeInTheDocument();
  });
});
