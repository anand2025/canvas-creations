/**
 * Root Layout
 * This file defines the global layout structure applied to all pages in the application.
 */
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "Canvas & Creations | Vibrant Handcrafted Art",
  description: "Explore our collection of bright and vibrant mini-paintings and handmade crafts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-vibrant-pink selection:text-white transition-colors duration-300`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Toaster 
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      background: 'var(--toast-bg)',
                      color: 'var(--toast-color)',
                      borderRadius: '16px',
                      border: '1px solid var(--toast-border)',
                      padding: '16px',
                      fontWeight: '600'
                    },
                    success: {
                      iconTheme: {
                        primary: '#FF007F',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
                <Navbar />
                {children}
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
