import "./globals.css";
import type { ReactNode } from "react";
import { Oswald, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${inter.variable} min-h-screen flex flex-col bg-white`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
