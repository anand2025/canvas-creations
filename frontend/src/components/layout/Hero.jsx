/**
 * Hero Component
 * A bold, vibrant hero section to grab attention.
 */
import React from 'react';
import Link from 'next/link';

const Hero = () => {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white dark:bg-black py-20 px-6">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-vibrant-pink/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-vibrant-teal/20 blur-[120px] rounded-full"></div>
            
            <div className="container mx-auto relative z-10 text-center">
                <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
                    UNLEASH YOUR <span className="text-vibrant-pink italic">CREATIVITY.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-xl md:text-2xl text-foreground/70 mb-10 font-medium">
                    Discover a world of vibrant mini-paintings and handmade masterpieces that bring color to every corner of your life.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/shop" className="px-10 py-4 rounded-full bg-vibrant-pink text-white text-xl font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,127,0.4)] transition-all">
                        Explore Collection
                    </Link>
                    <Link href="/about" className="px-10 py-4 rounded-full border-2 border-vibrant-teal text-vibrant-teal text-xl font-bold hover:bg-vibrant-teal hover:text-white transition-all">
                        Learn More
                    </Link>
                </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute top-1/4 left-10 w-12 h-12 bg-vibrant-yellow rotate-12 rounded-lg animate-bounce hidden lg:block"></div>
            <div className="absolute bottom-1/4 right-20 w-16 h-16 bg-vibrant-purple -rotate-12 rounded-full animate-pulse hidden lg:block"></div>
        </section>
    );
};

export default Hero;
