"use client";
import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';

export default function SellerEditProduct() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await api.get('/seller/paintings');
        const product = products.find(p => p.id === id);
        if (product) {
          setInitialData(product);
        } else {
          alert('Product not found');
          router.push('/seller/products');
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await api.put(`/seller/paintings/${id}`, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      
      router.push('/seller/products');
    } catch (error) {
      console.error("Failed to update product", error);
      alert("Failed to update product: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-foreground/40 font-bold uppercase tracking-widest animate-pulse">Loading Artwork...</div>;

  return (
    <ProductForm 
      title="Edit Painting"
      subtitle="Refine the details of your artwork."
      submitLabel="Save Changes"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/seller/products')}
      isLoading={submitting}
    />
  );
}
