"use client";
/**
 * AuthContext
 * This context manages the authentication state of the user across the application.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { clearTokens } from '@/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate state from localStorage or a profile API call
        const access = localStorage.getItem('access_token');
        const role = localStorage.getItem('user_role');
        if (access) {
            setUser({ role }); // Simplified, in a real app you'd fetch profile
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        if (userData.role) {
            localStorage.setItem('user_role', userData.role);
        }
    };

    const logout = () => {
        setUser(null);
        clearTokens();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin', loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
