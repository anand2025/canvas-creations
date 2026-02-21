"use client";
import React, { useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';

export default function SellerAddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (!formData.title || !formData.price || !formData.image_url) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      await api.post('/seller/paintings', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      
      router.push('/seller/products');
    } catch (error) {
      console.error("Failed to create product", error);
      alert("Failed to create product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm 
      title="Add New Painting"
      subtitle="Exhibit your masterpiece in the gallery."
      submitLabel="Create Painting"
      onSubmit={handleSubmit}
      onCancel={() => router.push('/seller/products')}
      isLoading={loading}
    />
  );
}
