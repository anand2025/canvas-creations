"use client";
import React from 'react';
import { getStatusColorClasses } from '@/utils/statusStyles';

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-[var(--border-color)] rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Order Details</h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColorClasses(order.status, 'solid')}`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs font-mono text-foreground/30 mt-1">ID: {order.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-bg hover:bg-secondary-hover transition-colors text-foreground/60"
          >
            ✕
          </button>
        </div>

        <div className="p-8 space-y-12">
          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-vibrant-teal flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-vibrant-teal shadow-[0_0_8px_rgba(45,212,191,0.5)]"></span>
                Target Information
              </h3>
              <div className="bg-secondary-bg/50 p-6 rounded-3xl border border-[var(--border-color)] space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-1">Customer</label>
                  <p className="font-bold text-lg">{order.customer_name || order.shipping_address?.full_name || 'Guest'}</p>
                </div>
                {order.customer_email && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-1">Email</label>
                    <p className="font-bold">{order.customer_email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-vibrant-pink flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-vibrant-pink shadow-[0_0_8px_rgba(236,72,153,0.5)]"></span>
                Order Info
              </h3>
              <div className="bg-secondary-bg/50 p-6 rounded-3xl border border-[var(--border-color)] space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-1">Date Placed</label>
                  <p className="font-bold">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block mb-1">Payment Method</label>
                  <p className="font-bold uppercase tracking-widest text-sm">{order.payment_method}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-vibrant-orange flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-vibrant-orange shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
              Order Items
            </h3>
            <div className="bg-secondary-bg/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-secondary-bg/80 border-b border-[var(--border-color)]">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Item</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Qty</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-secondary-bg/80 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm leading-tight text-foreground">{item.title || 'Painting'}</p>
                        <p className="font-mono text-[10px] text-foreground/40 mt-1">ID: {item.painting_id.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="px-6 py-4 font-black text-center">{item.quantity}</td>
                      <td className="px-6 py-4 font-black text-right">₹{item.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-secondary-bg/30 font-black">
                  <tr>
                    <td className="px-6 py-3 text-[10px] uppercase tracking-widest text-foreground/40 text-right" colSpan="2">Subtotal</td>
                    <td className="px-6 py-3 text-right">₹{order.total_price.toLocaleString()}</td>
                  </tr>
                  {order.shipping_cost !== undefined && (
                    <tr>
                      <td className="px-6 py-3 text-[10px] uppercase tracking-widest text-foreground/40 text-right" colSpan="2">Shipping</td>
                      <td className="px-6 py-3 text-right text-vibrant-teal">+ ₹{order.shipping_cost.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-[var(--border-color)]">
                    <td className="px-6 py-6 text-sm uppercase tracking-widest text-foreground/40 text-right" colSpan="2">Grand Total</td>
                    <td className="px-6 py-6 text-right text-2xl text-vibrant-teal">₹{(order.grand_total || order.total_price).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-vibrant-purple flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-vibrant-purple shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                Shipping Destination
              </h3>
              <div className="bg-secondary-bg/80 p-8 rounded-3xl border-2 border-dashed border-vibrant-purple/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="font-black text-xl mb-4 text-vibrant-purple">{order.shipping_address.full_name}</p>
                    <p className="text-foreground/70 font-semibold leading-relaxed">
                      {order.shipping_address.address_line1}<br />
                      {order.shipping_address.address_line2 && <>{order.shipping_address.address_line2}<br /></>}
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                      {order.shipping_address.country}
                    </p>
                  </div>
                  <div className="flex flex-col justify-end items-end">
                      <div className="bg-vibrant-purple/10 px-4 py-3 rounded-2xl border border-vibrant-purple/20">
                          <span className="text-[10px] font-black uppercase tracking-widest text-vibrant-purple block mb-1">Contact Phone</span>
                          <p className="font-black text-lg">{order.shipping_address.phone}</p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="bg-secondary-bg/50 px-8 py-6 border-t border-[var(--border-color)] flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-card border border-[var(--border-color)] font-black uppercase text-xs tracking-widest hover:bg-secondary-hover transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
