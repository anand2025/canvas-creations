"use client";
import React from 'react';
import Link from 'next/link';
import { api } from '@/services/api';
import BaseProductCard from '@/components/ui/BaseProductCard';
import StarRating from '@/components/reviews/StarRating';
import { useProducts } from '@/hooks/useProducts';

const fetchSellerPaintings = () => api.get('/seller/paintings');
const deleteSellerPainting = (id) => api.delete(`/seller/paintings/${id}`);

const SellerProductsPage = () => {

  const {
    products,
    loading,
    deleteProduct
  } = useProducts(fetchSellerPaintings);

  const handleDelete = (id) => {
    deleteProduct(id, deleteSellerPainting);
  };

  if (loading) return <div className="text-center py-10 text-foreground/40 font-bold uppercase tracking-widest animate-pulse">Loading Collection...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link 
          href="/seller/products/add"
          className="bg-vibrant-teal text-white px-6 py-3 rounded-xl font-bold hover:bg-vibrant-teal/90 transition-all shadow-lg shadow-teal-500/20"
        >
          Add New Painting
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <BaseProductCard 
            key={product.id} 
            product={product}
            ratings={
                <div className="flex items-center gap-2">
                     <StarRating rating={product.rating || 0} readOnly size="xs" />
                     <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">({product.num_reviews || 0})</span>
                </div>
            }
            actions={
              <>
                <Link 
                  href={`/seller/products/edit/${product.id}`}
                  className="flex-1 bg-vibrant-blue/10 text-vibrant-blue py-2.5 rounded-xl font-bold text-xs hover:bg-vibrant-blue/20 transition-colors text-center"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-500/10 text-red-500 py-2.5 rounded-xl font-bold text-xs hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default SellerProductsPage;
