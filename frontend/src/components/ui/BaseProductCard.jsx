"use client";
import React from 'react';
import Image from 'next/image';

const BaseProductCard = ({ 
  product, 
  actions, 
  ratings,
  variant = 'default', // 'default', 'compact'
  className = ''
}) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`group relative bg-card rounded-3xl overflow-hidden border border-[var(--border-color)] transition-all flex flex-col h-full ${className}`}>
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-secondary-bg">
            {product.image_url ? (
                <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-vibrant-teal/5 italic text-foreground/20">
                    No image
                </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isOutOfStock && (
                    <span className="px-3 py-1 bg-gray-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        Sold Out
                    </span>
                )}
                {product.is_bestseller && (
                    <span className="px-3 py-1 bg-vibrant-teal/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-teal-500/20">
                        Bestseller
                    </span>
                )}
            </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="text-lg font-bold group-hover:text-vibrant-teal transition-colors line-clamp-1">{product.title}</h3>
                <span className="text-vibrant-teal font-black text-lg whitespace-nowrap">₹{Math.round(product.price)}</span>
            </div>
            
            {ratings && (
                <div className="mb-3">
                    {ratings}
                </div>
            )}
            
            <p className="text-foreground/60 text-xs mb-4 line-clamp-2">{product.description}</p>
            
            <div className="mt-auto space-y-4">
                {/* Stock Indicator */}
                <div className="flex justify-end items-center text-[10px] font-black uppercase tracking-widest">
                    <span className={isOutOfStock ? 'text-vibrant-pink' : 'text-vibrant-teal'}>
                        {isOutOfStock ? 'Out of Stock' : `${product.stock} Units`}
                    </span>
                </div>

                {/* Slot for Actions */}
                <div className="flex gap-2">
                    {actions}
                </div>
            </div>
        </div>
    </div>
  );
};

export default BaseProductCard;
