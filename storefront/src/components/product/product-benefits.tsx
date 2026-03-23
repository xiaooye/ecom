import { Truck, RefreshCw, Shield, Leaf } from "lucide-react";

const benefits = [
  { icon: Truck, text: "Free shipping over $50" },
  { icon: RefreshCw, text: "30-day easy returns" },
  { icon: Shield, text: "2-year warranty" },
  { icon: Leaf, text: "Sustainably made" },
];

export function ProductBenefits() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {benefits.map((benefit) => (
        <div
          key={benefit.text}
          className="flex items-center gap-2 rounded-lg border px-3 py-2"
        >
          <benefit.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{benefit.text}</span>
        </div>
      ))}
    </div>
  );
}
