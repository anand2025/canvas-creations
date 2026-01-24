import React from 'react';
import ProductCard from "@/components/products/ProductCard";

// Mock data for shop products
const shopProducts = [
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
  },
  {
    id: "4",
    title: "Azure Waves",
    description: "Soothing deep blue and teal abstract painting with gold leaf accents.",
    price: 42.00,
    image_url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "5",
    title: "Crimson Spark",
    description: "A fiery mix of reds and oranges, perfect for a bold statement.",
    price: 35.00,
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "6",
    title: "Golden Hour",
    description: "Warm tones and soft textures reflecting the beauty of the twilight sky.",
    price: 48.00,
    image_url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&auto=format&fit=crop&q=60"
  }
];

const categories = ["All", "Abstract", "Miniature", "Floral", "Landscape"];

export default function ShopPage() {
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12">
          {shopProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Load More */}
        <div className="mt-20 text-center">
          <button className="px-12 py-4 rounded-full border-2 border-foreground font-black hover:bg-foreground hover:text-background transition-all">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
}
