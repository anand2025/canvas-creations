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
           <h1 className="text-3xl font-black text-gray-900 dark:text-white">Inventory</h1>
           <p className="text-gray-500 dark:text-gray-400">Manage painting stock levels</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-zinc-950/50 border-b dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Update Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className="h-10 w-10 relative rounded overflow-hidden bg-gray-100 mr-3">
                            {product.image_url ? (
                                <Image src={product.image_url} alt={product.title} fill className="object-cover" />
                            ) : null }
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category}</td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 5
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                        {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        {editingId === product.id ? (
                            <>
                                <input 
                                    type="number" 
                                    min="0"
                                    className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
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
