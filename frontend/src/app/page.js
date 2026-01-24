/**
 * Main Landing Page (Home)
 * This file serves as the entry point for the application's home page (route: /).
 * It currently displays the default Next.js template and should be replaced with the e-commerce storefront.
 */
import Image from "next/image";

import React from 'react';
import Hero from "@/components/layout/Hero";
import ProductCard from "@/components/products/ProductCard";

// Mock data for featured products
const featuredProducts = [
  {
    id: "1",
    title: "Neon Sunset",
    description: "A breathtaking mini-canvas capturing the essence of a neon sunset over a digital sea.",
    price: 45.00,
    image_url: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "2",
    title: "Vibrant Bloom",
    description: "Hand-painted floral masterpiece with layered textures and brilliant teals.",
    price: 38.00,
    image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "3",
    title: "Electric Dreams",
    description: "An abstract exploration of color and light on a 4x4 mini canvas.",
    price: 52.00,
    image_url: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&auto=format&fit=crop&q=60"
  }
];

export default function Home() {
  return (
    <main className="bg-white dark:bg-black min-h-screen">
      <Hero />
      
      {/* Featured Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-vibrant-teal font-black text-sm uppercase tracking-widest mb-2">Editor's Choice</h2>
              <h3 className="text-4xl md:text-5xl font-black">FEATURED <span className="text-vibrant-orange italic">PIECES.</span></h3>
            </div>
            <a href="/shop" className="group flex items-center gap-2 text-lg font-bold hover:text-vibrant-pink transition-colors">
              View All Shop
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[400px] bg-vibrant-purple/5 blur-[100px] -z-10"></div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="relative rounded-[40px] bg-vibrant-gradient p-12 md:p-20 overflow-hidden shadow-[0_40px_80px_rgba(255,0,127,0.3)]">
            <div className="relative z-10 max-w-2xl text-white">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">READY TO ADD SOME <br/><span className="text-vibrant-yellow italic">COLOR?</span></h2>
              <p className="text-xl opacity-90 mb-10">Join our newsletter and get 15% off your first purchase of handmade art.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 placeholder:text-white/60 focus:outline-none focus:ring-2 ring-vibrant-yellow font-medium"
                />
                <button className="px-10 py-4 rounded-2xl bg-white text-vibrant-pink font-black hover:scale-105 active:scale-95 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
            
            {/* Abstract shapes in CTA */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-vibrant-teal/30 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-vibrant-yellow/30 blur-[40px] rounded-full translate-y-1/2"></div>
          </div>
        </div>
      </section>
      
      {/* Footer minimal info */}
      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-900 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-zinc-500 font-medium">© 2026 CANVAS CREATIONS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-zinc-500 font-bold uppercase text-xs tracking-widest">
            <a href="#" className="hover:text-vibrant-pink">Instagram</a>
            <a href="#" className="hover:text-vibrant-teal">Twitter</a>
            <a href="#" className="hover:text-vibrant-orange">Pinterest</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
