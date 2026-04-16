/**
 * Main Landing Page (Home) — Server Component
 * Fetches featured products server-side so the page ships pre-rendered HTML.
 * No loading spinner needed for the initial product grid.
 */
import React from 'react';
import Hero from "@/components/layout/Hero";
import ProductCard from "@/components/products/ProductCard";
import NewsletterSection from "@/components/layout/NewsletterSection";

async function getFeaturedProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/paintings/bestsellers`, {
      // Cache for 5 minutes — stale-while-revalidate keeps it fast
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Canvas & Creations | Vibrant Handcrafted Art",
  description: "Explore our collection of bright and vibrant mini-paintings and handmade crafts.",
};

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

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
            {featuredProducts.length > 0 ? (
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

      {/* Newsletter CTA */}
      <NewsletterSection />

      {/* Footer */}
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
