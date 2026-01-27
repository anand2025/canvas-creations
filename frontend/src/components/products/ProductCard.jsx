"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiRequest } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist, loading: wishlistContextLoading } = useWishlist();
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    const isWishlisted = isInWishlist(product.id);

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlistLoading(true);
        await toggleWishlist(product.id);
        setWishlistLoading(false);
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCartLoading(true);
        await addToCart(product.id, 1);
        setCartLoading(false);
    };

    return (
        <div className="group relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 hover:border-vibrant-pink/50 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2">
            <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {product.image_url && (product.image_url.startsWith('http') || product.image_url.startsWith('/')) ? (
                        <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-vibrant-pink/10 flex items-center justify-center">
                            <span className="text-vibrant-pink font-black text-4xl opacity-20">CC</span>
                        </div>
                    )}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button 
                            onClick={handleWishlistToggle}
                            disabled={wishlistLoading}
                            className={`p-2 rounded-full glass-vibrant transition-all ${isWishlisted ? 'bg-vibrant-pink text-white' : 'text-white hover:bg-vibrant-pink'}`}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 ${wishlistLoading ? 'animate-pulse' : ''}`} 
                                fill={isWishlisted ? "currentColor" : "none"} 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Link>
            
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold group-hover:text-vibrant-pink transition-colors line-clamp-1">{product.title}</h3>
                    <span className="text-vibrant-teal font-black text-lg">₹{product.price}</span>
                </div>
                <p className="text-foreground/60 text-sm mb-6 line-clamp-2">{product.description}</p>
                
                <button 
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    className={`w-full py-3 rounded-2xl bg-foreground text-background font-bold hover:bg-vibrant-orange hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${cartLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {cartLoading ? (
                        <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
