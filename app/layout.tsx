import Footer from './components/Footer';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    // 👇 PERHATIKAN: suppressHydrationWarning DITARUH DISINI
    <html lang="en" className="scroll-smooth scroll-pt-24" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}