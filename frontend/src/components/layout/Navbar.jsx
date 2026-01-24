/**
 * Navbar Component
 * This component renders the top navigation bar with a vibrant, artistic touch.
 */
import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full glass-vibrant border-b border-white/10 px-6 py-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="text-2xl font-black tracking-tighter text-vibrant-pink hover:scale-105 transition-transform">
                    CANVAS<span className="text-vibrant-teal">CREATIONS</span>
                </Link>
                
                <div className="hidden md:flex items-center space-x-8 font-medium">
                    <Link href="/shop" className="hover:text-vibrant-orange transition-colors">Shop</Link>
                    <Link href="/about" className="hover:text-vibrant-purple transition-colors">About</Link>
                    <Link href="/cart" className="relative group">
                        <span className="hover:text-vibrant-teal transition-colors">Cart</span>
                        <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-vibrant-pink text-[10px] text-white">0</span>
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Link href="/login" className="px-6 py-2 rounded-full bg-vibrant-orange text-white font-bold hover:shadow-[0_0_20px_rgba(255,95,0,0.5)] transition-all">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
