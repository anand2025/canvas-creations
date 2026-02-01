"use client";

import React from 'react';

export default function AddressForm({ formData, errors, onInputChange }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm font-bold uppercase tracking-widest mb-3 text-foreground/60">
                    Full Name *
                </label>
                <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={onInputChange}
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
                    onChange={onInputChange}
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
                    onChange={onInputChange}
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
                    onChange={onInputChange}
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
                    onChange={onInputChange}
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
                    onChange={onInputChange}
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
                    onChange={onInputChange}
                    className={`w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border-2 ${errors.state ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:border-vibrant-pink focus:outline-none transition-colors font-medium`}
                    placeholder="Enter state"
                />
                {errors.state && <p className="mt-2 text-sm text-red-500 font-medium">{errors.state}</p>}
            </div>
        </div>
    );
}
