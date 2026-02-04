/**
 * AuthLayout Component
 * A consistent, high-end layout for auth pages (Login/Register).
 */
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AuthLayout = ({ children, title, subtitle, image }) => {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background overflow-hidden transition-colors duration-500">
            {/* Left: Artistic Side */}
            <div className="relative hidden lg:flex items-center justify-center p-12 overflow-hidden bg-zinc-950">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={image || "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&auto=format&fit=crop&q=80"} 
                        fill
                        className="object-cover opacity-60 scale-105"
                        alt="Artistic background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-vibrant-pink/40 via-vibrant-purple/40 to-transparent mix-blend-overlay"></div>
                </div>
                
                <div className="relative z-10 max-w-lg text-white">
                    <Link href="/" className="text-3xl font-black tracking-tighter mb-12 block hover:scale-105 transition-transform">
                        CANVAS<span className="text-vibrant-teal">CREATIONS</span>
                    </Link>
                    <h2 className="text-5xl font-black leading-tight mb-6 mt-20">
                        {title || "Welcome Back to the World of Color."}
                    </h2>
                    <p className="text-xl text-white/70 font-medium">
                        {subtitle || "Join thousands of art enthusiasts and find your next masterpiece."}
                    </p>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-vibrant-yellow blur-[60px] opacity-20 rounded-full"></div>
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-vibrant-teal blur-[80px] opacity-20 rounded-full"></div>
            </div>

            {/* Right: Form Side */}
            <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-hidden">
                {/* Mobile logo */}
                <div className="lg:hidden absolute top-8 left-8">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-vibrant-pink">
                        CANVAS<span className="text-vibrant-teal">CREATIONS</span>
                    </Link>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {children}
                </div>

                {/* Subtle background glow for mobile/right side */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-vibrant-pink/5 blur-[100px] -z-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-vibrant-teal/5 blur-[100px] -z-10"></div>
            </div>
        </div>
    );
};

export default AuthLayout;
