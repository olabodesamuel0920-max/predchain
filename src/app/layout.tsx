import type { Metadata } from "next";
import { Outfit, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
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
  title: "PredChain | Elite Football Prediction Arena",
  description: "Join the premier arena for top-tier football predictions. Build a 3-day sequence to unlock 10X reward multipliers. Premium, verified, and high-performance.",
  keywords: "football prediction, premium sports tech, cash reward, perfect streak, live matches, analytics",
  openGraph: {
    title: "PredChain | Predict. Perform. Prevail.",
    description: "Maintain a 3-day sequence. Unlock the 10X reward multiplier.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
