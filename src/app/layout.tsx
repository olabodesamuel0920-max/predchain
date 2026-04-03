import type { Metadata } from "next";
import { Outfit, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PredChain — Premium Football Prediction Challenge Platform",
  description: "Buy an account, enter a 3-day live football challenge, predict 1 live match per day, and complete the full 3/3 perfect streak to unlock the 10X cash reward. Premium. Elite. Verified.",
  keywords: "football prediction, challenge platform, cash reward, perfect streak, live matches, leaderboard",
  openGraph: {
    title: "PredChain — Premium Football Prediction Challenge",
    description: "Build the perfect 3-match streak. Unlock the 10X cash reward.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
