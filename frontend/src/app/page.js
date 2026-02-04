/**
 * Main Landing Page (Home)
 * This file serves as the entry point for the application's home page (route: /).
 * It currently displays the default Next.js template and should be replaced with the e-commerce storefront.
 */
"use client";
import Image from "next/image";

import React from 'react';
import Hero from "@/components/layout/Hero";
import ProductCard from "@/components/products/ProductCard";

import { apiRequest } from "@/services/api";
import { useEffect, useState } from "react";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState(null); // { type: 'success' | 'error', message: string }

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const data = await apiRequest('/paintings/bestsellers');
        if (data && data.length > 0) {
            setFeaturedProducts(data);
        } else {
             // Fallback to empty or keep mock if desired, but user asked to replace hardcoded
             setFeaturedProducts([]); 
        }
      } catch (error) {
        console.error("Failed to fetch bestsellers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setSubscribing(true);
    setSubscribeStatus(null);

    try {
      const response = await apiRequest('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: newsletterEmail }),
      });

      setSubscribeStatus({
        type: 'success',
        message: "Thank you for subscribing!"
      });
      setNewsletterEmail("");
    } catch (error) {
      setSubscribeStatus({
        type: 'error',
        message: error.toJSON ? error.message : "Something went wrong. Please try again."
      });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <main className="bg-background min-h-screen">
      <Hero />
      
      {/* Featured Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-vibrant-teal font-black text-sm uppercase tracking-widest mb-2">Editor&apos;s Choice</h2>
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
            {loading ? (
                // Simple skeletons
                [1, 2, 3].map(i => (
                    <div key={i} className="h-96 bg-secondary-bg rounded-3xl animate-pulse"></div>
                ))
            ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                    <p>Coming soon! Check back later for our featured collection.</p>
                </div>
            )}
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
              <p className="text-xl opacity-90 mb-10">Join our newsletter and stay updated with our latest collections and offers.</p>
              
              <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="email" 
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 placeholder:text-white/60 focus:outline-none focus:ring-2 ring-vibrant-yellow font-medium"
                    disabled={subscribing}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={subscribing}
                  className="px-10 py-4 rounded-2xl bg-white text-vibrant-pink font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {subscribing ? "Subscribing..." : "Subscribe"}
                </button>
              </form>

              {subscribeStatus && (
                <div className={`mt-6 p-4 rounded-xl backdrop-blur-md border ${
                  subscribeStatus.type === 'success' 
                    ? 'bg-green-500/20 border-green-500/30 text-white' 
                    : 'bg-red-500/20 border-red-500/30 text-white'
                } animate-in fade-in slide-in-from-top-2 duration-300`}>
                  <p className="font-medium flex items-center gap-2">
                    {subscribeStatus.type === 'success' ? (
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {subscribeStatus.message}
                  </p>
                </div>
              )}
            </div>
            
            {/* Abstract shapes in CTA */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-vibrant-teal/30 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-vibrant-yellow/30 blur-[40px] rounded-full translate-y-1/2"></div>
          </div>
        </div>
      </section>
      
      {/* Footer minimal info */}
      <footer className="py-12 border-t border-[var(--border-color)] px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-foreground/50 font-bold">© 2026 CANVAS CREATIONS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-foreground/60 font-black uppercase text-xs tracking-widest">
            <a href="#" className="hover:text-vibrant-pink transition-colors">Instagram</a>
            <a href="#" className="hover:text-vibrant-orange transition-colors">Pinterest</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
