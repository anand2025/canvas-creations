"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from "@/components/products/ProductCard";
import { fetchData } from '@/services/api';

const categories = ["All", "Abstract", "Miniature", "Floral", "Landscape"];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchData('/paintings');
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Could not load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="bg-white dark:bg-black min-h-screen py-20 px-6">
      <div className="container mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">OUR <span className="text-vibrant-teal italic">COLLECTION.</span></h1>
          <p className="text-xl text-foreground/60 max-w-2xl">Browse our unique collection of hand-painted mini canvases and artistic creations, where every piece tells a story.</p>
        </header>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 border-b border-zinc-100 dark:border-zinc-900 pb-8">
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button 
                key={cat}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  cat === "All" 
                    ? "bg-vibrant-pink text-white shadow-[0_10px_20px_rgba(255,0,127,0.3)]" 
                    : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Sort By:</span>
            <select className="flex-1 md:flex-none px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full font-bold text-sm focus:outline-none focus:ring-2 ring-vibrant-teal">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-vibrant-teal/20 border-t-vibrant-teal rounded-full animate-spin mb-4"></div>
            <p className="text-vibrant-teal font-bold animate-pulse uppercase tracking-widest text-sm">Loading Masterpieces...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-black text-vibrant-pink mb-4 uppercase tracking-tighter">Art Block!</h2>
            <p className="text-foreground/60">{error}</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="text-6xl mb-6 opacity-20">🎨</div>
                <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">No products found</h3>
                <p className="text-foreground/60">We're currently preparing new canvases. Check back soon!</p>
              </div>
            )}
          </>
        )}
        
        {/* Load More */}
        {products.length > 0 && (
          <div className="mt-20 text-center">
            <button className="px-12 py-4 rounded-full border-2 border-foreground font-black hover:bg-foreground hover:text-background transition-all">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
