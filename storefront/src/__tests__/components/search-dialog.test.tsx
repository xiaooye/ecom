import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchDialog } from "@/components/layout/search-dialog";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Search: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="search-icon" className={className as string} {...props} />
  ),
  Loader2: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="loader-icon" className={className as string} {...props} />
  ),
  SearchIcon: ({ className, ...props }: Record<string, unknown>) => (
    <svg
      data-testid="search-icon-primitive"
      className={className as string}
      {...props}
    />
  ),
  XIcon: (props: Record<string, unknown>) => (
    <svg data-testid="x-icon" {...props} />
  ),
}));

// Mock medusa products
vi.mock("@/lib/medusa/products", () => ({
  getProductsList: vi.fn().mockResolvedValue({ products: [] }),
}));

// Mock cmdk - provide minimal working components
vi.mock("cmdk", () => {
  const React = require("react");
  const Command = React.forwardRef(
    (
      { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
      ref: React.Ref<HTMLDivElement>
    ) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  );
  Command.displayName = "Command";
  Command.Input = React.forwardRef(
    (props: Record<string, unknown>, ref: React.Ref<HTMLInputElement>) => (
      <input ref={ref} {...props} />
    )
  );
  Command.Input.displayName = "Command.Input";
  Command.List = React.forwardRef(
    (
      { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
      ref: React.Ref<HTMLDivElement>
    ) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  );
  Command.List.displayName = "Command.List";
  Command.Empty = React.forwardRef(
    (
      { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
      ref: React.Ref<HTMLDivElement>
    ) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  );
  Command.Empty.displayName = "Command.Empty";
  Command.Group = React.forwardRef(
    (
      { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
      ref: React.Ref<HTMLDivElement>
    ) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  );
  Command.Group.displayName = "Command.Group";
  Command.Item = React.forwardRef(
    (
      { children, ...props }: React.PropsWithChildren<Record<string, unknown>>,
      ref: React.Ref<HTMLDivElement>
    ) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  );
  Command.Item.displayName = "Command.Item";
  Command.Separator = React.forwardRef(
    (props: Record<string, unknown>, ref: React.Ref<HTMLDivElement>) => (
      <div ref={ref} {...props} />
    )
  );
  Command.Separator.displayName = "Command.Separator";
  return { Command };
});

// Mock radix-ui Dialog
vi.mock("radix-ui", () => {
  const React = require("react");
  const Dialog = {
    Root: ({ children, open }: React.PropsWithChildren<{ open?: boolean }>) =>
      open ? <div data-testid="dialog-root">{children}</div> : null,
    Trigger: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    Portal: ({ children }: React.PropsWithChildren) => <>{children}</>,
    Overlay: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    Content: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    Title: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <h2 {...props}>{children}</h2>
    ),
    Description: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <p {...props}>{children}</p>
    ),
    Close: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <button {...props}>{children}</button>
    ),
  };
  const Slot = {
    Root: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  };
  return { Dialog, Slot };
});

describe("SearchDialog", () => {
  it("renders search trigger button", () => {
    render(<SearchDialog />);
    const trigger = screen.getByText("Search...");
    expect(trigger).toBeInTheDocument();
  });

  it("shows keyboard shortcut indicator", () => {
    render(<SearchDialog />);
    const shortcut = screen.getByText(/⌘K/);
    expect(shortcut).toBeInTheDocument();
  });

  it("trigger button contains a search icon", () => {
    render(<SearchDialog />);
    const icons = screen.getAllByTestId("search-icon");
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });
});
