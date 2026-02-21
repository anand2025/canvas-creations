"use client";
import React from 'react';
import StatusBadge from './StatusBadge';

const OrderCard = ({ 
  order, 
  variant = 'customer', // 'customer' or 'seller'
  onViewDetails,
  onCancel,
  showCancel = false
}) => {
  const isSeller = variant === 'seller';
  
  return (
    <div className="bg-card rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Order ID</span>
            <h3 className="text-lg font-mono font-bold text-foreground">#{order.id.slice(-8).toUpperCase()}</h3>
          </div>
          <div className="flex gap-3 items-center">
            <StatusBadge status={order.status} variant={isSeller ? 'outline' : 'solid'} />
            <span className="text-sm text-foreground/50">{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className={`grid grid-cols-1 ${isSeller ? 'lg:grid-cols-3' : ''} gap-8`}>
          <div className={`${isSeller ? 'lg:col-span-2' : ''} space-y-4`}>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Purchased Items</h4>
            {isSeller ? (
              /* Detailed Items for Seller */
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-secondary-bg/30 p-3 rounded-xl border border-[var(--border-color)]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-vibrant-teal/10 rounded-lg flex items-center justify-center font-bold text-vibrant-teal">
                        {item.quantity}x
                      </div>
                      <span className="font-medium text-foreground text-sm line-clamp-1">{item.title || `Item #${idx + 1}`}</span>
                    </div>
                    <span className="font-bold text-foreground">₹{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              /* Summary Items for Customer */
              <div className="bg-secondary-bg/30 p-4 rounded-xl border border-[var(--border-color)]/30 flex justify-between items-center">
                <span className="font-bold text-foreground/60">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
                <span className="text-lg font-black text-foreground">₹{(order.grand_total || order.total_price).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Details / Actions Section */}
          <div className={`${isSeller ? 'bg-secondary-bg/20' : ''} p-6 rounded-2xl border border-[var(--border-color)]/50 flex flex-col justify-between`}>
            <div className="space-y-4">
              {isSeller ? (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">Customer</h4>
                  <p className="font-bold text-sm">{order.customer_name}</p>
                  <p className="text-xs text-foreground/60">{order.customer_email}</p>
                </div>
              ) : (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">Payment</h4>
                  <p className="font-bold text-sm uppercase">{order.payment_method}</p>
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--border-color)]/30 flex flex-col gap-3">
              {onViewDetails && (
                <button 
                  onClick={() => onViewDetails(order)}
                  className="w-full py-2.5 rounded-xl bg-vibrant-teal/10 hover:bg-vibrant-teal/20 text-vibrant-teal font-bold text-sm transition-colors text-center"
                >
                  View Full Details
                </button>
              )}
              {showCancel && onCancel && (
                <button 
                  onClick={() => onCancel(order.id)}
                  className="w-full py-2.5 rounded-xl border border-vibrant-pink/30 hover:bg-vibrant-pink/5 text-vibrant-pink font-bold text-sm transition-colors text-center"
                >
                  Cancel Order
                </button>
              )}
              {isSeller && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-foreground/60">Earning</span>
                  <span className="text-xl font-bold text-vibrant-teal">₹{order.total_price.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
