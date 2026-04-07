import type { Metadata } from "next";
import { Sora, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PredChain — Elite Football Prediction Arena",
  description: "Secure your node account, analyze the arena, and maintain a perfect 3-day streak to unlock 10X reward multipliers. Premium. High-Integrity. Verified.",
  keywords: "football prediction, challenge platform, cash reward, perfect streak, live matches, leaderboard",
  openGraph: {
    title: "PredChain — Elite Football Prediction Arena",
    description: "Maintain the 3-day perfect streak. Unlock the 10X reward multiplier.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
