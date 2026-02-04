/**
 * About Page
 * A creative and artisanal page storytelling the brand's mission.
 */
import React from 'react';
import Image from 'next/image';
import heroPainting from '@/assets/images/hero-painting.png';
import craftsDisplay from '@/assets/images/crafts-display.png';
import studioVibe from '@/assets/images/studio-vibe.png';

const AboutPage = () => {
    return (
        <main className="bg-background min-h-screen">
            {/* Hero Section with Tagline */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={studioVibe} 
                        alt="Studio background" 
                        fill 
                        className="object-cover opacity-20 blur-sm scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background"></div>
                </div>

                <div className="container mx-auto relative z-10 text-center">
                    <h1 className="text-vibrant-pink font-black text-sm uppercase tracking-[0.3em] mb-8">Our Philosophy</h1>
                    <p className="max-w-4xl mx-auto text-4xl md:text-6xl font-black leading-tight tracking-tight italic text-foreground mb-12 transition-colors duration-500">
                        &quot;We believe that every <span className="text-vibrant-teal font-black">brushstroke</span> tells a story, every craft holds a <span className="text-vibrant-orange font-black">dream</span>, and every creation sparks a new adventure.&quot;
                    </p>
                    <div className="w-24 h-1 bg-vibrant-pink mx-auto rounded-full"></div>
                </div>
            </section>

            {/* Split Content Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-vibrant-gradient opacity-20 blur-2xl group-hover:opacity-30 transition-opacity rounded-[40px]"></div>
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] shadow-2xl">
                            <Image 
                                src={heroPainting} 
                                alt="Artistic painting" 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Decorative Badge */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-vibrant-yellow flex items-center justify-center p-6 rounded-full shadow-2xl transform rotate-12">
                            <span className="text-black font-black text-center text-sm leading-tight uppercase tracking-tighter">
                                100% Handcrafted with Love
                            </span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-5xl font-black tracking-tighter">OUR <span className="text-vibrant-orange italic">STORY.</span></h2>
                        <p className="text-xl text-foreground/70 leading-relaxed font-medium">
                            Our carefully curated collection of paintings, handmade crafts, and unique gift items is designed to add a touch of artistry and a splash of joy to your everyday moments. What started as a small passion has blossomed into a vibrant business dedicated to sharing the magic of creation with you.
                        </p>
                        <p className="text-xl text-foreground/70 leading-relaxed font-medium">
                            Whether it&apos;s a miniature canvas for your desk or a paper craft gift for a loved one, we pour our heart into every detail, ensuring that each piece you take home is truly one-of-a-kind.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6 pt-8">
                            <div className="p-8 rounded-[30px] bg-secondary-bg border border-[var(--border-color)]">
                                <span className="text-3xl font-black text-vibrant-pink block mb-2">500+</span>
                                <span className="font-bold text-foreground/40 uppercase text-xs tracking-widest">Creations Made</span>
                            </div>
                            <div className="p-8 rounded-[30px] bg-secondary-bg border border-[var(--border-color)]">
                                <span className="text-3xl font-black text-vibrant-teal block mb-2">Unique</span>
                                <span className="font-bold text-foreground/40 uppercase text-xs tracking-widest">Artisanal Gifts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-24 px-6 bg-secondary-bg">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">THE ART OF <span className="text-vibrant-purple italic">MAKING.</span></h2>
                        <p className="text-foreground/50 font-medium">Step into our world of paper, paint, and possibilities.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="relative aspect-video rounded-[30px] overflow-hidden shadow-xl">
                            <Image 
                                src={craftsDisplay} 
                                alt="Crafts display" 
                                fill 
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex flex-col justify-center space-y-6 lg:p-12">
                            <h3 className="text-3xl font-bold tracking-tight">Paper Crafts & Beyond</h3>
                            <p className="text-lg text-foreground/60 font-medium">
                                Beyond the canvas, we explore the intricate world of paper crafts and unique gift items. Every creation is an adventure, designed to spark inspiration in your own space.
                            </p>
                            <a href="/shop" className="inline-block px-8 py-4 bg-vibrant-teal text-white font-black rounded-full hover:scale-105 transition-all w-fit shadow-[0_10px_20px_rgba(0,210,255,0.3)]">
                                VISIT OUR SHOP
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AboutPage;
