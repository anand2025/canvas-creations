"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/services/adminApi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await adminApi.getPaintings();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this painting?")) return;
    try {
      await adminApi.deletePainting(id);
      setProducts(products.filter(p => p.id !== id));
      // You might want to use a toast notification here
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product");
    }
  };

  const handleToggleBestseller = async (id, currentStatus) => {
    try {
        await adminApi.toggleBestseller(id, currentStatus);
        setProducts(products.map(p => 
            p.id === id ? { ...p, is_bestseller: currentStatus } : p
        ));
    } catch (error) {
        console.error("Failed to toggle bestseller", error);
        alert("Failed to update bestseller status");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-foreground">Products</h1>
           <p className="text-foreground/50">Manage your painting collection</p>
        </div>
        <Link 
          href="/admin/products/add" 
          className="bg-vibrant-teal hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-teal-500/30 flex items-center justify-center md:justify-start"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add New Painting
        </Link>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden transition-colors duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary-bg border-b border-[var(--border-color)]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bestseller</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[var(--border-color)]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary-hover transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-16 w-16 relative rounded-lg overflow-hidden bg-secondary-bg transition-colors">
                        {product.image_url ? (
                            <Image 
                                src={product.image_url} 
                                alt={product.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">{product.title}</td>
                  <td className="px-6 py-4 text-foreground/70 font-medium">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <button 
                        onClick={() => handleToggleBestseller(product.id, !product.is_bestseller)}
                        className={`p-2 rounded-full transition-colors ${
                            product.is_bestseller 
                            ? 'text-yellow-400 hover:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                        title={product.is_bestseller ? "Remove from Bestsellers" : "Add to Bestsellers"}
                    >
                        <svg className="w-5 h-5" fill={product.is_bestseller ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 0 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/admin/products/edit/${product.id}`}
                        className="text-gray-400 hover:text-vibrant-teal transition-colors"
                        title="Edit"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No products found. Start by adding one!
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
