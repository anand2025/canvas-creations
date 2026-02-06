'use client';

import { useState, useEffect } from 'react';
import PersonalInfo from '@/components/profile/PersonalInfo';
import OrderHistory from '@/components/profile/OrderHistory';
import AddressBook from '@/components/profile/AddressBook';
import AccountSettings from '@/components/profile/AccountSettings';
import ProfileStats from '@/components/profile/ProfileStats';
import styles from '@/components/profile/profile.module.css';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Body Scroll Lock
  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOrder]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'var(--vibrant-orange)',
      processing: 'var(--vibrant-teal)',
      shipped: 'var(--vibrant-purple)',
      delivered: 'var(--vibrant-teal)',
      cancelled: 'var(--vibrant-pink)',
    };
    return colors[status?.toLowerCase()] || 'var(--foreground)';
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'orders', label: 'Order History', icon: '📦' },
    { id: 'addresses', label: 'Address Book', icon: '📍' },
    { id: 'settings', label: 'Account Settings', icon: '⚙️' },
  ];

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>My Profile</h1>
        <p>Manage your account and preferences</p>
      </div>

      <ProfileStats />

      <div className={styles.profileContent}>
        {/* Sidebar Navigation */}
        <div className={styles.sidebar}>
          <nav className={styles.tabNav}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {activeTab === 'personal' && <PersonalInfo />}
          {activeTab === 'orders' && <OrderHistory onSelectOrder={setSelectedOrder} />}
          {activeTab === 'addresses' && <AddressBook />}
          {activeTab === 'settings' && <AccountSettings />}
        </div>
      </div>

      {/* Order Details Modal - Rendered at Root Level to escape parent transforms/filters */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
          <div 
            className="absolute inset-0 backdrop-blur-md transition-opacity" 
            style={{ backgroundColor: 'var(--modal-overlay)' }}
            onClick={() => setSelectedOrder(null)}
          />
          
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-card border border-[var(--border-color)] rounded-[2rem] flex flex-col" style={{ boxShadow: 'var(--shadow-xl)' }}>
            {/* Header */}
            <div className="sticky top-0 z-10 backdrop-blur-xl px-6 py-2 border-b border-[var(--border-color)] flex items-center justify-between" style={{ backgroundColor: 'var(--glass-surface)' }}>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Order Details</h2>
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white`}
                    style={{ 
                      backgroundColor: getStatusColor(selectedOrder.status),
                      boxShadow: `0 0 15px ${getStatusColor(selectedOrder.status)}44`
                    }}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-sm font-mono text-foreground/30">ID: {selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-secondary-bg hover:bg-secondary-hover transition-colors text-foreground/60 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-3 space-y-3">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-vibrant-teal flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-vibrant-teal"></span>
                    Order Summary
                  </h3>
                  <div className="bg-secondary-bg/30 p-3 rounded-2xl border border-[var(--border-color)] space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Date</label>
                      <p className="font-bold text-sm">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Payment</label>
                      <p className="font-bold uppercase text-sm">{selectedOrder.payment_method}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-vibrant-pink flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-vibrant-pink"></span>
                    Financials
                  </h3>
                  <div className="bg-secondary-bg/30 p-3 rounded-2xl border border-[var(--border-color)] space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-foreground/40 uppercase">Subtotal</span>
                      <span className="font-black italic">₹{selectedOrder.total_price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-foreground/40 uppercase">Shipping</span>
                      <span className="font-black text-vibrant-teal italic">₹{selectedOrder.shipping_cost.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-[var(--border-color)] flex justify-between items-center">
                      <span className="font-black uppercase text-sm text-foreground/30">Total</span>
                      <span className="text-xl font-black text-vibrant-pink">₹{selectedOrder.grand_total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-widest text-vibrant-orange flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-vibrant-orange"></span>
                  Items
                </h3>
                <div className="bg-secondary-bg/30 rounded-2xl border border-[var(--border-color)] overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary-bg/50 border-b border-[var(--border-color)]">
                      <tr>
                        <th className="px-4 py-3 text-xs font-black uppercase tracking-widest text-foreground/40">Item</th>
                        <th className="px-4 py-3 text-xs font-black uppercase tracking-widest text-foreground/40 text-center">Qty</th>
                        <th className="px-4 py-3 text-xs font-black uppercase tracking-widest text-foreground/40 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="hover:bg-secondary-bg/50 transition-colors">
                          <td className="px-4 py-2.5">
                            <p className="font-black uppercase tracking-tight text-sm leading-tight">{item.title || 'Painting'}</p>
                            <p className="text-xs font-mono text-foreground/30">#{item.painting_id.slice(-6)}</p>
                          </td>
                          <td className="px-4 py-2.5 font-black text-center text-sm">{item.quantity}</td>
                          <td className="px-4 py-2.5 font-black text-right text-sm">₹{item.price.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Shipping */}
              <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-widest text-vibrant-purple flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-vibrant-purple"></span>
                  Shipping
                </h3>
                <div className="bg-secondary-bg/30 p-4 rounded-2xl border border-[var(--border-color)]">
                  <div className="flex flex-col md:flex-row justify-between gap-3">
                    <div>
                      <p className="font-black text-base text-vibrant-purple uppercase tracking-tighter mb-1">{selectedOrder.shipping_address.full_name}</p>
                      <p className="text-sm text-foreground/70 font-semibold leading-relaxed">
                        {selectedOrder.shipping_address.address_line1}, {selectedOrder.shipping_address.address_line2 && <>{selectedOrder.shipping_address.address_line2}, </>}
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}
                      </p>
                    </div>
                    <div className="bg-vibrant-purple/5 px-3 py-2 rounded-xl border border-vibrant-purple/10 self-start md:self-center">
                      <span className="text-xs font-black uppercase tracking-widest text-vibrant-purple block">Contact Details</span>
                      <p className="font-black text-sm">📞 {selectedOrder.shipping_address.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-secondary-bg/50 px-6 py-3 border-t border-[var(--border-color)] flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 rounded-full bg-card border border-[var(--border-color)] font-black uppercase text-sm tracking-widest hover:bg-secondary-hover transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
