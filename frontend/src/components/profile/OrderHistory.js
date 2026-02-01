'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/services/api';
import styles from './profile.module.css';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Order History</h2>
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
          <p>You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className={styles.ordersGrid}>
          {filteredOrders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <div className={styles.orderId}>Order #{order.id.slice(-8)}</div>
                  <div className={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <div 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </div>
              </div>

              <div className={styles.orderDetails}>
                <div className={styles.orderItems}>
                  <strong>{order.items.length}</strong> item(s)
                </div>
                <div className={styles.orderTotal}>
                  Total: <strong>₹{order.grand_total.toLocaleString()}</strong>
                </div>
              </div>

              <div className={styles.orderActions}>
                <button 
                  className={styles.viewButton}
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className={styles.modal} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Order Details</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.orderInfo}>
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedOrder.status) }}>{selectedOrder.status}</span></p>
                <p><strong>Payment Method:</strong> {selectedOrder.payment_method.toUpperCase()}</p>
              </div>

              <div className={styles.orderItemsList}>
                <h4>Items</h4>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <div>Painting ID: {item.painting_id}</div>
                    <div>Quantity: {item.quantity}</div>
                    <div>Price: ₹{item.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.total_price.toLocaleString()}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping:</span>
                  <span>₹{selectedOrder.shipping_cost.toLocaleString()}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>Total:</span>
                  <span>₹{selectedOrder.grand_total.toLocaleString()}</span>
                </div>
              </div>

              <div className={styles.shippingAddress}>
                <h4>Shipping Address</h4>
                <p>{selectedOrder.shipping_address.full_name}</p>
                <p>{selectedOrder.shipping_address.address_line1}</p>
                {selectedOrder.shipping_address.address_line2 && (
                  <p>{selectedOrder.shipping_address.address_line2}</p>
                )}
                <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}</p>
                <p>{selectedOrder.shipping_address.country}</p>
                <p>Phone: {selectedOrder.shipping_address.phone}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
