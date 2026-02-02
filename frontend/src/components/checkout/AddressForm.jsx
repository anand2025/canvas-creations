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
                    className={`w-full px-6 py-4 rounded-2xl bg-secondary-bg border-2 ${errors.full_name ? 'border-red-500' : 'border-foreground/10'} focus:border-vibrant-pink focus:outline-none transition-all font-medium text-foreground placeholder:text-foreground/30`}
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
                    className={`w-full px-6 py-4 rounded-2xl bg-secondary-bg border-2 ${errors.phone ? 'border-red-500' : 'border-foreground/10'} focus:border-vibrant-pink focus:outline-none transition-all font-medium text-foreground placeholder:text-foreground/30`}
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
                    className={`w-full px-6 py-4 rounded-2xl bg-secondary-bg border-2 ${errors.postal_code ? 'border-red-500' : 'border-foreground/10'} focus:border-vibrant-pink focus:outline-none transition-all font-medium text-foreground placeholder:text-foreground/30`}
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
                    className={`w-full px-6 py-4 rounded-2xl bg-secondary-bg border-2 ${errors.address_line1 ? 'border-red-500' : 'border-foreground/10'} focus:border-vibrant-pink focus:outline-none transition-all font-medium text-foreground placeholder:text-foreground/30`}
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
                    className="w-full px-6 py-4 rounded-2xl bg-secondary-bg border-2 border-foreground/10 focus:border-vibrant-pink focus:outline-none transition-all font-medium text-foreground placeholder:text-foreground/30"
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
                    className={`w-full px-6 py-4 rounded-2xl bg-secondary-bg border-2 ${errors.city ? 'border-red-500' : 'border-foreground/10'} focus:border-vibrant-pink focus:outline-none transition-all font-medium text-foreground placeholder:text-foreground/30`}
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
                    className={`w-full px-6 py-4 rounded-2xl bg-secondary-bg border-2 ${errors.state ? 'border-red-500' : 'border-foreground/10'} focus:border-vibrant-pink focus:outline-none transition-all font-medium text-foreground placeholder:text-foreground/30`}
                    placeholder="Enter state"
                />
                {errors.state && <p className="mt-2 text-sm text-red-500 font-medium">{errors.state}</p>}
            </div>
        </div>
    );
}
