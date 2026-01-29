"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/services/api';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { cart, loading: cartLoading, itemCount } = useCart();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        payment_method: 'cod'
    });
    
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Redirect if not logged in
        if (!authLoading && !user) {
            toast.error("Please login to checkout");
            router.push('/login');
        }
        
        // Redirect if cart is empty
        if (!cartLoading && itemCount === 0) {
            toast.error("Your cart is empty");
            router.push('/cart');
        }
    }, [user, authLoading, itemCount, cartLoading, router]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.full_name.trim()) {
            newErrors.full_name = "Full name is required";
        }
        
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (!phoneDigits || phoneDigits.length < 10) {
            newErrors.phone = "Valid phone number is required (min 10 digits)";
        }
        
        if (!formData.address_line1.trim()) {
            newErrors.address_line1 = "Address is required";
        }
        
        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }
        
        if (!formData.state.trim()) {
            newErrors.state = "State is required";
        }
        
        const postalDigits = formData.postal_code.replace(/\D/g, '');
        if (!postalDigits || postalDigits.length !== 6) {
            newErrors.postal_code = "Valid 6-digit postal code is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const checkoutData = {
                shipping_address: {
                    full_name: formData.full_name,
                    phone: formData.phone,
                    address_line1: formData.address_line1,
                    address_line2: formData.address_line2,
                    city: formData.city,
                    state: formData.state,
                    postal_code: formData.postal_code,
                    country: formData.country
                },
                payment_method: formData.payment_method
            };
            
            const response = await apiRequest('/checkout', {
                method: 'POST',
                body: JSON.stringify(checkoutData)
            });
            
            toast.success("Order placed successfully!");
            router.push(`/checkout/success?order_id=${response.order_id}`);
            
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error(error.message || "Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || cartLoading) {
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

    if (!user || itemCount === 0) {
        return null; // Will redirect via useEffect
    }

    const shippingCost = cart.total_price < 2000 ? 100 : 0;
    const grandTotal = cart.total_price + shippingCost;

    return (
        <div className="min-h-screen bg-white dark:bg-black py-20 px-4 md:px-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
                        SECURE <br />
                        <span className="text-vibrant-pink">CHECKOUT.</span>
                    </h1>
                    <p className="mt-4 text-xl text-foreground/50 font-medium">Complete your order in just a few steps.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Shipping Information */}
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] p-8 md:p-12 border border-white/5">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-full bg-vibrant-teal flex items-center justify-center text-white font-black text-xl">
                                        1
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight">Shipping Information</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-foreground/60">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                            className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border-2 ${errors.full_name ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:border-vibrant-pink focus:outline-none transition-colors font-medium`}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.full_name && <p className="mt-2 text-sm text-red-500 font-medium">{errors.full_name}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-foreground/60">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border-2 ${errors.phone ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:border-vibrant-pink focus:outline-none transition-colors font-medium`}
                                            placeholder="10-digit mobile number"
                                        />
                                        {errors.phone && <p className="mt-2 text-sm text-red-500 font-medium">{errors.phone}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-foreground/60">
                                            Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleInputChange}
                                            className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border-2 ${errors.postal_code ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:border-vibrant-pink focus:outline-none transition-colors font-medium`}
                                            placeholder="6-digit PIN code"
                                        />
                                        {errors.postal_code && <p className="mt-2 text-sm text-red-500 font-medium">{errors.postal_code}</p>}
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-foreground/60">
                                            Address Line 1 *
                                        </label>
                                        <input
                                            type="text"
                                            name="address_line1"
                                            value={formData.address_line1}
                                            onChange={handleInputChange}
                                            className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border-2 ${errors.address_line1 ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:border-vibrant-pink focus:outline-none transition-colors font-medium`}
                                            placeholder="House no., Building name"
                                        />
                                        {errors.address_line1 && <p className="mt-2 text-sm text-red-500 font-medium">{errors.address_line1}</p>}
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-foreground/60">
                                            Address Line 2
                                        </label>
                                        <input
                                            type="text"
                                            name="address_line2"
                                            value={formData.address_line2}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 focus:border-vibrant-pink focus:outline-none transition-colors font-medium"
                                            placeholder="Road name, Area, Colony (optional)"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-foreground/60">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border-2 ${errors.city ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:border-vibrant-pink focus:outline-none transition-colors font-medium`}
                                            placeholder="Enter city"
                                        />
                                        {errors.city && <p className="mt-2 text-sm text-red-500 font-medium">{errors.city}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-foreground/60">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border-2 ${errors.state ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:border-vibrant-pink focus:outline-none transition-colors font-medium`}
                                            placeholder="Enter state"
                                        />
                                        {errors.state && <p className="mt-2 text-sm text-red-500 font-medium">{errors.state}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] p-8 md:p-12 border border-white/5">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-full bg-vibrant-orange flex items-center justify-center text-white font-black text-xl">
                                        2
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight">Payment Method</h2>
                                </div>
                                
                                <div className="space-y-4">
                                    {[
                                        { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order' },
                                        { value: 'card', label: 'Credit/Debit Card', desc: 'Secure payment via card' },
                                        { value: 'upi', label: 'UPI Payment', desc: 'Pay using UPI apps' }
                                    ].map((method) => (
                                        <label
                                            key={method.value}
                                            className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                                                formData.payment_method === method.value
                                                    ? 'border-vibrant-pink bg-vibrant-pink/5'
                                                    : 'border-zinc-200 dark:border-zinc-800 hover:border-vibrant-pink/50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={method.value}
                                                checked={formData.payment_method === method.value}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 text-vibrant-pink focus:ring-vibrant-pink"
                                            />
                                            <div className="flex-grow">
                                                <div className="font-black text-lg">{method.label}</div>
                                                <div className="text-sm text-foreground/50 font-medium">{method.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-foreground text-background dark:bg-white dark:text-black rounded-[50px] p-10 overflow-hidden relative shadow-2xl">
                            {/* Decorative Blobs */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-vibrant-pink/20 blur-[80px] rounded-full"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-vibrant-teal/20 blur-[80px] rounded-full"></div>

                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 relative">Order Summary.</h2>
                            
                            {/* Cart Items */}
                            <div className="space-y-4 mb-8 max-h-64 overflow-y-auto relative">
                                {cart.items.map((item) => (
                                    <div key={item.painting_id} className="flex gap-4 items-center">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex-shrink-0">
                                            {item.painting_details.image_url ? (
                                                <Image
                                                    src={item.painting_details.image_url}
                                                    alt={item.painting_details.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-vibrant-pink/20 font-black text-xs">CC</div>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="font-bold text-sm truncate">{item.painting_details.title}</div>
                                            <div className="text-xs opacity-60">Qty: {item.quantity}</div>
                                        </div>
                                        <div className="font-black text-sm">₹{item.item_total}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-6 mb-10 relative">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="opacity-60 font-bold uppercase tracking-widest text-sm">Subtotal</span>
                                    <span className="font-black">₹{cart.total_price}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="opacity-60 font-bold uppercase tracking-widest text-sm">Shipping</span>
                                    <span className="font-black">{shippingCost === 0 ? <span className="text-vibrant-teal text-xs">FREE</span> : `₹${shippingCost}`}</span>
                                </div>
                                <div className="h-px bg-current opacity-10"></div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="font-black uppercase tracking-tighter text-2xl leading-none">Total</span>
                                    <div className="text-right">
                                        <div className="text-vibrant-teal font-black text-5xl leading-none">₹{grandTotal}</div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mt-2">All taxes included</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="block w-full py-6 rounded-full bg-vibrant-pink hover:bg-vibrant-orange text-white text-center font-black uppercase tracking-[0.3em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl relative disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
