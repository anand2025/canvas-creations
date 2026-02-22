"use client";
/**
 * Navbar Component
 * This component renders the top navigation bar with a vibrant, artistic touch.
 */
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useDebounce } from '@/hooks/useDebounce';

import ThemeToggle from '@/components/common/ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [prevSearchParam, setPrevSearchParam] = useState(searchParams.get('search') || "");
    const searchInputRef = useRef(null);

    const debouncedSearch = useDebounce(searchQuery, 400);

    const isActive = (path) => pathname === path;

    // Sync input with global search param (Recommended React pattern for syncing state with props/external sources)
    const currentSearchFromURL = searchParams.get('search') || "";
    if (currentSearchFromURL !== prevSearchParam) {
        setPrevSearchParam(currentSearchFromURL);
        setSearchQuery(currentSearchFromURL);
        if (currentSearchFromURL) {
            setIsSearchExpanded(true);
        }
    }

    // Update URL when debounced search changes
    useEffect(() => {
        if (debouncedSearch !== undefined) {
            const params = new URLSearchParams(searchParams.toString());
            const currentParamSearch = params.get('search') || "";
            
            if (debouncedSearch === currentParamSearch) return;

            if (debouncedSearch) {
                params.set('search', debouncedSearch);
            } else {
                params.delete('search');
            }
            
            const newSearchString = params.toString();
            const currentPathWithSearch = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
            const newPathWithSearch = pathname + (newSearchString ? `?${newSearchString}` : '');

            if (newPathWithSearch !== currentPathWithSearch) {
                if (debouncedSearch && pathname !== '/shop') {
                    router.push(`/shop?${newSearchString}`);
                } else if (pathname === '/shop' || debouncedSearch) {
                    router.replace(`${pathname}?${newSearchString}`, { scroll: false });
                }
            }
        }
    }, [debouncedSearch, pathname, router, searchParams]);

    useEffect(() => {
        if (isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

    return (
        <nav className="sticky top-0 z-50 w-full glass-vibrant border-b border-[var(--border-color)] px-6 py-4 transition-all duration-300">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="text-2xl font-black tracking-tighter text-vibrant-pink hover:scale-105 transition-transform">
                    CANVAS<span className="text-vibrant-teal">CREATIONS</span>
                </Link>
                
                <div className="hidden md:flex items-center space-x-8 font-medium">
                    <Link 
                        href="/shop" 
                        className={`transition-colors ${isActive('/shop') ? 'text-vibrant-orange font-bold' : 'hover:text-vibrant-orange'}`}
                    >
                        Shop
                    </Link>
                    <Link 
                        href="/about" 
                        className={`transition-colors ${isActive('/about') ? 'text-vibrant-purple font-bold' : 'hover:text-vibrant-purple'}`}
                    >
                        About
                    </Link>
                    <Link 
                        href="/contact" 
                        className={`transition-colors ${isActive('/contact') ? 'text-vibrant-pink font-bold' : 'hover:text-vibrant-pink'}`}
                    >
                        Contact
                    </Link>
                    {user?.role === 'admin' && (
                        <Link href="/admin" className="text-vibrant-teal font-bold hover:scale-105 transition-transform">
                            Admin
                        </Link>
                    )}
                    {user?.role === 'seller' && (
                        <Link href="/seller" className="text-vibrant-teal font-bold hover:scale-105 transition-transform">
                            Seller Panel
                        </Link>
                    )}
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Search Bar - Authenticated Users Only */}
                    {user && (
                        <div className={`relative flex items-center transition-all duration-500 overflow-hidden ${isSearchExpanded ? 'w-48 md:w-64' : 'w-10'}`}>
                            <button 
                                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                                className={`p-2 rounded-full transition-all group ${isSearchExpanded ? 'text-vibrant-teal' : 'hover:bg-vibrant-teal/10 text-foreground hover:text-vibrant-teal'}`}
                                title="Search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            <input 
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className={`bg-transparent outline-none text-sm font-bold transition-all duration-500 ${isSearchExpanded ? 'w-full ml-2 opacity-100' : 'w-0 opacity-0'}`}
                            />
                            {isSearchExpanded && searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-0 p-1 hover:bg-foreground/5 rounded-full transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}

                    <ThemeToggle />
                    <Link href="/cart" className="relative group p-2 rounded-full hover:bg-vibrant-teal/10 transition-all">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-6 w-6 transition-colors ${isActive('/cart') ? 'text-vibrant-teal' : 'text-foreground group-hover:text-vibrant-teal'}`} 
                            fill={isActive('/cart') ? 'currentColor' : 'none'} 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-vibrant-pink text-[10px] font-black text-white animate-in zoom-in">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <div className="flex items-center space-x-1 md:space-x-4">
                            <Link 
                                href="/wishlist" 
                                className={`p-2 rounded-full transition-all group ${isActive('/wishlist') ? 'text-red-500' : 'hover:bg-red-500/10 text-red-500'}`} 
                                title="Wishlist"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-6 w-6 group-hover:scale-110 transition-transform" 
                                    fill={isActive('/wishlist') ? '#ef4444' : 'none'} 
                                    viewBox="0 0 24 24" 
                                    stroke={isActive('/wishlist') ? '#ef4444' : 'currentColor'}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Link>
                            <Link 
                                href="/profile" 
                                className={`p-2 rounded-full transition-all group ${isActive('/profile') ? 'text-vibrant-teal' : 'hover:bg-vibrant-teal/10 text-vibrant-teal'}`} 
                                title="Profile"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-6 w-6 group-hover:scale-110 transition-transform" 
                                    fill={isActive('/profile') ? 'currentColor' : 'none'} 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                            
                            {/* Desktop Logout Button */}
                            <button 
                                onClick={logout}
                                className="hidden md:block px-6 py-2 rounded-full bg-vibrant-pink text-white font-bold hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] transition-all"
                            >
                                Logout
                            </button>

                            {/* Mobile Menu Trigger (3 Dots) */}
                            <div className="md:hidden relative">
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 rounded-full hover:bg-foreground/10 transition-all text-foreground"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 glass-vibrant border border-[var(--border-color)] rounded-2xl shadow-xl py-2 z-[60] animate-in fade-in slide-in-from-top-2">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-vibrant-pink font-bold hover:bg-vibrant-pink/10 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
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

