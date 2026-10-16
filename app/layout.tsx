import "./globals.css";
import type { ReactNode } from "react";
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
import { Oswald } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LanguageProvider from "@/lib/i18n/LanguageProvider";
import { SelectScrollFix } from "@/components/ui/select-scroll-fix";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300","400","500"],   // light, regular, medium
  variable: "--font-oswald",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} min-h-screen flex flex-col bg-white`}
      >
        <LanguageProvider>
          <SelectScrollFix />
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
