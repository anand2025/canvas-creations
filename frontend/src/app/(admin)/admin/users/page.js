"use client";
import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { toast } from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSeller, setNewSeller] = useState({
    name: '',
    email: '',
    password: 'Seller@123', // Dummy strong password
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data); 
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSeller = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding seller...");
    try {
      await adminApi.addSeller(newSeller);
      setIsModalOpen(false);
      setNewSeller({ name: '', email: '', password: 'Seller@123' });
      fetchUsers();
      toast.success("Seller added successfully! Email sent.", { id: loadingToast });
    } catch (error) {
      console.error("Failed to add seller", error);
      toast.error(error.message || "Failed to add seller", { id: loadingToast });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-foreground">Users</h1>
           <p className="text-foreground/50">View registered users and manage sellers</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-vibrant-teal text-white px-6 py-3 rounded-xl font-bold hover:bg-vibrant-teal/90 transition-all shadow-lg active:scale-95"
        >
          + Add Seller
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl p-6 border border-[var(--border-color)] animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black mb-1">Add New Seller</h2>
            <p className="text-sm text-foreground/50 mb-6">Create a seller account and send login details via email.</p>
            
            <form onSubmit={handleAddSeller} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 ml-1 text-foreground/70">Full Name</label>
                <input 
                  type="text" 
                  value={newSeller.name}
                  onChange={(e) => setNewSeller({...newSeller, name: e.target.value})}
                  className="w-full bg-secondary-bg border border-[var(--border-color)] rounded-xl p-3 focus:ring-2 focus:ring-vibrant-teal outline-none transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 ml-1 text-foreground/70">Email Address</label>
                <input 
                  type="email" 
                  value={newSeller.email}
                  onChange={(e) => setNewSeller({...newSeller, email: e.target.value})}
                  className="w-full bg-secondary-bg border border-[var(--border-color)] rounded-xl p-3 focus:ring-2 focus:ring-vibrant-teal outline-none transition-all"
                  placeholder="seller@example.com"
                  required
                />
              </div>
              <div className="p-3 bg-secondary-bg/50 rounded-xl border border-dashed border-[var(--border-color)]">
                <p className="text-xs text-foreground/60">
                   <span className="font-bold text-vibrant-teal">Note:</span> The initial password will be <code className="bg-secondary px-1 rounded">Seller@123</code>. The seller will be notified to change it upon login.
                </p>
              </div>
              
              <div className="flex gap-4 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-3 rounded-xl border border-[var(--border-color)] font-bold hover:bg-secondary-hover transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-xl bg-vibrant-teal text-white font-bold hover:bg-vibrant-teal/90 transition-all shadow-md active:scale-95"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden transition-colors duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-secondary-bg border-b border-[var(--border-color)]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[var(--border-color)]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-secondary-hover transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-foreground/40">{user.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 font-bold text-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800' 
                        : user.role === 'seller'
                        ? 'bg-vibrant-teal/10 text-vibrant-teal border border-vibrant-teal/20 dark:bg-vibrant-teal/10 dark:text-vibrant-teal dark:border-vibrant-teal/30'
                        : 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                    }`}>
                        {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                        Active
                    </span>
                  </td>
                </tr>
              ))}
               {users.length === 0 && (
                <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        No users found.
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
