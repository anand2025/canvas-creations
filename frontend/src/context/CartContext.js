"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from '@/services/api';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [cart, setCart] = useState({ items: [], total_price: 0 });
    const [loading, setLoading] = useState(true);

    const fetchCart = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await apiRequest('/cart');
            setCart(data);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading) {
            fetchCart();
        }
    }, [user, authLoading, fetchCart]);

    // Helper to recalculate total from items
    const calcTotal = (items) =>
        items.reduce((acc, item) => acc + (item.item_total || 0), 0);

    const addToCart = async (painting_id, quantity = 1) => {
        if (!user) {
            toast.error("Please login to add items to cart.");
            return;
        }
        try {
            await apiRequest('/cart', {
                method: 'POST',
                body: JSON.stringify({ painting_id, quantity }),
            });
            toast.success("Added to cart!");
            // Fetch to get full painting_details for the new item
            fetchCart();
        } catch (err) {
            toast.error("Failed to add to cart.");
        }
    };

    const updateQuantity = async (painting_id, quantity) => {
        // --- Optimistic update ---
        const prevCart = cart;
        setCart(prev => {
            const updatedItems = prev.items.map(item =>
                item.painting_id === painting_id
                    ? {
                        ...item,
                        quantity,
                        item_total: (item.painting_details?.price ?? 0) * quantity,
                    }
                    : item
            );
            return { ...prev, items: updatedItems, total_price: calcTotal(updatedItems) };
        });

        try {
            await apiRequest('/cart', {
                method: 'PUT',
                body: JSON.stringify({ painting_id, quantity }),
            });
            // Sync silently in background to keep totals accurate
            fetchCart();
        } catch (err) {
            // Rollback on failure
            setCart(prevCart);
            toast.error("Failed to update quantity.");
        }
    };

    const removeFromCart = async (painting_id) => {
        // --- Optimistic update ---
        const prevCart = cart;
        const removedItem = cart.items.find(item => item.painting_id === painting_id);
        setCart(prev => {
            const updatedItems = prev.items.filter(item => item.painting_id !== painting_id);
            return {
                ...prev,
                items: updatedItems,
                total_price: prev.total_price - (removedItem?.item_total ?? 0),
            };
        });

        try {
            await apiRequest(`/cart/${painting_id}`, { method: 'DELETE' });
            toast.success("Removed from cart");
        } catch (err) {
            // Rollback on failure
            setCart(prevCart);
            toast.error("Failed to remove item.");
        }
    };

    const clearCart = async () => {
        const prevCart = cart;
        // Optimistic clear
        setCart({ items: [], total_price: 0 });
        try {
            await apiRequest('/cart', { method: 'DELETE' });
            toast.success("Cart cleared");
        } catch (err) {
            setCart(prevCart);
            toast.error("Failed to clear cart.");
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            refreshCart: fetchCart,
            itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0)
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
