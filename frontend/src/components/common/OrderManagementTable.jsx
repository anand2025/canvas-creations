import React from 'react';
import { getStatusColorClasses } from '@/utils/statusStyles';

const OrderManagementTable = ({ 
  orders, 
  loading, 
  onViewDetails, 
  onStatusChange,
  showCustomer = true,
  showActions = true
}) => {
  return (
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
              {showCustomer && <th className="px-6 py-4 text-sm font-bold text-foreground/50 uppercase tracking-wider">Customer</th>}
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
                    onClick={() => onViewDetails(order)}
                    className="text-sm font-mono text-foreground/40 hover:text-vibrant-teal hover:font-bold transition-all underline decoration-dotted underline-offset-4"
                  >
                    #{order.id.substring(0, 8).toUpperCase()}
                  </button>
                </td>
                {showCustomer && (
                  <td className="px-6 py-4 text-base font-bold text-foreground">
                    {order.customer_name || "Guest"}
                  </td>
                )}
                <td className="px-6 py-4 text-base text-foreground/60">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-base font-black text-foreground">
                  ₹{(order.grand_total || order.total_price || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {showActions ? (
                    <select 
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value)}
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ring-1 ring-inset ring-current/20 focus:ring-2 focus:ring-vibrant-teal cursor-pointer appearance-none bg-transparent transition-all hover:bg-white/5 ${getStatusColorClasses(order.status)}`}
                    >
                      <option value="pending" className="bg-card text-amber-500 font-bold">Pending</option>
                      <option value="processing" className="bg-card text-blue-500 font-bold">Processing</option>
                      <option value="shipped" className="bg-card text-purple-500 font-bold">Shipped</option>
                      <option value="delivered" className="bg-card text-emerald-500 font-bold">Delivered</option>
                      <option value="cancelled" className="bg-card text-rose-500 font-bold">Cancelled</option>
                    </select>
                  ) : (
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ring-1 ring-inset ring-current/20 ${getStatusColorClasses(order.status)}`}>
                      {order.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-base text-foreground/60">
                  {order.items?.length || 0} items
                </td>
              </tr>
            ))}
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan={showCustomer ? 6 : 5} className="px-6 py-12 text-center text-base text-foreground/50">
                  No orders found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagementTable;
