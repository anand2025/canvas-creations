"use client";
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full glass-vibrant transition-all text-foreground group relative overflow-hidden"
            aria-label="Toggle theme"
            style={{ 
                boxShadow: 'var(--shadow-sm)',
                transitionTimingFunction: 'var(--ease-out-expo)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = theme === 'dark' 
                    ? 'var(--glow-purple), var(--shadow-md)' 
                    : 'var(--glow-orange), var(--shadow-md)';
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            <div 
                className={`transition-all duration-500 ${theme === 'dark' ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-10 opacity-0 rotate-180'}`}
                style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
            >
                {/* Moon Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-vibrant-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            </div>
            <div 
                className={`absolute top-2.5 left-2.5 transition-all duration-500 ${theme === 'light' ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-10 opacity-0 -rotate-180'}`}
                style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
            >
                {/* Sun Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-vibrant-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
            </div>
        </button>
    );
};

export default ThemeToggle;
