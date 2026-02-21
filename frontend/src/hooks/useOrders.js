import { useState, useCallback, useEffect } from 'react';

export const useOrders = (fetchFn, initialStatus = '', initialTimeRange = 'all') => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(initialStatus);
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total_count: 0,
    total_pages: 1
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        time_range: timeRange
      };
      if (status) params.status = status;

      const data = await fetchFn(params);
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
  }, [page, status, timeRange, fetchFn]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus, updateFn) => {
    try {
      await updateFn(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      return true;
    } catch (error) {
      console.error("Failed to update order status", error);
      return false;
    }
  };

  return {
    orders,
    loading,
    status,
    setStatus: (s) => { setStatus(s); setPage(1); },
    timeRange,
    setTimeRange: (t) => { setTimeRange(t); setPage(1); },
    page,
    setPage,
    pagination,
    updateOrderStatus,
    refreshOrders: fetchOrders
  };
};
