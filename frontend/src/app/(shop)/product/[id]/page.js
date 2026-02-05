"use client";

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

const ProductDetailPage = ({ params }) => {
    // Unwrap params in Next.js 15+
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isActionLoading, setIsActionLoading] = useState(false);
    
    const { user } = useAuth();
    const { toggleWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
    const { cart, addToCart } = useCart();

    const isInCart = cart?.items?.some(item => item.painting_id === id);

    useEffect(() => {
        const getProduct = async () => {
            try {
                setLoading(true);
                const data = await apiRequest(`/paintings/${id}`);
                setProduct(data);
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Product not found or an error occurred.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getProduct();
        }
    }, [id]);

    const isWishlisted = isInWishlist(id);

    const handleWishlistToggle = async () => {
        await toggleWishlist(id);
    };

    const handleAddToCart = async () => {
        if (isActionLoading) return;

        if (isInCart) {
            router.push('/cart');
            return;
        }

        setIsActionLoading(true);
        try {
            await addToCart(product._id || product.id, quantity);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleBuyItNow = async () => {
        if (isActionLoading) return;
        setIsActionLoading(true);
        try {
            await addToCart(product._id || product.id, quantity);
            router.push('/checkout');
        } finally {
            setIsActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-vibrant-teal/20 border-t-vibrant-teal rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-vibrant-pink font-black text-xs">CC</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
                <h1 className="text-4xl font-black mb-4 text-vibrant-pink uppercase tracking-tighter">Oops! Something went wrong.</h1>
                <p className="text-foreground/60 mb-8">{error || "The product you are looking for does not exist."}</p>
                <Link href="/shop" className="px-8 py-3 rounded-full bg-vibrant-teal text-white font-bold hover:shadow-[0_10px_20px_rgba(0,210,255,0.3)] transition-all">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-10 md:py-20 px-4 md:px-8">
            <div className="container mx-auto">
                {/* Breadcrumbs */}
                <nav className="mb-8 flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-foreground/40">
                    <Link href="/shop" className="hover:text-vibrant-pink transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-vibrant-teal">{product.category}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
                    {/* Image Section */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-vibrant-pink to-vibrant-orange rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-[32px] bg-[var(--secondary-surface)] border border-[var(--border-color)] shadow-2xl">
                            {product.image_url && (product.image_url.startsWith('http') || product.image_url.startsWith('/')) ? (
                                <Image 
                                    src={product.image_url} 
                                    alt={product.title} 
                                    fill 
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-vibrant-pink/5">
                                    <span className="text-vibrant-pink font-black text-6xl opacity-20">CC</span>
                                </div>
                            )}
                            
                            {/* Zoom Button Overlay */}
                            <button className="absolute bottom-6 right-6 p-4 glass-vibrant rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <h4 className="text-vibrant-orange font-black text-sm uppercase tracking-widest mb-2">{product.artist}</h4>
                            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase leading-none">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl md:text-4xl font-black text-vibrant-teal">₹{Math.round(product.price)}</span>
                                <div className="px-4 py-1 rounded-full bg-vibrant-pink/10 text-vibrant-pink text-xs font-black uppercase tracking-tighter border border-vibrant-pink/20">
                                    Hand-Painted
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 mb-10">
                            <p className="text-lg text-foreground/85 leading-relaxed max-w-xl">
                                {product.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 max-w-sm">
                                <div className="p-4 rounded-2xl bg-secondary-bg border border-[var(--border-color)]">
                                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-1">Stock Status</span>
                                    <span className={`font-bold ${product.stock > 0 ? 'text-green-500' : 'text-vibrant-pink'}`}>
                                        {product.stock > 0 ? `${product.stock} Units Left` : 'Sold Out'}
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary-bg border border-[var(--border-color)]">
                                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-1">Delivery</span>
                                    <span className="font-bold">Free above ₹499</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center border-2 border-[var(--border-color)] rounded-2xl p-1 bg-secondary-bg">
                                    <button 
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-[var(--secondary-bg-hover)] rounded-xl transition-colors font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-[var(--secondary-bg-hover)] rounded-xl transition-colors font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={isActionLoading || product.stock === 0}
                                    className={`flex-1 py-5 rounded-2xl ${product.stock === 0 ? 'bg-zinc-500' : (isInCart ? 'bg-vibrant-teal' : 'bg-foreground')} text-background font-black text-lg uppercase tracking-tighter hover:bg-vibrant-pink hover:text-white transition-all transform active:scale-[0.98] shadow-xl hover:shadow-vibrant-pink/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground disabled:hover:text-background`}
                                >
                                    {isActionLoading ? 'Processing...' : (product.stock === 0 ? 'Out of Stock' : (isInCart ? 'Go to Cart' : 'Add to Cart'))}
                                </button>
                                <button 
                                    onClick={handleBuyItNow}
                                    disabled={isActionLoading || product.stock === 0}
                                    className="flex-1 py-5 rounded-2xl bg-vibrant-orange text-white font-black text-lg uppercase tracking-tighter hover:shadow-[0_15px_30px_rgba(255,95,0,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                >
                                    {isActionLoading ? 'Processing...' : (product.stock === 0 ? 'Sold Out' : 'Buy It Now')}
                                </button>
                                <button 
                                    onClick={handleWishlistToggle}
                                    disabled={wishlistLoading}
                                    className={`p-5 rounded-2xl border-2 transition-all transform active:scale-[0.98] ${isWishlisted ? 'bg-white border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-[var(--border-color)] hover:border-red-500 text-foreground'}`}
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`h-6 w-6 ${wishlistLoading ? 'animate-pulse' : ''}`} 
                                        fill={isWishlisted ? "#ef4444" : "none"} 
                                        viewBox="0 0 24 24" 
                                        stroke={isWishlisted ? "#ef4444" : "currentColor"}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Extra Info */}
                        <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex flex-wrap gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-vibrant-teal/10 flex items-center justify-center text-vibrant-teal">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold opacity-60">Verified Origin</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-vibrant-pink/10 flex items-center justify-center text-vibrant-pink">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold opacity-60">Secure Packing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
