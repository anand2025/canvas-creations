"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/services/api';
import Image from 'next/image';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        if (!orderId) {
            router.push('/cart');
            return;
        }

        const fetchOrder = async () => {
            try {
                const orderData = await apiRequest(`/orders/${orderId}`);
                setOrder(orderData);
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [orderId, user, router]);

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

    return (
        <div className="min-h-screen bg-background py-20 px-4 md:px-8">
            <div className="container mx-auto max-w-4xl">
                {/* Success Animation */}
                <div className="text-center mb-12">
                    <div className="inline-block relative mb-8">
                        <div className="w-32 h-32 bg-vibrant-teal/10 rounded-full flex items-center justify-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-vibrant-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-vibrant-pink rounded-full flex items-center justify-center animate-bounce">
                            <span className="text-white font-black text-xl">✓</span>
                        </div>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
                        ORDER <span className="text-vibrant-pink">CONFIRMED!</span>
                    </h1>
                    <p className="text-xl text-foreground/60 mb-4 font-medium">
                        Thank you for your purchase! Your order has been placed successfully.
                    </p>
                    {order && (
                        <div className="inline-block bg-secondary-bg px-8 py-4 rounded-full border border-foreground/10">
                            <span className="text-sm font-bold uppercase tracking-widest text-foreground/50">Order ID: </span>
                            <span className="text-lg font-black text-vibrant-teal">{order.id}</span>
                        </div>
                    )}
                </div>

                {/* Order Details */}
                {order && (
                    <div className="space-y-8">
                        {/* Shipping Information */}
                        <div className="bg-secondary-bg rounded-[40px] p-8 md:p-12 border border-[var(--border-color)]">
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-vibrant-orange flex items-center justify-center text-white text-sm">📦</span>
                                Shipping Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-2">Recipient</div>
                                    <div className="font-black text-lg">{order.shipping_address.full_name}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-2">Phone</div>
                                    <div className="font-black text-lg">{order.shipping_address.phone}</div>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-2">Delivery Address</div>
                                    <div className="font-bold text-lg">
                                        {order.shipping_address.address_line1}
                                        {order.shipping_address.address_line2 && `, ${order.shipping_address.address_line2}`}
                                        <br />
                                        {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                                        <br />
                                        {order.shipping_address.country}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-secondary-bg rounded-[40px] p-8 md:p-12 border border-[var(--border-color)]">
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-vibrant-pink flex items-center justify-center text-white text-sm">🎨</span>
                                Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-6 p-4 bg-background border border-foreground/10 rounded-2xl">
                                        <div className="w-20 h-20 bg-secondary-bg rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-vibrant-pink font-black text-2xl opacity-20">CC</span>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="font-bold text-sm text-foreground/60">Item #{index + 1}</div>
                                            <div className="font-black text-lg">Painting ID: {item.painting_id}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-foreground/60">Qty: {item.quantity}</div>
                                            <div className="font-black text-lg text-vibrant-teal">₹{item.price * item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-foreground text-background dark:bg-white dark:text-black rounded-[40px] p-8 md:p-12 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-vibrant-pink/20 blur-[80px] rounded-full"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-vibrant-teal/20 blur-[80px] rounded-full"></div>
                            
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-8 relative">Payment Summary</h2>
                            <div className="space-y-4 relative">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold uppercase tracking-widest text-sm opacity-60">Subtotal</span>
                                    <span className="font-black text-xl">₹{order.total_price}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold uppercase tracking-widest text-sm opacity-60">Shipping</span>
                                    <span className="font-black text-xl">₹{order.shipping_cost}</span>
                                </div>
                                <div className="h-px bg-current opacity-20"></div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-black uppercase tracking-tight text-2xl">Grand Total</span>
                                    <span className="font-black text-4xl text-vibrant-teal">₹{order.grand_total}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-current/10">
                                    <span className="font-bold uppercase tracking-widest text-sm opacity-60">Payment Method</span>
                                    <span className="font-black text-lg uppercase">{order.payment_method}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold uppercase tracking-widest text-sm opacity-60">Payment Status</span>
                                    <span className="font-black text-lg uppercase text-vibrant-orange">{order.payment_status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                    <Link
                        href="/shop"
                        className="px-12 py-5 rounded-full bg-vibrant-pink hover:bg-vibrant-orange text-white text-center font-black uppercase tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        href="/orders"
                        className="px-12 py-5 rounded-full border-2 border-vibrant-teal text-vibrant-teal hover:bg-vibrant-teal hover:text-white text-center font-black uppercase tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95"
                    >
                        View All Orders
                    </Link>
                </div>

                {/* Estimated Delivery */}
                <div className="mt-12 text-center">
                    <div className="inline-block bg-vibrant-yellow/10 border border-vibrant-yellow/20 px-8 py-4 rounded-full">
                        <span className="text-sm font-bold uppercase tracking-widest text-foreground/60">Estimated Delivery: </span>
                        <span className="text-lg font-black">5-7 Business Days</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-vibrant-teal/20 border-t-vibrant-teal rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-vibrant-pink font-black text-xs">CC</span>
                    </div>
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
