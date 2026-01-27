"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from '@/services/api';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            setWishlistItems([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await apiRequest('/wishlist');
            setWishlistItems(data.paintings || []);
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
            setWishlistItems([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading) {
            fetchWishlist();
        }
    }, [user, authLoading, fetchWishlist]);

    const toggleWishlist = async (paintingId) => {
        if (!user) {
            toast.error("Please login to manage your wishlist.", {
                icon: '🔒',
            });
            return;
        }

        const isCurrentlyWishlisted = wishlistItems.includes(paintingId);
        const newWishlistItems = isCurrentlyWishlisted
            ? wishlistItems.filter(id => id !== paintingId)
            : [...wishlistItems, paintingId];

        try {
            // Optimistic update
            setWishlistItems(newWishlistItems);

            await apiRequest('/wishlist', {
                method: 'POST',
                body: JSON.stringify({
                    user_id: user.id,
                    paintings: newWishlistItems
                })
            });

            toast.success(isCurrentlyWishlisted ? "Removed from wishlist" : "Added to wishlist", {
                duration: 2000,
                icon: isCurrentlyWishlisted ? '💔' : '💖',
            });
        } catch (err) {
            console.error("Failed to update wishlist:", err);
            // Rollback optimistic update
            setWishlistItems(wishlistItems);
            toast.error("Failed to update wishlist.");
        }
    };

    const isInWishlist = (paintingId) => wishlistItems.includes(paintingId);

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            loading,
            toggleWishlist,
            isInWishlist,
            refreshWishlist: fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
