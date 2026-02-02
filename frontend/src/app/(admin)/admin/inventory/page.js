"use client";
import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import Image from 'next/image';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newStock, setNewStock] = useState({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await adminApi.getInventory();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id) => {
    const stockValue = newStock[id];
    if (stockValue === undefined || stockValue === '') return;

    try {
      await adminApi.updateInventory(id, parseInt(stockValue));
      setProducts(products.map(p => 
        p.id === id ? { ...p, stock: parseInt(stockValue) } : p
      ));
      setEditingId(null);
      setNewStock({ ...newStock, [id]: undefined });
    } catch (error) {
      console.error("Failed to update stock", error);
      alert("Failed to update stock");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Inventory...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-foreground">Inventory</h1>
           <p className="text-foreground/50">Manage painting stock levels</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden transition-colors duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary-bg border-b border-[var(--border-color)]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Update Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[var(--border-color)]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary-hover transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className="h-10 w-10 relative rounded overflow-hidden bg-gray-100 mr-3">
                            {product.image_url ? (
                                <Image src={product.image_url} alt={product.title} fill className="object-cover" />
                            ) : null }
                        </div>
                        <span className="font-bold text-foreground">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground/50 font-medium">{product.category}</td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        product.stock > 5
                        ? 'bg-green-100/80 text-green-700 border border-green-200/50' 
                        : product.stock > 0
                        ? 'bg-amber-100 text-amber-700 border border-amber-200/50'
                        : 'bg-red-100 text-red-700 border border-red-200/50'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                             product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        {product.stock} {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        {editingId === product.id ? (
                            <>
                                <input 
                                    type="number" 
                                    min="0"
                                    className="w-20 px-2 py-1 rounded border border-[var(--border-color)] bg-card text-foreground text-sm focus:ring-1 focus:ring-vibrant-teal outline-none"
                                    value={newStock[product.id] !== undefined ? newStock[product.id] : product.stock}
                                    onChange={(e) => setNewStock({ ...newStock, [product.id]: e.target.value })}
                                />
                                <button 
                                    onClick={() => handleUpdateStock(product.id)}
                                    className="text-green-500 hover:text-green-600"
                                >
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </button>
                                <button 
                                    onClick={() => setEditingId(null)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => setEditingId(product.id)}
                                className="text-vibrant-teal font-medium text-sm hover:underline"
                            >
                                Adjust
                            </button>
                        )}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
