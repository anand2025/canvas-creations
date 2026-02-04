"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark'); // Default to dark as per existing state

    useEffect(() => {
        const applyTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            const themeToApply = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
            
            if (themeToApply !== theme) {
                setTheme(themeToApply);
            }
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(themeToApply);
        };

        // Use setTimeout to avoid synchronous setState in effect warning
        const timer = setTimeout(applyTheme, 0);
        return () => clearTimeout(timer);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        
        // Update document class
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
        
        // Save to localStorage
        localStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
