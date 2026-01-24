/**
 * Root Layout
 * This file defines the global layout structure applied to all pages in the application.
 * It includes global configurations such as fonts, metadata (SEO), and global CSS styles.
 */
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Canvas & Creations | Vibrant Handcrafted Art",
  description: "Explore our collection of bright and vibrant mini-paintings and handmade crafts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-vibrant-pink selection:text-white`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
