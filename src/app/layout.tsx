import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://predchain.io'),
  title: "PredChain | Elite Football Prediction Arena",
  description: "The premier arena for high-stakes football predictions. Master the 3-day streak to unlock 10X reward multipliers. Secure, professional, and performance-driven.",
  keywords: "football prediction, premium sports tech, reward multiplier, perfect streak, live matches, analytical sports",
  openGraph: {
    title: "PredChain | Predict. Master. Prevail.",
    description: "Secure a 3-day streak. Access elite reward multipliers.",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PredChain | Elite Football Prediction Arena",
    description: "The 3-day streak to 10X multiplier.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="antialiased selection:bg-gold/30 selection:text-white">
        <div className="noise-overlay" aria-hidden="true" />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
