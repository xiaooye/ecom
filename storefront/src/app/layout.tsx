import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { Providers } from "@/components/layout/providers";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/layout/cart-sheet";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { CompareBar } from "@/components/shared/compare-bar";
import { LenisScroll } from "@/components/layout/lenis-scroll";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { KeyboardShortcuts } from "@/components/shared/keyboard-shortcuts";
import { CurrencySelector } from "@/components/shared/currency-selector";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1714" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "THREAD — Modern Essentials",
    template: "%s | THREAD",
  },
  description:
    "Thoughtfully crafted clothing for the modern wardrobe. Premium fabrics, timeless design.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "THREAD",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "THREAD",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
          <link rel="preconnect" href="https://images.unsplash.com" />
        </head>
        <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
            >
              Skip to content
            </a>
            <LenisScroll />
            <div className="flex min-h-screen flex-col">
              <AnnouncementBar />
              <Header />
              <main id="main-content" className="flex-1 pb-16 md:pb-0">{children}</main>
              <Footer />
              <MobileNav />
            </div>
            <CartSheet />
            <KeyboardShortcuts />
            <ScrollToTop />
            <ScrollProgress />
            <CompareBar />
            <CookieConsent />
            <Toaster position="bottom-right" richColors closeButton />
            <Analytics />
            <SpeedInsights />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
