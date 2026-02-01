"use client";
/**
 * Navbar Component
 * This component renders the top navigation bar with a vibrant, artistic touch.
 */
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();

    return (
        <nav className="sticky top-0 z-50 w-full glass-vibrant border-b border-white/10 px-6 py-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="text-2xl font-black tracking-tighter text-vibrant-pink hover:scale-105 transition-transform">
                    CANVAS<span className="text-vibrant-teal">CREATIONS</span>
                </Link>
                
                <div className="hidden md:flex items-center space-x-8 font-medium">
                    <Link href="/shop" className="hover:text-vibrant-orange transition-colors">Shop</Link>
                    <Link href="/about" className="hover:text-vibrant-purple transition-colors">About</Link>
                    <Link href="/contact" className="hover:text-vibrant-pink transition-colors">Contact</Link>
                    {user?.role === 'admin' && (
                        <Link href="/admin" className="text-vibrant-teal font-bold hover:scale-105 transition-transform">
                            Admin
                        </Link>
                    )}
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <Link href="/cart" className="relative group p-2 rounded-full hover:bg-vibrant-teal/10 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-foreground group-hover:text-vibrant-teal transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-vibrant-pink text-[10px] font-black text-white animate-in zoom-in">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <>
                            <Link href="/wishlist" className="p-2 rounded-full hover:bg-vibrant-pink/10 text-vibrant-pink transition-all group" title="Wishlist">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Link>
                            <Link href="/profile" className="p-2 rounded-full hover:bg-vibrant-teal/10 text-vibrant-teal transition-all group" title="Profile">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                            <button 
                                onClick={logout}
                                className="px-6 py-2 rounded-full bg-vibrant-pink text-white font-bold hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] transition-all"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="px-6 py-2 rounded-full bg-vibrant-orange text-white font-bold hover:shadow-[0_0_20px_rgba(255,95,0,0.5)] transition-all">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
