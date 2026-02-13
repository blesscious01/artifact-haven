import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "./components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Ganti Metadata supaya nama tab browser jadi Artifact Haven
export const metadata: Metadata = {
  title: "Artifact Haven | Authentic Anime Figures",
  description: "Rare anime figures sourced from Japan & Philippines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. scroll-smooth: Biar meluncur
    // 3. scroll-pt-24: PENTING! Supaya pas scroll berhenti, judulnya gak ketutupan Header
    <html lang="en" className="scroll-smooth scroll-pt-24">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        {children}
        
        {/* 4. PASANG FOOTER DISINI SUPAYA MUNCUL 👇 */}
        <Footer />
      </body>
    </html>
  );
}