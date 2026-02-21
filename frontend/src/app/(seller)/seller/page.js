"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_paintings: 0,
    active_orders: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/seller/stats');
        setStats(response);
      } catch (error) {
        console.error("Error fetching seller stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 w-1/4 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>)}
      </div>
    </div>;
  }

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: `₹${stats.total_revenue.toLocaleString()}`, 
      icon: (
        <div className="p-3 bg-vibrant-teal/10 text-vibrant-teal rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
      )
    },
    { 
      label: 'My Products', 
      value: stats.total_paintings, 
      icon: (
        <div className="p-3 bg-vibrant-blue/10 text-vibrant-blue rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
      )
    },
    { 
      label: 'Active Orders', 
      value: stats.active_orders || 0, 
      icon: (
        <div className="p-3 bg-vibrant-purple/10 text-vibrant-purple rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Seller Dashboard</h1>
        <p className="text-foreground/60">Welcome back! Here&apos;s what&apos;s happening with your products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-card p-6 rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/50">{card.label}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-2xl border border-[var(--border-color)]">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-vibrant-teal/10 hover:bg-vibrant-teal/20 text-vibrant-teal rounded-xl text-center transition-colors">
              <span className="block text-lg font-bold">Add Product</span>
              <span className="text-sm opacity-70">List a new painting</span>
            </button>
            <Link 
              href="/seller/orders"
              className="p-4 bg-vibrant-blue/10 hover:bg-vibrant-blue/20 text-vibrant-blue rounded-xl text-center transition-colors block"
            >
              <span className="block text-lg font-bold">View Orders</span>
              <span className="text-sm opacity-70">Manage sales</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-2xl border border-[var(--border-color)] flex items-center justify-center text-foreground/40 italic">
          More insights coming soon...
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
