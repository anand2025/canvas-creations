"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/services/api';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function WishlistPage() {
    const { user, loading: authLoading } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlistItems = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const data = await apiRequest(`/wishlist/items`);
                setWishlistItems(data);
            } catch (err) {
                console.error("Failed to fetch wishlist items:", err);
                toast.error("Failed to load wishlist.");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchWishlistItems();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-vibrant-teal/20 border-t-vibrant-teal rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-vibrant-pink font-black text-xs">CC</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Your Wishlist is Locked.</h2>
                <p className="text-foreground/60 mb-8 max-w-md">Please login to view and manage your favorite masterpieces.</p>
                <Link href="/login" className="px-10 py-4 rounded-full bg-vibrant-orange text-white font-black uppercase tracking-widest hover:shadow-[0_10px_30px_rgba(255,95,0,0.3)] transition-all">
                    Login Now
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black py-20 px-4 md:px-8">
            <div className="container mx-auto">
                <div className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">
                        YOUR <span className="text-vibrant-pink">WISHLIST.</span>
                    </h1>
                    <p className="text-xl text-foreground/50 font-medium">Items you've fallen in love with.</p>
                </div>

                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlistItems.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-[40px]">
                        <div className="mb-6 inline-flex p-6 rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No masterpieces here yet.</h3>
                        <p className="text-foreground/40 mb-8">Start exploring and save your favorites!</p>
                        <Link href="/shop" className="px-8 py-3 rounded-full bg-vibrant-teal text-white font-bold hover:shadow-[0_10px_20px_rgba(0,210,255,0.3)] transition-all">
                            Browse Collection
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
