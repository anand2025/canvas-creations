"use client";
/**
 * AuthContext
 * This context manages the authentication state of the user across the application.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearTokens } from '@/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const hydrate = () => {
            const access = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
            const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            
            if (access && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } catch (error) {
                    console.error("Failed to parse stored user", error);
                }
            }
            setLoading(false);
        };

        const timer = setTimeout(hydrate, 0);
        return () => clearTimeout(timer);
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
        localStorage.removeItem('user_role');
        clearTokens();
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin', loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
