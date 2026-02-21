"use client";
import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const paintings = await adminApi.getPaintings();
        const product = paintings.find(p => p.id === id);
        if (product) {
          setInitialData(product);
        } else {
          alert('Product not found');
          router.push('/admin/products');
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
      await adminApi.updatePainting(id, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      
      router.push('/admin/products');
    } catch (error) {
      console.error("Failed to update product", error);
      alert("Failed to update product: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-foreground/40 font-bold uppercase tracking-widest animate-pulse">Loading Details...</div>;

  return (
    <ProductForm 
      title="Edit Painting"
      subtitle="Refine the masterpiece details."
      submitLabel="Save Changes"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/admin/products')}
      isLoading={submitting}
    />
  );
}
