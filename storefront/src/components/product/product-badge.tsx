import { cn } from "@/lib/utils";

type BadgeVariant = "new" | "sale" | "out-of-stock";

const variants: Record<BadgeVariant, string> = {
  new: "bg-emerald-500 text-white",
  sale: "bg-red-500 text-white",
  "out-of-stock": "bg-neutral-500 text-white",
};

const labels: Record<BadgeVariant, string> = {
  new: "New",
  sale: "Sale",
  "out-of-stock": "Sold Out",
};

export function ProductBadge({ variant }: { variant: BadgeVariant }) {
  return (
    <span
      className={cn(
        "absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm",
        variants[variant]
      )}
    >
      {labels[variant]}
    </span>
  );
}
