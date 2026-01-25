/**
 * ProductCard Component
 * Displays a single product with a vibrant card design and hover effects.
 */
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }) => {
    return (
        <div className="group relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 hover:border-vibrant-pink/50 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2">
            <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {product.image_url && (product.image_url.startsWith('http') || product.image_url.startsWith('/')) ? (
                    <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-vibrant-pink/10 flex items-center justify-center">
                        <span className="text-vibrant-pink font-black text-4xl opacity-20">CC</span>
                    </div>
                )}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="p-2 rounded-full glass-vibrant text-white hover:bg-vibrant-pink transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold group-hover:text-vibrant-pink transition-colors line-clamp-1">{product.title}</h3>
                    <span className="text-vibrant-teal font-black text-lg">${product.price}</span>
                </div>
                <p className="text-foreground/60 text-sm mb-6 line-clamp-2">{product.description}</p>
                
                <Link 
                    href={`/product/${product.id}`}
                    className="block w-full text-center py-3 rounded-2xl bg-foreground text-background font-bold hover:bg-vibrant-orange hover:text-white transition-all transform active:scale-95"
                >
                    Add to Cart
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
