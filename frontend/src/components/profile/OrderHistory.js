'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';
import ConfirmModal from '@/components/common/ConfirmModal';
import styles from './profile.module.css';
import OrderCard from '@/components/ui/OrderCard';

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
            <OrderCard 
              key={order.id} 
              order={order} 
              variant="customer"
              onViewDetails={onSelectOrder}
              onCancel={handleCancelOrder}
              showCancel={order.status.toLowerCase() === 'pending'}
            />
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
