/**
 * Contact Page
 * A vibrant, artistic contact page with integrated support options.
 */
import React from 'react';
import Image from 'next/image';
import contactBg from '@/assets/images/contact-bg.png';

const ContactPage = () => {
    return (
        <main className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={contactBg} 
                        alt="Artistic background" 
                        fill 
                        className="object-cover opacity-30 blur-sm scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background"></div>
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
                        <div className="group p-10 rounded-[40px] bg-secondary-bg border border-[var(--border-color)] hover:border-vibrant-pink/50 transition-all hover:shadow-2xl text-center">
                            <div className="w-20 h-20 bg-vibrant-pink rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-vibrant-pink/20 group-hover:scale-110 group-hover:shadow-vibrant-pink/40 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-2">Call</h3>
                            <p className="text-2xl font-black text-foreground">+91 88888 88888</p>
                        </div>

                        {/* WhatsApp Card */}
                        <div className="group p-10 rounded-[40px] bg-secondary-bg border border-[var(--border-color)] hover:border-vibrant-teal/50 transition-all hover:shadow-2xl text-center">
                            <div className="w-20 h-20 bg-vibrant-teal rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-vibrant-teal/20 group-hover:scale-110 group-hover:shadow-vibrant-teal/40 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-2">WhatsApp</h3>
                            <p className="text-2xl font-black text-foreground">+91 88888 88888</p>
                        </div>

                        {/* Email Card */}
                        <div className="group p-10 rounded-[40px] bg-secondary-bg border border-[var(--border-color)] hover:border-vibrant-orange/50 transition-all hover:shadow-2xl text-center">
                            <div className="w-20 h-20 bg-vibrant-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-vibrant-orange/20 group-hover:scale-110 group-hover:shadow-vibrant-orange/40 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-2">Email</h3>
                            <p className="text-2xl font-black text-foreground">canvascreations@gmail.com</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gifting Section */}
            <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/50">
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
                        <div className="p-8 rounded-[30px] bg-card border border-[var(--border-color)] shadow-xl w-full max-w-md">
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
