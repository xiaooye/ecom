import Link from "next/link";
import { Search, Home, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const popularCategories = [
  { name: "Shirts", href: "/categories/shirts" },
  { name: "Pants", href: "/categories/pants" },
  { name: "Sweatshirts", href: "/categories/sweatshirts" },
  { name: "Accessories", href: "/categories/accessories" },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      {/* Large 404 */}
      <p className="text-9xl font-black text-muted/50">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 text-muted-foreground">
        Sorry, we couldn&apos;t find what you&apos;re looking for. It might have
        been moved or no longer exists.
      </p>

      {/* Search */}
      <form
        action="/search"
        className="mx-auto mt-8 flex max-w-md gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search for products..."
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Quick links */}
      <div className="mt-10">
        <p className="text-sm font-medium text-muted-foreground">
          Popular categories
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {popularCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="inline-flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              {cat.name}
              <ArrowRight className="h-3 w-3" />
            </Link>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse All
          </Link>
        </Button>
      </div>
    </div>
  );
}
