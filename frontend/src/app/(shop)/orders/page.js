"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/services/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function OrdersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            toast.error("Please login to view orders");
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await apiRequest('/orders/user');
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) {
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

    if (!user) {
        return null; // Will redirect via useEffect
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: 'text-vibrant-yellow',
            confirmed: 'text-vibrant-teal',
            shipped: 'text-vibrant-purple',
            delivered: 'text-green-500',
            cancelled: 'text-red-500'
        };
        return colors[status] || 'text-foreground/60';
    };

    const getStatusBgColor = (status) => {
        const colors = {
            pending: 'bg-vibrant-yellow/10',
            confirmed: 'bg-vibrant-teal/10',
            shipped: 'bg-vibrant-purple/10',
            delivered: 'bg-green-500/10',
            cancelled: 'bg-red-500/10'
        };
        return colors[status] || 'bg-secondary-bg';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-background py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="mb-12 inline-block">
                        <div className="relative">
                            <div className="w-32 h-32 bg-vibrant-orange/10 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-vibrant-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-vibrant-pink rounded-full flex items-center justify-center border-4 border-background">
                                <span className="text-white font-black">0</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
                        NO ORDERS <span className="text-vibrant-pink">YET.</span>
                    </h1>
                    <p className="text-xl text-foreground/50 mb-10 max-w-2xl mx-auto">
                        You haven&apos;t placed any orders yet. Start shopping and discover amazing artworks!
                    </p>
                    <Link href="/shop" className="px-12 py-5 rounded-full bg-vibrant-teal text-white font-black uppercase tracking-[0.2em] hover:shadow-[0_20px_40px_rgba(0,210,255,0.3)] transition-all inline-block">
                        Browse Collection
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-20 px-4 md:px-8">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
                        YOUR <br />
                        <span className="text-vibrant-pink">ORDERS.</span>
                    </h1>
                    <p className="mt-4 text-xl text-foreground/50 font-medium">
                        Track and manage your orders ({orders.length} {orders.length === 1 ? 'order' : 'orders'})
                    </p>
                </div>

                {/* Orders List */}
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-secondary-bg rounded-[40px] p-8 md:p-12 border border-[var(--border-color)] hover:border-vibrant-pink/20 transition-all">
                            {/* Order Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-foreground/10">
                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <h2 className="text-2xl font-black uppercase tracking-tight">
                                            Order #{order.id.slice(-8).toUpperCase()}
                                        </h2>
                                        <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${getStatusBgColor(order.status)} ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 font-medium">
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Placed on {formatDate(order.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="uppercase">{order.payment_method}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left md:text-right">
                                    <div className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-2">Total Amount</div>
                                    <div className="text-4xl font-black text-vibrant-teal">₹{Math.round(order.grand_total)}</div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-8">
                                <h3 className="text-lg font-black uppercase tracking-tight mb-6 text-foreground/60">Order Items</h3>
                                <div className="grid grid-cols-1 gap-4">
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
                                                <div className="font-black text-lg">₹{Math.round(item.price * item.quantity)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-8">
                                <h3 className="text-lg font-black uppercase tracking-tight mb-4 text-foreground/60">Shipping Address</h3>
                                <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                                    <div className="font-black text-lg mb-2">{order.shipping_address.full_name}</div>
                                    <div className="text-foreground/60 font-medium leading-relaxed">
                                        {order.shipping_address.address_line1}
                                        {order.shipping_address.address_line2 && `, ${order.shipping_address.address_line2}`}
                                        <br />
                                        {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                                        <br />
                                        {order.shipping_address.country}
                                        <br />
                                        <span className="font-bold">Phone: {order.shipping_address.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-background border border-foreground/10 rounded-2xl p-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold uppercase tracking-widest text-sm text-foreground/60">Subtotal</span>
                                        <span className="font-black">₹{Math.round(order.total_price)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold uppercase tracking-widest text-sm text-foreground/60">Shipping</span>
                                        <span className="font-black">₹{Math.round(order.shipping_cost)}</span>
                                    </div>
                                    <div className="h-px bg-foreground/10"></div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-black uppercase tracking-tight text-xl">Grand Total</span>
                                        <span className="font-black text-2xl text-vibrant-teal">₹{Math.round(order.grand_total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-12 text-center">
                    <Link
                        href="/shop"
                        className="inline-block px-12 py-5 rounded-full border-2 border-vibrant-pink text-vibrant-pink hover:bg-vibrant-pink hover:text-white font-black uppercase tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
