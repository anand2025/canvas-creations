"use client";
import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await adminApi.getDashboardStats();

        // Pending orders calculation still needs order list or we can add it to stats endpoint later. 
        // For now, let's keep fetching orders for pending status if needed, 
        // OR simpler: just assume we want the quick stats for now.
        // The previous code fetched all orders just for "pending" count which is heavy. 
        // Let's rely on the stats endpoint for main numbers. 
        // NOTE: Our backend stats endpoint returns { total_revenue, total_orders, total_users, total_paintings }
        
        // If we really want pending count without fetching all orders, we should update backend.
        // For now, I will fetch orders lightly or just show the stats we have.
        // Let's stick to the high-level stats which was the goal. 
        // If pending is critical, I'll recommend adding it to backend stats.
        // Let's assume we update state directly.
        
        setStats({
          products: stats.total_paintings,
          orders: stats.total_orders,
          users: stats.total_users,
          revenue: stats.total_revenue,
          pendingOrders: stats.total_pending_orders
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">
    <div className="h-32 bg-secondary-bg rounded-2xl"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       {[1,2,3,4].map(i => <div key={i} className="h-32 bg-secondary-bg rounded-2xl"></div>)}
    </div>
  </div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground">Dashboard</h1>
        <p className="text-foreground/50">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.revenue.toFixed(2)}`} 
          icon={<svg className="w-8 h-8 text-vibrant-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-vibrant-teal/10"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.orders} 
          icon={<svg className="w-8 h-8 text-vibrant-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>}
          color="bg-vibrant-pink/10"
        />
        <StatCard 
          title="Paintings" 
          value={stats.products} 
          icon={<svg className="w-8 h-8 text-vibrant-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
          color="bg-vibrant-orange/10"
        />
        <StatCard 
          title="Users" 
          value={stats.users} 
          icon={<svg className="w-8 h-8 text-vibrant-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
          color="bg-vibrant-purple/10"
        />
      </div>

      {/* Quick Actions or Recent Activity could go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-card rounded-2xl p-6 shadow-sm border border-[var(--border-color)]">
            <h2 className="text-xl font-bold mb-4">Pending Orders</h2>
            {stats.pendingOrders > 0 ? (
               <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl">
                 <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 <span className="font-medium">You have {stats.pendingOrders} orders waiting for processing.</span>
               </div>
            ) : (
                <div className="text-foreground/50 font-medium">No pending orders. Good job!</div>
            )}
            <div className="mt-4">
                 <a href="/admin/orders" className="text-vibrant-teal font-bold hover:underline">View All Orders &rarr;</a>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-[var(--border-color)] flex items-center transition-transform hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-foreground/50 text-sm font-bold uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-foreground">{value}</p>
      </div>
    </div>
  );
}
