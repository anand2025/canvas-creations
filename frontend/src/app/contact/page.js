/**
 * Contact Page
 * A vibrant, artistic contact page with integrated support options.
 */
import React from 'react';
import Image from 'next/image';
import contactBg from '@/assets/images/contact-bg.png';

const ContactPage = () => {
    return (
        <main className="bg-white dark:bg-black min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={contactBg} 
                        alt="Artistic background" 
                        fill 
                        className="object-cover opacity-30 blur-sm scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white dark:from-black/60 dark:via-transparent dark:to-black"></div>
                </div>

                <div className="container mx-auto relative z-10 text-center">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
                        GET IN <span className="text-vibrant-pink italic">TOUCH.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-foreground/70 font-medium">
                        Have a question about a painting or want a custom craft? We're here to bring more color to your world.
                    </p>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-20 px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Call Card */}
                        <div className="group p-10 rounded-[40px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-vibrant-pink/50 transition-all hover:shadow-2xl text-center">
                            <div className="w-20 h-20 bg-vibrant-pink/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-vibrant-pink group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-2">Call</h3>
                            <p className="text-2xl font-black text-foreground">+91 88888 88888</p>
                        </div>

                        {/* WhatsApp Card */}
                        <div className="group p-10 rounded-[40px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-vibrant-teal/50 transition-all hover:shadow-2xl text-center">
                            <div className="w-20 h-20 bg-vibrant-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-vibrant-teal group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.894 4.44-9.899 9.891-.001 2.15.636 4.143 1.738 5.926l-1.019 3.725 3.78-.991zm11.233-5.242c-.321-.16-.1.901-.4.161-.26-.13-1.547-.57-2.093-.806-.545-.237-.941-.355-1.335.237-.394.591-1.534 1.946-1.882 2.339-.348.394-.697.442-1.417.042-.72-.4-3.04-1.12-5.79-3.575-2.14-1.912-3.584-4.272-4.005-5.001-.421-.73-.045-1.124.355-1.52.36-.357.787-.905 1.182-1.356.39-.452.525-.77.787-1.284.26-.514.13-.961-.064-1.356-.194-.394-1.534-3.696-2.115-5.087-.56-1.354-1.144-1.168-1.574-1.19-.408-.021-.876-.025-1.344-.025-.468 0-1.232.175-1.874.873-.642.698-2.454 2.4-2.454 5.849 0 3.45 2.508 6.776 2.857 7.249.348.473 4.936 7.536 11.956 10.565 1.669.721 2.972 1.151 3.987 1.472 1.676.53 3.2.456 4.405.275 1.343-.201 4.134-1.688 4.712-3.315.577-1.625.577-3.018.405-3.314-.172-.296-.64-.473-.96-.633z"/></svg>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-2">WhatsApp</h3>
                            <p className="text-2xl font-black text-foreground">+91 88888 88888</p>
                        </div>

                        {/* Email Card */}
                        <div className="group p-10 rounded-[40px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-vibrant-orange/50 transition-all hover:shadow-2xl text-center">
                            <div className="w-20 h-20 bg-vibrant-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-vibrant-orange group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-2">Email</h3>
                            <p className="text-2xl font-black text-foreground">canvascreations@gmail.com</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gifting Section */}
            <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-5xl font-black mb-8 tracking-tighter">Gifting Made <span className="text-vibrant-purple italic">Easy.</span></h2>
                    <p className="text-xl text-foreground/70 leading-relaxed font-medium mb-12">
                        Paintings work as a fabulous gift option. Marking an occasion or just celebrating someone, you can't go wrong with a hand-picked set of mini-canvases! Leave a lasting impression with our tastefully packaged gift sets. Contact us for bulk or customized orders for weddings, housewarmings, and everything in between.
                    </p>
                    <div className="flex flex-col items-center">
                        <div className="text-vibrant-pink animate-pulse mb-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </div>
                        <div className="p-8 rounded-[30px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl w-full max-w-md">
                            <h4 className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-4">Availability</h4>
                            <p className="text-lg font-bold">Monday to Saturday</p>
                            <p className="text-lg font-bold text-vibrant-teal">10:30 am - 6:30 pm IST</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ContactPage;
