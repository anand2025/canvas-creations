"use client";
import React, { useState } from 'react';
import { adminApi } from '@/services/adminApi';
import OrderDetailsModal from '@/components/ui/OrderDetailsModal';
import OrderManagementTable from '@/components/common/OrderManagementTable';
import { useOrders } from '@/hooks/useOrders';

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    orders,
    loading,
    status,
    setStatus,
    timeRange,
    setTimeRange,
    page,
    setPage,
    pagination,
    updateOrderStatus
  } = useOrders(adminApi.getOrders);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus, adminApi.updateOrderStatus);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
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
                onChange={(e) => setStatus(e.target.value)}
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
                onChange={(e) => setTimeRange(e.target.value)}
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

      <OrderManagementTable 
        orders={orders}
        loading={loading}
        onViewDetails={handleViewDetails}
        onStatusChange={handleStatusChange}
      />

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
