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
        // Hydrate state from localStorage
        const access = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        if (access && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData.user);
        if (userData.user) {
            localStorage.setItem('user', JSON.stringify(userData.user));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        clearTokens();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin', loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
