"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, MapPin, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/medusa/customer";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/profile", label: "Profile", icon: User },
];

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore
    }
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            pathname.startsWith(item.href)
              ? "bg-muted font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </button>
    </nav>
  );
}
