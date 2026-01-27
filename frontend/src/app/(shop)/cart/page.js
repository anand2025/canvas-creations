"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
    const { user, loading: authLoading } = useAuth();
    const { cart, loading, updateQuantity, removeFromCart, clearCart, itemCount } = useCart();

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
                <div className="mb-8 p-8 rounded-full bg-zinc-50 dark:bg-zinc-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Your Cart is Locked.</h2>
                <p className="text-foreground/60 mb-8 max-w-md">Please login to access your shopping cart and complete your collection.</p>
                <Link href="/login" className="px-10 py-4 rounded-full bg-vibrant-orange text-white font-black uppercase tracking-widest hover:shadow-[0_10px_30px_rgba(255,95,0,0.3)] transition-all">
                    Login Now
                </Link>
            </div>
        );
    }

    if (itemCount === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-black py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="mb-12 inline-block">
                        <div className="relative">
                            <div className="w-32 h-32 bg-vibrant-pink/10 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-vibrant-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-vibrant-orange rounded-full flex items-center justify-center border-4 border-white dark:border-black">
                                <span className="text-white font-black">0</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
                        YOUR CART IS <span className="text-vibrant-pink">EMPTY.</span>
                    </h1>
                    <p className="text-xl text-foreground/50 mb-10 max-w-2xl mx-auto">It looks like you haven't added any masterpieces to your collection yet. Start exploring and find something that speaks to you.</p>
                    <Link href="/shop" className="px-12 py-5 rounded-full bg-vibrant-teal text-white font-black uppercase tracking-[0.2em] hover:shadow-[0_20px_40px_rgba(0,210,255,0.3)] transition-all inline-block">
                        Browse Collection
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black py-20 px-4 md:px-8">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
                            YOUR <br />
                            <span className="text-vibrant-pink">CART.</span>
                        </h1>
                        <p className="mt-4 text-xl text-foreground/50 font-medium">Review your selected masterpieces ({itemCount} {itemCount === 1 ? 'item' : 'items'}).</p>
                    </div>
                    <button 
                        onClick={() => clearCart()}
                        className="text-foreground/40 hover:text-vibrant-red font-bold uppercase tracking-widest text-sm transition-colors"
                    >
                        Clear All Items
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="xl:col-span-2 space-y-6">
                        {cart.items.map((item) => (
                            <div key={item.painting_id} className="group relative bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border border-transparent hover:border-white/10 dark:hover:border-white/5 transition-all">
                                {/* Product Image */}
                                <div className="relative w-full md:w-48 aspect-square rounded-3xl overflow-hidden bg-white dark:bg-zinc-800 flex-shrink-0">
                                    {item.painting_details.image_url ? (
                                        <Image
                                            src={item.painting_details.image_url}
                                            alt={item.painting_details.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-vibrant-pink/20 font-black text-4xl">CC</div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-grow text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight mb-1 group-hover:text-vibrant-pink transition-colors">
                                                {item.painting_details.title}
                                            </h3>
                                            <p className="text-vibrant-teal font-bold">${item.painting_details.price} per item</p>
                                        </div>
                                        <div className="text-2xl font-black text-foreground/80">
                                            ${item.item_total}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-center md:justify-start gap-8">
                                        <div className="flex items-center bg-white dark:bg-black rounded-full p-2 border border-zinc-200 dark:border-zinc-800">
                                            <button 
                                                onClick={() => updateQuantity(item.painting_id, Math.max(1, item.quantity - 1))}
                                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-black text-xl"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center font-black text-lg">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.painting_id, item.quantity + 1)}
                                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-black text-xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.painting_id)}
                                            className="text-foreground/30 hover:text-vibrant-pink font-bold uppercase text-xs tracking-[0.2em] transition-colors"
                                        >
                                            Remove Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Section */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-24 bg-foreground text-background dark:bg-white dark:text-black rounded-[50px] p-10 overflow-hidden relative shadow-2xl">
                            {/* Decorative Blobs */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-vibrant-pink/20 blur-[80px] rounded-full"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-vibrant-teal/20 blur-[80px] rounded-full"></div>

                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 relative">Order Summary.</h2>
                            
                            <div className="space-y-6 mb-10 relative">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="opacity-60 font-bold uppercase tracking-widest text-sm">Subtotal</span>
                                    <span className="font-black">${cart.total_price}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="opacity-60 font-bold uppercase tracking-widest text-sm">Shipping</span>
                                    <span className="font-black text-vibrant-pink uppercase text-sm tracking-widest">Calculated at next step</span>
                                </div>
                                <div className="h-px bg-current opacity-10"></div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="font-black uppercase tracking-tighter text-2xl leading-none">Total</span>
                                    <div className="text-right">
                                        <div className="text-vibrant-teal font-black text-5xl leading-none">${cart.total_price}</div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mt-2">All taxes included</p>
                                    </div>
                                </div>
                            </div>

                            <Link 
                                href="/checkout" 
                                className="block w-full py-6 rounded-full bg-vibrant-pink hover:bg-vibrant-orange text-white text-center font-black uppercase tracking-[0.3em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl relative"
                            >
                                Checkout Now
                            </Link>

                            <Link href="/shop" className="block text-center mt-6 text-sm font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity">
                                Or Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
