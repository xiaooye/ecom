import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Shirts",
    handle: "shirts",
    description: "Classic and modern styles",
    color: "bg-blue-50",
  },
  {
    name: "Sweatshirts",
    handle: "sweatshirts",
    description: "Comfortable everyday wear",
    color: "bg-amber-50",
  },
  {
    name: "Pants",
    handle: "pants",
    description: "Perfect fit for any occasion",
    color: "bg-green-50",
  },
  {
    name: "Merch",
    handle: "merch",
    description: "Exclusive collection items",
    color: "bg-purple-50",
  },
];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.handle}
            href={`/categories/${category.handle}`}
            className={`group relative flex flex-col justify-between rounded-xl ${category.color} p-6 transition-shadow hover:shadow-lg`}
          >
            <div>
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium">
              Shop now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
