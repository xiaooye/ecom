import { ShieldCheck, Lock } from "lucide-react";

export function SecureBadge() {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-muted/30 px-4 py-3">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-green-600" />
        <span className="text-xs font-medium">SSL Encrypted</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <span className="text-xs font-medium">Secure Checkout</span>
      </div>
    </div>
  );
}
