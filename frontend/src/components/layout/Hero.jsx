/**
 * Hero Component
 * A bold, vibrant hero section to grab attention.
 */
import React from 'react';
import Link from 'next/link';

const Hero = () => {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-background py-20 px-6">
            {/* Enhanced Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[700px] h-[700px] bg-vibrant-pink/25 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-vibrant-teal/25 blur-[150px] rounded-full"></div>
            
            <div className="container mx-auto relative z-10 text-center">
                <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none" style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.1)' }}>
                    UNLEASH YOUR <span className="text-vibrant-pink italic">CREATIVITY.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-xl md:text-2xl text-foreground mb-10 font-medium opacity-90">
                    Discover a world of vibrant mini-paintings and handmade masterpieces that bring color to every corner of your life.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link 
                        href="/shop" 
                        className="px-10 py-4 rounded-full text-white text-xl font-bold transition-all"
                        style={{ 
                            background: 'var(--gradient-vibrant)',
                            boxShadow: 'var(--shadow-md)',
                            transitionTimingFunction: 'var(--ease-out-expo)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = 'var(--glow-pink), var(--shadow-lg)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                    >
                        Explore Collection
                    </Link>
                    <Link 
                        href="/about" 
                        className="px-10 py-4 rounded-full border-2 border-vibrant-teal text-vibrant-teal text-xl font-bold transition-all"
                        style={{ 
                            boxShadow: 'var(--shadow-sm)',
                            transitionTimingFunction: 'var(--ease-out-expo)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--vibrant-teal)';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = 'var(--glow-teal), var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--vibrant-teal)';
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }}
                    >
                        Learn More
                    </Link>
                </div>
            </div>

            {/* Enhanced Floating decorative elements */}
            <div 
                className="absolute top-1/4 left-10 w-12 h-12 bg-vibrant-yellow rotate-12 rounded-lg hidden lg:block"
                style={{ 
                    animation: 'bounce 3s ease-in-out infinite',
                    boxShadow: 'var(--shadow-md)'
                }}
            ></div>
            <div 
                className="absolute bottom-1/4 right-20 w-16 h-16 bg-vibrant-purple -rotate-12 rounded-full hidden lg:block"
                style={{ 
                    animation: 'pulse 4s ease-in-out infinite',
                    boxShadow: 'var(--shadow-md)'
                }}
            ></div>
        </section>
    );
};

export default Hero;
