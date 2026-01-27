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
            fetchCart();
        } catch (err) {
            toast.error("Failed to add to cart.");
        }
    };

    const updateQuantity = async (painting_id, quantity) => {
        try {
            await apiRequest('/cart', {
                method: 'PUT',
                body: JSON.stringify({ painting_id, quantity }),
            });
            fetchCart();
        } catch (err) {
            toast.error("Failed to update quantity.");
        }
    };

    const removeFromCart = async (painting_id) => {
        try {
            await apiRequest(`/cart/${painting_id}`, {
                method: 'DELETE',
            });
            toast.success("Removed from cart");
            fetchCart();
        } catch (err) {
            toast.error("Failed to remove item.");
        }
    };

    const clearCart = async () => {
        try {
            await apiRequest('/cart', {
                method: 'DELETE',
            });
            setCart({ items: [], total_price: 0 });
            toast.success("Cart cleared");
        } catch (err) {
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
