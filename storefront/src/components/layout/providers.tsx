"use client";

import { ThemeProvider } from "next-themes";
import { DemoModeBadge } from "@/components/shared/demo-mode-badge";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <DemoModeBadge />
    </ThemeProvider>
  );
}
