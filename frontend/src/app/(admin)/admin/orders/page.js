"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/services/adminApi';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';


export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total_count: 0,
    total_pages: 1
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        time_range: timeRange
      };
      if (status) params.status = status;

      const data = await adminApi.getOrders(params);
      setOrders(data.orders);
      setPagination({
        total_count: data.total_count,
        total_pages: data.total_pages
      });
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  }, [page, status, timeRange]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Failed to update order status", error);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100/10 text-amber-500 border border-amber-500/20';
      case 'processing': return 'bg-blue-100/10 text-blue-500 border border-blue-500/20';
      case 'shipped': return 'bg-purple-100/10 text-purple-500 border border-purple-500/20';
      case 'delivered': return 'bg-emerald-100/10 text-emerald-500 border border-emerald-500/20';
      case 'cancelled': return 'bg-rose-100/10 text-rose-500 border border-rose-500/20';
      default: return 'bg-secondary-bg text-foreground/70';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-foreground">Orders</h1>
           <p className="text-foreground/50">Manage and track customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-card p-4 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-widest text-foreground/40">Status:</span>
            <select 
                value={status} 
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="bg-secondary-bg border-[var(--border-color)] rounded-xl text-sm font-bold px-4 py-2 focus:ring-vibrant-teal text-foreground"
            >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>

        <div className="flex items-center gap-2 text-foreground/40">
            <span className="text-sm font-bold uppercase tracking-widest">Time:</span>
            <select 
                value={timeRange} 
                onChange={(e) => { setTimeRange(e.target.value); setPage(1); }}
                className="bg-secondary-bg border-[var(--border-color)] rounded-xl text-sm font-bold px-4 py-2 focus:ring-vibrant-teal text-foreground"
            >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
            </select>
        </div>
        
        <div className="ml-auto text-sm font-bold text-foreground/40 uppercase tracking-widest">
            Total Results: <span className="text-foreground">{pagination.total_count}</span>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden transition-colors duration-500 relative">
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-vibrant-teal/20 border-t-vibrant-teal rounded-full animate-spin"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary-bg border-b border-[var(--border-color)]">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-foreground/50 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-sm font-bold text-foreground/50 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-sm font-bold text-foreground/50 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-sm font-bold text-foreground/50 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-sm font-bold text-foreground/50 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-foreground/50 uppercase tracking-wider">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[var(--border-color)]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-secondary-hover transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                      className="text-sm font-mono text-foreground/40 hover:text-vibrant-teal hover:font-bold transition-all underline decoration-dotted underline-offset-4"
                    >
                      {order.id.substring(0, 8)}...
                    </button>
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-foreground">
                      {order.customer_name || "Guest"}
                  </td>
                  <td className="px-6 py-4 text-base text-foreground/60">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-base font-black text-foreground">₹{order.grand_total || order.total_price}</td>
                  <td className="px-6 py-4">
                    <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ring-1 ring-inset ring-current/20 focus:ring-2 focus:ring-vibrant-teal cursor-pointer appearance-none bg-transparent transition-all hover:bg-white/5 ${getStatusColor(order.status)}`}
                    >
                        <option value="pending" className="bg-card text-amber-500 font-bold">Pending</option>
                        <option value="processing" className="bg-card text-blue-500 font-bold">Processing</option>
                        <option value="shipped" className="bg-card text-purple-500 font-bold">Shipped</option>
                        <option value="delivered" className="bg-card text-emerald-500 font-bold">Delivered</option>
                        <option value="cancelled" className="bg-card text-rose-500 font-bold">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-base text-foreground/60">
                     {order.items?.length || 0} items
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !loading && (
                <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-base text-foreground/50">
                        No orders found matching your criteria.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-6 py-2 rounded-xl bg-card border border-[var(--border-color)] font-bold text-sm uppercase tracking-widest disabled:opacity-30 hover:bg-secondary-bg transition-colors text-foreground"
            >
                Previous
            </button>
            <div className="flex items-center gap-2">
                {[...Array(pagination.total_pages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-lg font-black text-sm transition-all ${page === i + 1 ? 'bg-vibrant-teal text-white shadow-lg' : 'bg-card border border-[var(--border-color)] text-foreground/40 hover:text-foreground'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
                disabled={page === pagination.total_pages}
                className="px-6 py-2 rounded-xl bg-card border border-[var(--border-color)] font-bold text-sm uppercase tracking-widest disabled:opacity-30 hover:bg-secondary-bg transition-colors text-foreground"
            >
                Next
            </button>
        </div>
      )}

      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
