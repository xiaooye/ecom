import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/header";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    header: ({
      children,
      className,
      ...rest
    }: React.PropsWithChildren<{ className?: string }>) => (
      <header className={className}>{children}</header>
    ),
    div: ({
      children,
      className,
      ...rest
    }: React.PropsWithChildren<{ className?: string }>) => (
      <div className={className}>{children}</div>
    ),
  },
  useScroll: () => ({
    scrollY: { getPrevious: () => 0 },
  }),
  useMotionValueEvent: vi.fn(),
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
    ...props
  }: React.PropsWithChildren<{ href: string; className?: string }>) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Search: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="search-icon" className={className as string} {...props} />
  ),
  ShoppingBag: ({ className, ...props }: Record<string, unknown>) => (
    <svg
      data-testid="shopping-bag-icon"
      className={className as string}
      {...props}
    />
  ),
  User: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="user-icon" className={className as string} {...props} />
  ),
  Menu: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="menu-icon" className={className as string} {...props} />
  ),
  Heart: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="heart-icon" className={className as string} {...props} />
  ),
  Moon: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="moon-icon" className={className as string} {...props} />
  ),
  Sun: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="sun-icon" className={className as string} {...props} />
  ),
  Bell: ({ className, ...props }: Record<string, unknown>) => (
    <svg data-testid="bell-icon" className={className as string} {...props} />
  ),
  XIcon: (props: Record<string, unknown>) => (
    <svg data-testid="x-icon" {...props} />
  ),
  X: (props: Record<string, unknown>) => <svg data-testid="x-icon" {...props} />,
  Loader2: (props: Record<string, unknown>) => (
    <svg data-testid="loader-icon" {...props} />
  ),
  SearchIcon: (props: Record<string, unknown>) => (
    <svg data-testid="search-icon-primitive" {...props} />
  ),
  Package: (props: Record<string, unknown>) => (
    <svg data-testid="package-icon" {...props} />
  ),
  Tag: (props: Record<string, unknown>) => (
    <svg data-testid="tag-icon" {...props} />
  ),
  Sparkles: (props: Record<string, unknown>) => (
    <svg data-testid="sparkles-icon" {...props} />
  ),
  Check: (props: Record<string, unknown>) => (
    <svg data-testid="check-icon" {...props} />
  ),
}));

// Mock radix-ui
vi.mock("radix-ui", () => {
  const React = require("react");
  const Dialog = {
    Root: ({ children, ...props }: React.PropsWithChildren) => (
      <div data-slot="sheet">{children}</div>
    ),
    Trigger: ({
      children,
      asChild,
      ...props
    }: React.PropsWithChildren<{ asChild?: boolean }>) => (
      <div data-slot="sheet-trigger">{children}</div>
    ),
    Portal: ({ children }: React.PropsWithChildren) => <>{children}</>,
    Overlay: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    Content: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div>{children}</div>
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
    }: React.PropsWithChildren<Record<string, unknown>>) => <>{children}</>,
  };
  return { Dialog, Slot };
});

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
}));

// Mock cart-count (it fetches from medusa)
vi.mock("@/components/layout/cart-count", () => ({
  CartCount: () => null,
}));

// Mock notification-center (complex component with animations)
vi.mock("@/components/layout/notification-center", () => ({
  NotificationCenter: () => (
    <button data-testid="notification-center">Notifications</button>
  ),
}));

// Mock cmdk
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

// Mock medusa products (used by SearchDialog)
vi.mock("@/lib/medusa/products", () => ({
  getProductsList: vi.fn().mockResolvedValue({ products: [] }),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock medusa cart (used by CartCount)
vi.mock("@/lib/medusa/cart", () => ({
  getCart: vi.fn().mockResolvedValue({ cart: { items: [] } }),
}));

describe("Header", () => {
  it('renders store name "WebStore"', () => {
    render(<Header />);
    expect(screen.getByText("WebStore")).toBeInTheDocument();
  });

  it("has navigation links", () => {
    render(<Header />);
    expect(screen.getByText("Shop All")).toBeInTheDocument();
    expect(screen.getByText("Shirts")).toBeInTheDocument();
    expect(screen.getByText("Pants")).toBeInTheDocument();
    expect(screen.getByText("Sweatshirts")).toBeInTheDocument();
  });

  it("has search area", () => {
    render(<Header />);
    // The search dialog trigger renders "Search..." text
    expect(screen.getByText("Search...")).toBeInTheDocument();
  });

  it("has cart icon", () => {
    render(<Header />);
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  it("has account icon", () => {
    render(<Header />);
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("has links to correct paths", () => {
    render(<Header />);

    // Home link
    const homeLink = screen.getByText("WebStore").closest("a");
    expect(homeLink?.getAttribute("href")).toBe("/");

    // Account link
    const accountLink = screen.getByText("Account").closest("a");
    expect(accountLink?.getAttribute("href")).toBe("/account");

    // Cart link
    const cartLink = screen.getByText("Cart").closest("a");
    expect(cartLink?.getAttribute("href")).toBe("/cart");
  });

  it("has navigation links with correct hrefs", () => {
    render(<Header />);

    // Navigation links rendered in desktop nav (there may also be mobile copies)
    const shopAllLinks = screen.getAllByText("Shop All");
    expect(shopAllLinks.length).toBeGreaterThanOrEqual(1);

    // Check a link has the correct href
    const link = shopAllLinks[0].closest("a");
    expect(link?.getAttribute("href")).toBe("/products");
  });
});
