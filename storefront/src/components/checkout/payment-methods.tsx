import { CreditCard } from "lucide-react";

const methods = [
  { name: "Visa", display: "Visa" },
  { name: "Mastercard", display: "MC" },
  { name: "Amex", display: "Amex" },
  { name: "Apple Pay", display: "Pay" },
];

export function PaymentMethods() {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-muted-foreground">We accept</p>
      <div className="flex items-center gap-2">
        {methods.map((m) => (
          <div
            key={m.name}
            className="flex h-8 items-center justify-center rounded border bg-background px-2.5"
            title={m.name}
          >
            <span className="text-[10px] font-semibold text-muted-foreground">
              {m.display}
            </span>
          </div>
        ))}
        <div className="flex h-8 items-center justify-center rounded border bg-background px-2.5" title="Credit Card">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
