"use client";
import React, { useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';

export default function AddProduct() {
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

      await adminApi.createPainting({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      
      router.push('/admin/products');
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
      subtitle="Expose a new masterpiece to the world."
      submitLabel="Create Painting"
      onSubmit={handleSubmit}
      onCancel={() => router.push('/admin/products')}
      isLoading={loading}
    />
  );
}
