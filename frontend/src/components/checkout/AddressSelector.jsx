"use client";

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';

export default function AddressSelector({ onAddressSelect, selectedAddressId }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const data = await apiRequest('/addresses');
            setAddresses(data);
            
            // If there's a default address and no selection yet, select it
            if (!selectedAddressId && data.length > 0) {
                const defaultAddress = data.find(addr => addr.is_default) || data[0];
                onAddressSelect(defaultAddress);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-vibrant-teal/20 border-t-vibrant-teal rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        onClick={() => onAddressSelect(address)}
                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all relative overflow-hidden group ${
                            selectedAddressId === address.id
                                ? 'border-vibrant-pink bg-vibrant-pink/5 scale-[1.02] shadow-lg'
                                : 'border-zinc-200 dark:border-zinc-800 bg-secondary-bg hover:border-vibrant-pink/50'
                        }`}
                    >
                        {selectedAddressId === address.id && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-vibrant-pink rounded-full flex items-center justify-center text-white scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2 mb-3">
                           <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-foreground/5 border border-foreground/10 text-foreground/60 rounded-full">
                               {address.address_type || 'Address'}
                           </span>
                           {address.is_default && (
                               <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-vibrant-teal text-white rounded-full">
                                   Primary
                               </span>
                           )}
                        </div>

                        <h4 className="font-black text-lg mb-1">{address.full_name}</h4>
                        <p className="text-sm opacity-60 leading-relaxed">
                            {address.address_line1}, {address.address_line2 && `${address.address_line2}, `}
                            {address.city}, {address.state} - {address.postal_code}
                        </p>
                        <p className="text-sm font-bold mt-3 text-vibrant-pink">
                            📞 {address.phone}
                        </p>
                    </div>
                ))}

                <div
                    onClick={() => onAddressSelect(null)}
                    className={`p-6 rounded-3xl border-2 border-dashed bg-secondary-bg cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] group ${
                        selectedAddressId === null
                            ? 'border-vibrant-teal bg-vibrant-teal/5 scale-[1.02]'
                            : 'border-zinc-300 dark:border-zinc-700 hover:border-vibrant-teal/50'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                        selectedAddressId === null ? 'bg-vibrant-teal text-white' : 'bg-background shadow-sm border border-[var(--border-color)] group-hover:bg-vibrant-teal/20'
                    }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="font-black uppercase tracking-widest text-sm">Add New Address</span>
                </div>
            </div>
        </div>
    );
}
