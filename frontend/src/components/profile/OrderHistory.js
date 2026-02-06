'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';
import ConfirmModal from '@/components/common/ConfirmModal';
import styles from './profile.module.css';

export default function OrderHistory({ onSelectOrder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiRequest('/orders/user');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'var(--vibrant-orange)',
      processing: 'var(--vibrant-teal)',
      shipped: 'var(--vibrant-purple)',
      delivered: 'var(--vibrant-teal)',
      cancelled: 'var(--vibrant-pink)',
    };
    return colors[status.toLowerCase()] || 'var(--foreground)';
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter);

  const handleCancelOrder = async (orderId) => {
    setOrderToCancel(orderId);
    setShowConfirmModal(true);
  };

  const confirmCancellation = async () => {
    if (!orderToCancel) return;
    
    try {
      await apiRequest(`/orders/${orderToCancel}/cancel`, { method: 'PUT' });
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error.message || 'Failed to cancel order');
    } finally {
      setOrderToCancel(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.section}>
      <div className={styles.sectionHeader} style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Order History</h2>
        <div className={styles.filterGroup}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h3>No orders found</h3>
          <p>You haven&apos;t placed any orders yet</p>
        </div>
      ) : (
        <div className={styles.ordersGrid}>
          {filteredOrders.map((order) => (
            <div key={order.id} className={styles.orderCard} style={{ padding: '1.25rem' }}>
              <div className={styles.orderHeader} style={{ marginBottom: '0.75rem' }}>
                <div>
                  <div className={styles.orderId}>Order #{order.id.slice(-8)}</div>
                  <div className={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(order.status), padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                >
                  {order.status}
                </div>
              </div>

              <div className={styles.orderDetails} style={{ padding: '0.75rem 1.25rem', margin: '0.75rem 0' }}>
                <div className={styles.orderItems}>
                  <strong>{order.items.length}</strong> item(s)
                </div>
                <div className={styles.orderTotal}>
                  Total: <strong>₹{order.grand_total.toLocaleString()}</strong>
                </div>
              </div>

              <div className={styles.orderActions} style={{ gap: '0.75rem', display: 'flex' }}>
                <button 
                  className={styles.viewButton}
                  onClick={() => onSelectOrder(order)}
                >
                  View Details
                </button>
                {order.status.toLowerCase() === 'pending' && (
                  <button 
                    className={styles.cancelButton}
                    style={{ 
                      padding: '0.6rem 1.25rem', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem',
                      color: 'var(--vibrant-pink)',
                      borderColor: 'var(--vibrant-pink)'
                    }}
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      </div>


      <ConfirmModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmCancellation}
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? This will restore the items back to our stock."
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep It"
      />
    </>
  );
}
