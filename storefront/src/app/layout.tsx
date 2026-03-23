import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "WebStore — Clothing E-Commerce",
    template: "%s | WebStore",
  },
  description:
    "Shop the latest clothing collections. Quality apparel for every style.",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WebStore",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WebStore",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
            >
              Skip to content
            </a>
            <div className="flex min-h-screen flex-col">
              <AnnouncementBar />
              <Header />
              <main id="main-content" className="flex-1 pb-16 md:pb-0">{children}</main>
              <Footer />
              <MobileNav />
            </div>
            <CartSheet />
            <ScrollToTop />
            <ScrollProgress />
            <CookieConsent />
            <Toaster position="bottom-right" richColors closeButton />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
